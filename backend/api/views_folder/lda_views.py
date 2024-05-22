from rest_framework.decorators import api_view, permission_classes
# from sentence_transformers import SentenceTransformer, util
from rest_framework.response import Response
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.metrics import silhouette_score, pairwise_distances
from gensim.models.coherencemodel import CoherenceModel
from gensim import corpora
from sklearn.manifold import TSNE
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import silhouette_score, pairwise_distances
import codecs
import math
from googletrans import Translator
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import pickle
import nltk
import time
import numpy as np
from collections import Counter
from nltk.corpus import stopwords
import string
import json
import os

# model = SentenceTransformer('sentence-transformers/all-MiniLM-L12-v2') 

custom_stopwords = set(["im", "i'm", "ve", "would" , 'ive'])
stop_words = set(stopwords.words('english')).union(custom_stopwords)
stop_words = sorted(stop_words)
punctuation = set(string.punctuation)
translator = str.maketrans("", "", string.punctuation)

# samle text_clustering_lda payload
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
def text_clustering_lda(request):
    def all_equal(iterator):
      iterator = iter(iterator)
      try:
          first = next(iterator)
      except StopIteration:
          return True
      return all(first == x for x in iterator)
    
    tokens = []
    responseData = json.loads(request.body)

    if(responseData['vectorizer_type'] == "count-vectorizer"):
      vectorizer = CountVectorizer(stop_words=stop_words, max_df=responseData['maximum_df_value'], min_df=responseData['minimum_df_value'])

    else:
      vectorizer = TfidfVectorizer(stop_words=stop_words, max_df=responseData['maximum_df_value'], min_df=responseData['minimum_df_value'])

    X = vectorizer.fit_transform(responseData['preprocessed_text'])
    # Apply LDA

    for i in responseData['preprocessed_text']:
       tokens.append(i.split())

    dictionary = corpora.Dictionary(tokens)
    n_topics = (responseData['num_topics'])  # Number of topics/clusters
    lda = LatentDirichletAllocation(n_components=n_topics, random_state=43, topic_word_prior=responseData['alpha_value'], doc_topic_prior=responseData['beta_value'], learning_method='batch', max_iter=50)

    document_topic_distribution = lda.fit_transform(X)
    # print(document_topic_distribution)
    # predicted_clusters = np.argmax(document_topic_distribution, axis=1)
    predicted_clusters = []
    for topic_distribution in document_topic_distribution:
       if(all_equal(topic_distribution)):
          predicted_clusters.append(0)
       else:
          
          predicted_clusters.append(np.argmax(topic_distribution, axis=0) + 1)
          

    feature_names = vectorizer.get_feature_names_out()
    topic_coherance_score = [0]
    topics = [['No Topics', 'No T']]
    clusters = {}

    for topic_idx, topic in enumerate(lda.components_):
        top_words_indices = topic.argsort()[:-45:-1]  # Get indices of top 10 words for each topic
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

   #  for index, topicsPerCluster in enumerate(topics):
   #     print(str(index) + ". " + " ".join(topicsPerCluster[:10]))

    pickled_vectorizer = codecs.encode(pickle.dumps(vectorizer), "base64").decode()
    pickled_lda_model = codecs.encode(pickle.dumps(lda), "base64").decode()
    
    # print("Silhouette Score:", silhouette_avg)
    
    return Response(data={
        "document_topic_distribution" : document_topic_distribution,
        "predicted_clusters": predicted_clusters,
        "topic_coherance_score" : topic_coherance_score,
        "clusters" : clusters,
        "topics" : topics,

        "vectorizer" : pickled_vectorizer,
        "lda_model" : pickled_lda_model,
    })

# @api_view(['POST'])
# def train_lda_classifier(request):
#    classifierTrainingData = json.loads(request.body)
#    classifierTrainingData = classifierTrainingData['lda_training_data']
   
#   #  document_similarity_matrix = pairwise_distances(classifierTrainingData[2], metric='cosine')
#   #  silhouette_scores = silhouette_score(document_similarity_matrix, classifierTrainingData[1])
   
#   #  print("Average Silhouette Score:", silhouette_scores)
          
#    lda_trained_classifier = make_pipeline(CountVectorizer(stop_words='english'),
#                       MultinomialNB())
#   #  lda_trained_classifier = MultinomialNB()
#    lda_trained_classifier = lda_trained_classifier.fit(classifierTrainingData[0], classifierTrainingData[1])
   
