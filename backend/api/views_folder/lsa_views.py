from django.shortcuts import render, HttpResponse
from gensim.models.coherencemodel import CoherenceModel
from gensim import corpora
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from sklearn.naive_bayes import MultinomialNB
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation, TruncatedSVD
from sklearn.preprocessing import normalize
import nltk
import time
import numpy as np
from collections import Counter
from nltk.corpus import stopwords
import string
import json
import os
import pickle
import codecs
from sklearn.cluster import KMeans
# sample payload sent to text_clustering_lsa 
'''
{
  "preprocessed_text": [
    "Shout out to the particular hell that is functional depression. This is me. Don’t get me wrong, it’s better than don’t-leave-my-bed-for-a-week depression. I am grateful I can be an independent person. But there is something uniquely horrible about being able to go to work every day, occasionally clean up after yourself, pay your bills, generally put yourself together enough to look like a human being... but that’s it. Nothing else. No social life. No hobbies. Constantly battling your mind. And being absolutely fucking exhausted all the time.",
    "I hate that people don’t understand that i don’t want to kill myself, I just don’t want to be alive anymore",
    "If 10 years ago someone told me that in 10 years I would be routinely sitting in my room all day doing nothing to make myself a successful man but eat, sleep and use my phone/pc and sometimes go out for a lonely aimless walks, I would never believe them But here I am, 24 years old man and doing exactly that.",
    "It’s like I died at 15, but my body just kept on living. I’m trapped inside. Does anyone else get that feeling? My memories from the past few years are shoddy at best. I think I’m losing it.",
    "High-functioning depression: I feel like I'm living a double life. I read a lot of posts on here of people struggling with daily, debilitating depression that plagues every aspect of their lives, making it difficult to do small things like even take a shower. I feel that I am on the opposite side of the spectrum and wanted to share that it is equally as horrible.\n\nFrom an outsider's perspective, I appear to be a very happy and stable individual. I have a financially secure job and I go to work every day and not only try my best but actively try to get along with others and make people laugh every day. My coworkers like me, and some look up to me. No one would think I have any problems at all. However, I feel like I am hidden behind a veil, and when I come home from work and when I am in the privacy of my home, I am in such crippling depression. I have such terrible episodes of sadness. I hate myself. I over-analyze everything stupid I do or say throughout the day and I replay it in my mind constantly and belittle myself. I don't feel proud of myself for any of my accomplishments and genuinely don't know why anyone even likes me. And yet I still get up every day, live this routine, and put on a facade like I am okay. It feels like I am living a double life that I cannot escape."
  ],
  "num_topics" : 4
}
'''

# Create your views here.from django.shortcuts import render, HttpResponse
from gensim.models.coherencemodel import CoherenceModel
from gensim import corpora
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation, TruncatedSVD
from sklearn.preprocessing import normalize
import nltk
import time
import numpy as np
from collections import Counter
from nltk.corpus import stopwords
import string
import json
import os


custom_stopwords = set(["im", "i'm", "ve", "would" , 'ive'])
stop_words = set(stopwords.words('english')).union(custom_stopwords)
stop_words = sorted(stop_words)
punctuation = set(string.punctuation)
translator = str.maketrans("", "", string.punctuation)