#    pickled_lda_classifier = codecs.encode(pickle.dumps(lda_trained_classifier), "base64").decode()

#    return Response(data={
#       "lda_trained_classifier" : pickled_lda_classifier
#    })

@api_view(['POST'])
def train_lda_classifier(request):
   classifierTrainingData = json.loads(request.body)
  #  classifierTrainingData = classifierTrainingData['lda_training_data']
   if(classifierTrainingData['vectorizer_type'] == "count-vectorizer"):
      vectorizer = CountVectorizer(stop_words=stop_words, max_df=classifierTrainingData['maximum_df_value'], min_df=classifierTrainingData['minimum_df_value'])
   else:
      vectorizer = TfidfVectorizer(stop_words=stop_words, max_df=classifierTrainingData['maximum_df_value'], min_df=classifierTrainingData['minimum_df_value'])

   vectorizedDocuments = vectorizer.fit_transform(classifierTrainingData['lda_training_data'][0])

   ldaModel = pickle.loads(codecs.decode(classifierTrainingData['ldaModel'].encode(), "base64"))

   topic_distribution = ldaModel.fit_transform(vectorizedDocuments)

   featureVectors = np.hstack((vectorizedDocuments.toarray(), topic_distribution))

   trained_lda_classifier = MultinomialNB()  # You can choose any classifier
   trained_lda_classifier.fit(featureVectors, classifierTrainingData['lda_training_data'][1])
   
   vectorizedDocumentToClassify = vectorizer.transform(["World"])
  #  print(vectorizedDocumentToClassify)

   featureVectorsOfDocumentToClassify = np.hstack((vectorizedDocumentToClassify.toarray(), ldaModel.transform(vectorizedDocumentToClassify)))

   classifierResult = trained_lda_classifier.predict(featureVectorsOfDocumentToClassify)
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
   pickled_ldamodel = codecs.encode(pickle.dumps(ldaModel), "base64").decode()

   return Response(data={
      "lda_trained_classifier" : pickled_lda_classifier,
      "vectorizer" : pickled_vectorizer,
      "lda_model" : pickled_ldamodel,
      
   })

@api_view(['POST'])
def lda_classify_document(request):
   def translate_to_english(text):
        translator = Translator()
        translated_text = translator.translate(text, src='auto', dest='en')
        return translated_text.text

   payload = json.loads(request.body)
   classifier = payload['lda_trained_classifier']
   documents = payload['documents'][0]

   classifier = pickle.loads(codecs.decode(classifier.encode(), "base64"))
   unpickled_vectorizer = pickle.loads(codecs.decode( payload['vectorizer'].encode(), "base64"))
   unpickled_lda_model = pickle.loads(codecs.decode( payload['ldaModel'].encode(), "base64"))
   
   documents = documents.translate(translator)
   documents = documents.replace('“', '').replace('”', '').replace('’', "'").replace('.', '')
   documents = documents.lower()
   
   temp = []
   for word in documents.split():
     if word not in stop_words and not word.isdigit():
        temp.append(word)

   documents = " ".join(temp)
   print(translate_to_english(documents))
   vectorizedDocumentToClassify = unpickled_vectorizer.transform([translate_to_english(documents)])
   featureVectorsOfDocumentToClassify = np.hstack((vectorizedDocumentToClassify.toarray(), unpickled_lda_model.transform(vectorizedDocumentToClassify)))
  #  print("RED")
  #  print(unpickled_lda_model.transform(vectorizedDocumentToClassify))
   documentClassifierResult = classifier.predict(featureVectorsOfDocumentToClassify)
   documentClassifierResultEstimate = classifier.predict_proba(featureVectorsOfDocumentToClassify)
   
  #  print(documentClassifierResultEstimate)
   return Response(
        data={
           "lda_classifier_result" : documentClassifierResult,
           "lda_classifier_result_destribution" : documentClassifierResultEstimate,
           "lda_classifier_result_destribution_v2" : documentClassifierResultEstimate[0],
           "classifier_labels" : classifier.classes_,
           'document_tokens' : temp,
           'pDocument' : documents
        }
   )   

# @api_view(['POST'])
# def lda_classify_document(request):
#    payload = json.loads(request.body)
#    classifier = payload['lda_trained_classifier']
#    documents = payload['documents'][0]

#    classifier = pickle.loads(codecs.decode(classifier.encode(), "base64"))
#    documents = documents.translate(translator)
#    documents = documents.replace('“', '').replace('”', '').replace('’', "'").replace('.', '')
#    documents = documents.lower()
   
#    temp = []
#    for word in documents.split():
#      if word not in stop_words and not word.isdigit():
#         temp.append(word)

#    documents = " ".join(temp)    
  
#    documentClassifierResult = classifier.predict([documents])
#    documentClassifierResultEstimate = classifier.predict_proba([documents])
   
#    print(documentClassifierResultEstimate)
#    return Response(
#         data={
#            "lda_classifier_result" : documentClassifierResult,
#            "lda_classifier_result_destribution" : documentClassifierResultEstimate,
#            "lda_classifier_result_destribution_v2" : documentClassifierResultEstimate[0],
#            "classifier_labels" : classifier.classes_,
#            'document_tokens' : temp,
#            'pDocument' : documents
#         }
#    )
   
# @api_view(['POST'])
# def text_clustering_lda_v2(request):
#     def all_equal(iterator):
#       iterator = iter(iterator)
#       try:
#           first = next(iterator)
#       except StopIteration:
#           return True
#       return all(first == x for x in iterator)
    
#     tokens = []
#     responseData = json.loads(request.body)

#     if(responseData['vectorizer_type'] == "count-vectorizer"):
#       vectorizer = CountVectorizer(stop_words=stop_words, max_df=responseData['maximum_df_value'], min_df=responseData['minimum_df_value'])

#     else:
#       vectorizer = TfidfVectorizer(stop_words=stop_words, max_df=responseData['maximum_df_value'], min_df=responseData['minimum_df_value'])

#     X = vectorizer.fit_transform(responseData['preprocessed_text'])

#     for i in responseData['preprocessed_text']:
#        tokens.append(i.split())

#     dictionary = corpora.Dictionary(tokens)
#     n_topics = responseData['num_topics']
#     lda = LatentDirichletAllocation(n_components=n_topics, random_state=43, topic_word_prior=responseData['alpha_value'], doc_topic_prior=responseData['beta_value'], learning_method='batch', max_iter=50)

#     document_topic_distribution = lda.fit_transform(X)
#     predicted_clusters = []
#     for topic_distribution in document_topic_distribution:
#        if(all_equal(topic_distribution)):
#           predicted_clusters.append(0)
#        else:
#           predicted_clusters.append(np.argmax(topic_distribution, axis=0) + 1)
          

#     feature_names = vectorizer.get_feature_names_out()
#     topic_coherance_score = [0]
#     topics = [['No Topics', 'No T']]
#     clusters = {}

#     for topic_idx, topic in enumerate(lda.components_):
#         top_words_indices = topic.argsort()[:-45:-1]  # Get indices of top 10 words for each topic
#         top_words = [feature_names[i] for i in top_words_indices]
#         topics.append(top_words)
    
#     for index, topic in enumerate(topics[1:]):
#         coherence_model_lda = CoherenceModel(topics=[topic], texts=tokens, dictionary=dictionary, coherence='u_mass')
#         coherence_score = coherence_model_lda.get_coherence()
#         topic_coherance_score.append(coherence_score)
    
#     for i in range(0, n_topics + 1):
#       clusters[i] = []

#     for index, value in enumerate(predicted_clusters):
#       clusters[value].append(index)
    
#     for topic_idx, topic in enumerate(lda.components_):
#         top_words_indices = topic.argsort()[:-45:-1]  # Get indices of top 10 words for each topic
#         top_words = [feature_names[i] for i in top_words_indices]
#       #   print("topic " + str(topic_idx), " ".join(top_words))

#     clustersv2 = []
    
#     embeddings = model.encode(responseData['preprocessed_text']) 

#     topic_embeddings = {}

#     def get_most_similar_topic(sentence_embedding, topic_embeddings, documentIndex):
#       max_similarity = -1.0
#       most_similar_topic_id = -1
#       similarity_distribution = []
#       for topic_id, topic_embedding in topic_embeddings.items():
#          similarity = 1 - cosine_similarity(sentence_embedding, topic_embedding)  # Cosine similarity
#         #  similarity = util.pytorch_cos_sim(sentence_embedding, topic_embedding)[0]

#         #  print("document: " + responseData['preprocessed_text'][documentIndex], "| topic: " + str(topics[topic_id+1][:7]), "| Similarity Score: " + str(similarity))
         
#         #  for topic in topics[topic_id + 1][:7]:
#         #     if topic in responseData['preprocessed_text'][documentIndex].split(" "):
#         #        similarity += 0.5
#          if similarity < 0:
#             similarity = 0