# sample payload sent to text_clustering_lsa 
'''
{
  "preprocessed_text": [
    "Shout out to the particular hell that is functional depression. This is me. Don’t get me wrong, it’s better than don’t-leave-my-bed-for-a-week depression. I am grateful I can be an independent person. But there is something uniquely horrible about being able to go to work every day, occasionally clean up after yourself, pay your bills, generally put yourself together enough to look like a human being... but that’s it. Nothing else. No social life. No hobbies. Constantly battling your mind. And being absolutely fucking exhausted all the time.",
    "I hate that people don’t understand that i don’t want to kill myself, I just don’t want to be alive anymore",
    "If 10 years ago someone told me that in 10 years I would be routinely sitting in my room all day doing nothing to make myself a successful man but eat, sleep and use my phone/pc and sometimes go out for a lonely aimless walks, I would never believe them But here I am, 24 years old man and doing exactly that.",
    "It’s like I died at 15, but my body just kept on living. I’m trapped inside. Does anyone else get that feeling? My memories from the past few years are shoddy at best. I think I’m losing it.",
    "High-functioning depression: I feel like I'm living a double life. I read a lot of posts on here of people struggling with daily, debilitating depression that plagues every aspect of their lives, making it difficult to do small things like even take a shower. I feel that I am on the opposite side of the spectrum and wanted to share that it is equally as horrible.\n\nFrom an outsider's perspective, I appear to be a very happy and stable individual. I have a financially secure job and I go to work every day and not only try my best but actively try to get along with others and make people laugh every day. My coworkers like me, and some look up to me. No one would think I have any problems at all. However, I feel like I am hidden behind a veil, and when I come home from work and when I am in the privacy of my home, I am in such crippling depression. I have such terrible episodes of sadness. I hate myself. I over-analyze everything stupid I do or say throughout the day and I replay it in my mind constantly and belittle myself. I don't feel proud of myself for any of my accomplishments and genuinely don't know why anyone even likes me. And yet I still get up every day, live this routine, and put on a facade like I am okay. It feels like I am living a double life that I cannot escape."
  ],
  "num_topics" : 4
}
'''

# Create your views here.
@api_view(['POST'])
def text_clustering_lsa(request):
    def all_equal(iterator):
      iterator = iter(iterator)
      try:
          first = next(iterator)
      except StopIteration:
          return True
      return all(first == x for x in iterator)

    responseData = json.loads(request.body)
    tokens = []

    if(responseData['vectorizer_type'] == "count-vectorizer"):
      vectorizer = CountVectorizer(stop_words=stop_words, max_df=responseData['maximum_df_value'], min_df=responseData['minimum_df_value'])

    else:
      vectorizer = TfidfVectorizer(stop_words=stop_words, max_df=responseData['maximum_df_value'], min_df=responseData['minimum_df_value'])
        
    for i in responseData['preprocessed_text']:
        tokens.append(i.split())
        
    X = vectorizer.fit_transform(responseData['preprocessed_text'])
    # print(X.shape)
    # Apply LDA
    dictionary = corpora.Dictionary(tokens)
    n_topics = (responseData['num_topics'])  # Number of topics/clusters
    lsa = TruncatedSVD(n_components=n_topics, random_state=42)

    document_topic_distribution = lsa.fit_transform(X)
    document_topic_distribution_normalized = normalize(document_topic_distribution, norm='l1')
    predicted_clusters = []

    document_topic_distribution_positive = np.abs(document_topic_distribution_normalized)
    
    for topic_distribution in document_topic_distribution_positive:
       if(all_equal(topic_distribution)):
          predicted_clusters.append(0)
       else:
          
          predicted_clusters.append(np.argmax(topic_distribution, axis=0) + 1)

    feature_names = vectorizer.get_feature_names_out()
    topics = []

    topic_coherance_score = [0]
    topics = [['No Topics', 'No T']]
    clusters = {}

    for topic_idx, topic in enumerate(lsa.components_):
        top_words_indices = topic.argsort()[:-50:-1]  # Get indices of top 10 words for each topic
        top_words = [feature_names[i] for i in top_words_indices]
        topics.append(top_words)
    
    for index, topic in enumerate(topics[1:]):
        coherence_model_lda = CoherenceModel(topics=[topic], texts=tokens, dictionary=dictionary, coherence='u_mass')
        coherence_score = coherence_model_lda.get_coherence()
        topic_coherance_score.append(coherence_score)
    
    for i in range(0, n_topics + 1):
      clusters[i] = []

    for index, value in enumerate(predicted_clusters):
      clusters[value].append(index)
    
    pickled_vectorizer = codecs.encode(pickle.dumps(vectorizer), "base64").decode()
    pickled_lda_model = codecs.encode(pickle.dumps(lsa), "base64").decode()

    return Response(data={
        "document_topic_distribution" : document_topic_distribution_positive,
        "predicted_clusters": predicted_clusters,
        "topic_coherance_score" : topic_coherance_score,
        "clusters" : clusters,
        "topics" : topics,

        "vectorizer" : pickled_vectorizer,
        "lda_model" : pickled_lda_model,
    })