#          similarity_distribution.append(similarity)

#          if similarity > max_similarity:
#             max_similarity = similarity
#             most_similar_topic_id = topic_id
#       # print(similarity_distribution)

#       return most_similar_topic_id + 1, max_similarity, similarity_distribution

#     for i, topic in enumerate(topics[1:]):
#     # Get word embeddings from the model (if using preprocessed topics)
#       # topic_word_embeddings = [model.encode(word) for word in topic[:7]]
#       topic_word_embeddings = model.encode(" ".join(topic[:7]))

#       # Average word embeddings to create topic embedding
#       # topic_embedding = np.mean(topic_word_embeddings, axis=0)
#       topic_embeddings[i] = topic_word_embeddings
    
#     clusters = {}
#     for i in range(0, n_topics + 1):
#       clusters[i] = []
   
#     def calculate_percentage_per_number(similarity_distribution):
#       """
#       This function takes a list of numbers (similarity_distribution) and calculates the sum,
#       then returns a dictionary where each number is a key and its corresponding percentage is the value.
#       """

#       # Calculate the sum of all 
#       # temp = []
#       # for i in similarity_distribution:
#       #    temp.append(abs(i))

#       total_sum = sum(similarity_distribution)

#       percentage_per_number = []

#       # Loop through each number in the list
#       if total_sum == 0:
#         for number in similarity_distribution:
#           percentage_per_number.append(1/n_topics)
#       else:
#         for number in similarity_distribution:
#           percentage = (number / total_sum)
#           percentage = round(percentage, 10)
#           percentage_per_number.append(percentage) 
#         # print(percentage_per_number)
#       return percentage_per_number
    
#     document_topic_distribution_similarity = []
#     for documentIndex, sentence_embedding in enumerate(embeddings):
#       #  print(topic_embeddings)
#        most_similar_topic_id, similarity, similarity_distribution = get_most_similar_topic(sentence_embedding, topic_embeddings, documentIndex)
#        document_topic_distribution_similarity.append(calculate_percentage_per_number(similarity_distribution))
#        clustersv2.append(most_similar_topic_id)  
#        clusters[most_similar_topic_id].append(documentIndex)

#     # true_clusters = []
#     # for index, clusterId in enumerate(clustersv2):
#     #    if clusterId == predicted_clusters[index]:
#     #       true_clusters.append(clusterId)
#     #    else:
#     #       true_clusters.append(0)
  
#     # for documentIndex, clusterId in enumerate(true_clusters):
#     #    clusters[clusterId].append(documentIndex)
       
#     # print(clusters)
#     # print(document_topic_distribution_similarity)
    
#    #  for index, value in enumerate(clustersv2):
#    #    clusters[value].append(index)

#    #  for i in responseData['preprocessed_text']:
#    #     cosine_similarity_list = []
#    #     for topic_idx, listOftopics in enumerate(topics[1:]):
#    #        cosine_similarity_list.append(cosine_similarity(vectortizer.fit_transform([i, " ".join(listOftopics[:10])]))[0][1])
#    #       #  print(cosine_similarity(vectortizer.fit_transform([i, " ".join(listOftopics)]))[0][1])
#    #     sum_of_lists = sum(cosine_similarity_list)
#    #     percentage_list = []
#    #     for i in cosine_similarity_list: 
#    #       percentage_list.append((i / sum_of_lists))
      
#    #     if math.isnan(percentage_list[0]):
#    #        percentage_list = [1 / n_topics] * n_topics

#    #     if (all_equal(percentage_list)):
#    #        clustersv2.append(0)
#    #     else:
#    #        clustersv2.append(np.argmax(percentage_list, axis=0) + 1)
#    #     document_topic_distribution_v2.append(percentage_list)
    
#    #  for index, value in enumerate(predicted_clusters):
#    #     clusters[value].append(index)
#    #  clusters = {}
#    #  for i in range(0, n_topics + 1):
#    #    clusters[i] = []
#    #  for index, value in enumerate(clustersv2):
#    #    clusters[value].append(index)

#     return Response(data={
#          "document_topic_distribution" : document_topic_distribution_similarity,
#          "predicted_clusters": clustersv2,
#          "topic_coherance_score" : topic_coherance_score,
#          "clusters" : clusters,
#          "topics" : topics,
#         # "vectorizer" : pickled_vectorizer,
#         # "lda_model" : pickled_lda_model,
#      })