@api_view(['POST'])
def train_lsa_classifier(request):
   classifierTrainingData = json.loads(request.body)
   
  #  print(classifierTrainingData['lda_training_data'][0])
  #  classifierTrainingData = classifierTrainingData['lda_training_data']
   if(classifierTrainingData['vectorizer_type'] == "count-vectorizer"):
      vectorizer = CountVectorizer(stop_words=stop_words, max_df=classifierTrainingData['maximum_df_value'], min_df=classifierTrainingData['minimum_df_value'])
   else:
      vectorizer = TfidfVectorizer(stop_words=stop_words, max_df=classifierTrainingData['maximum_df_value'], min_df=classifierTrainingData['minimum_df_value'])

   vectorizedDocuments = vectorizer.fit_transform(classifierTrainingData['lda_training_data'][0])

   lsaModel = pickle.loads(codecs.decode(classifierTrainingData['ldaModel'].encode(), "base64"))

   topic_distribution = lsaModel.fit_transform(vectorizedDocuments)

   document_topic_distribution_normalized = normalize(topic_distribution, norm='l1')

   document_topic_distribution_positive = np.abs(document_topic_distribution_normalized)
   
   featureVectors = np.hstack((vectorizedDocuments.toarray(), document_topic_distribution_positive))

  #  kmeans = KMeans(n_clusters=6, random_state=42)

  #  # Cluster the feature vectors
  #  kmeansCluster = kmeans.fit_predict(featureVectors)

  #  clusters = {}
   
  #  for i in range(0, 6):
  #    clusters[i] = []

  #  for index, value in enumerate(kmeansCluster):
  #    clusters[value].append(index)
    
  
  #  for i in clusters:
  #     print("length of cluster:", i, "|", str(len(clusters[i])))


   trained_lda_classifier = MultinomialNB()  # You can choose any classifier
   trained_lda_classifier.fit(featureVectors, classifierTrainingData['lda_training_data'][1])
   

  #  vectorizedDocumentToClassify = vectorizer.transform(["machine learning"])

  #  featureVectorsOfDocumentToClassify = np.hstack((vectorizedDocumentToClassify.toarray(), np.abs(normalize(lsaModel.transform(vectorizedDocumentToClassify),  norm='l1'))))

  #  classifierResult = trained_lda_classifier.predict(featureVectorsOfDocumentToClassify)
  #  print(classifierResult)
  #  print(y_pred)
  #  document_similarity_matrix = pairwise_distances(classifierTrainingData[2], metric='cosine')
  #  silhouette_scores = silhouette_score(document_similarity_matrix, classifierTrainingData[1])
   
  #  print("Average Silhouette Score:", silhouette_scores)
          
  #  lda_trained_classifier = make_pipeline(CountVectorizer(stop_words='english'),
  #                     MultinomialNB())
  # #  lda_trained_classifier = MultinomialNB()
  #  lda_trained_classifier = lda_trained_classifier.fit(classifierTrainingData[0], classifierTrainingData[1])
   
   pickled_lda_classifier = codecs.encode(pickle.dumps(trained_lda_classifier), "base64").decode()
   pickled_vectorizer = codecs.encode(pickle.dumps(vectorizer), "base64").decode()
   pickled_lsaModel = codecs.encode(pickle.dumps(lsaModel), "base64").decode()

   return Response(data={
      "lda_trained_classifier" : pickled_lda_classifier,
      "vectorizer" : pickled_vectorizer,
      "lda_model" : pickled_lsaModel,
      
   })

  #  return Response(data={
  #     "lda_trained_classifier" : "green",
  #     "vectorizer" : "green",
  #     "lda_model" : "green",
          
  #  })
