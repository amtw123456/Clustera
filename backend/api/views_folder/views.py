from django.shortcuts import render, HttpResponse
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import silhouette_score, pairwise_distances
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from googletrans import Translator
import codecs
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.manifold import TSNE
import nltk
import time
import numpy as np
from collections import Counter
from nltk.corpus import stopwords
import string
import json
import os
import pickle
from nltk.stem import PorterStemmer



nltk.download('stopwords')
lemma = WordNetLemmatizer()
stemmer = PorterStemmer()
# Load data from a JSON file

# Extract text content from the data

custom_stopwords = set(["im", "i'm", "ve", "would" , 'ive', 'x200b'])
stop_words = set(stopwords.words('english')).union(custom_stopwords)
stop_words = sorted(stop_words)
punctuation = set(string.punctuation)
translator = str.maketrans("", "", string.punctuation)
print(stop_words)

# sample payload
"""
{
  [
    {
        "postTitle": "Shout out to the particular hell that is functional depression.",
        "postText": "Shout out to the particular hell that is functional depression. This is me. Don\u2019t get me wrong, it\u2019s better than don\u2019t-leave-my-bed-for-a-week depression. I am grateful I can be an independent person. But there is something uniquely horrible about being able to go to work every day, occasionally clean up after yourself, pay your bills, generally put yourself together enough to look like a human being... but that\u2019s it. Nothing else. No social life. No hobbies. Constantly battling your mind. And being absolutely fucking exhausted all the time.",
        "subreddit": "depression",
        "label": 0
    },
  ]
}
"""


# Create your views here.
@api_view(['POST'])
def text_tokenization(request):
    responseData = json.loads(request.body)
    # print(responseData)

    def count_words_in_documents(document_contents):
        total_word_counts = Counter()

        # Process each document content
        for content in document_contents:
            words = content.split()
            total_word_counts.update(words)

        return total_word_counts
    
    start_time = time.time()
    # json_file_path = os.path.join(os.path.dirname(__file__), 'output.json')
    # # json_file_path = 'output.json'  # Update with your actual file path
    # with open(json_file_path, 'r') as file:
    #     data = json.load(file)

    texts = [item.get('text', '') for item in responseData['documents']]
    # print(texts)

    filtered_documents = []
    for document in texts:
        temp = []
        document = document.translate(translator)
        document = document.replace('“', '').replace('”', '').replace('’', "'").replace('.', '')
        document = document.lower()

        # for word in document.split():
        #     if word not in stop_words and not word.isdigit():
        #         temp.append(word)

        # temp = []
        # for word in document.split():
        #     lemmatized_word = WordNetLemmatizer().lemmatize(word)
        #     temp.append(lemmatized_word)
        
        # filtered_documents.append(" ".join(temp))
        filtered_documents.append(document)
    
    # total_word_counts = count_words_in_documents(filtered_documents)
    # print(total_word_counts.items())
    # filtered_words = [word for word, count in total_word_counts.items() if count < 0]

    PreProcessedInfo = []
    listOfDocuments = []

    if responseData['enableLemmitization'] == True and responseData['enableStemming'] == True:
        for document in filtered_documents:
            temp = []

            for word in document.split():
                # if word not in stop_words and not word.isdigit() and word not in filtered_words and len(word) < 50:
                
                if word not in stop_words and not word.isdigit() and len(word) < 50:
                    lemmatized_word = WordNetLemmatizer().lemmatize(word)
                    stemmed_word = stemmer.stem(lemmatized_word)
                    temp.append(stemmed_word)
                
        
            document = " ".join(temp)    
            listOfDocuments.append(document)
            PreProcessedInfo.append([{"postText": document}, {"postTokens" : temp}])

    
    elif responseData['enableLemmitization'] == True:    
        for document in filtered_documents:
            temp = []

            for word in document.split():
                # if word not in stop_words and not word.isdigit() and word not in filtered_words and len(word) < 50:
                
                if word not in stop_words and not word.isdigit() and len(word) < 50:
                    lemmatized_word = WordNetLemmatizer().lemmatize(word)
                    temp.append(lemmatized_word)
                            
            document = " ".join(temp)    
            listOfDocuments.append(document)
            PreProcessedInfo.append([{"postText": document}, {"postTokens" : temp}])
    
    
    elif responseData['enableStemming'] == True:    
        for document in filtered_documents:
            temp = []

            for word in document.split():
                # if word not in stop_words and not word.isdigit() and word not in filtered_words and len(word) < 50:
                
                if word not in stop_words and not word.isdigit() and len(word) < 50:
                    stemmed_word = stemmer.stem(word)
                    temp.append(stemmed_word)
                
            document = " ".join(temp)    
            listOfDocuments.append(document)
            PreProcessedInfo.append([{"postText": document}, {"postTokens" : temp}])

    else:
        for document in filtered_documents:
            temp = []

            for word in document.split():
                # if word not in stop_words and not word.isdigit() and word not in filtered_words and len(word) < 50:
                
                if word not in stop_words and not word.isdigit() and len(word) < 50:
                    # word = WordNetLemmatizer().lemmatize(word)
                    temp.append(word)
                
            
            document = " ".join(temp)    
            listOfDocuments.append(document)
            PreProcessedInfo.append([{"postText": document}, {"postTokens" : temp}])


    end_time = time.time()  # Record the end time

    elapsed_time = end_time - start_time  # Calculate the elapsed time
    total_word_counts = count_words_in_documents(listOfDocuments)
    sorted_word_counts = dict(sorted(total_word_counts.items(), key=lambda item: item[1], reverse=True))
    
    return Response(data={
        "payload": PreProcessedInfo,
        "execution_time": elapsed_time,
        "total_word_counts" :sorted_word_counts.items(),
    })

# Create your views here.
@api_view(['POST'])
def text_tokenization_with_translation(request):
    responseData = json.loads(request.body)
    def translate_to_english(text):
        translator = Translator()
        translated_text = translator.translate(text, src='auto', dest='en')
        return translated_text.text

    def count_words_in_documents(document_contents):
        total_word_counts = Counter()

        # Process each document content
        for content in document_contents:
            words = content.split()
            total_word_counts.update(words)

        return total_word_counts
    
    start_time = time.time()
    # json_file_path = os.path.join(os.path.dirname(__file__), 'output.json')
    # # json_file_path = 'output.json'  # Update with your actual file path
    # with open(json_file_path, 'r') as file:
    #     data = json.load(file)

    texts = [item.get('text', '') for item in responseData['documents']]
    texts = [translate_to_english(text) for text in texts]

    filtered_documents = []
    for document in texts:
        temp = []
        document = document.translate(translator)
        document = document.replace('“', '').replace('”', '').replace('’', "'").replace('.', '')
        document = document.lower()

        # for word in document.split():
        #     if word not in stop_words and not word.isdigit():
        #         temp.append(word)

        # temp = []
        # for word in document.split():
        #     lemmatized_word = WordNetLemmatizer().lemmatize(word)
        #     temp.append(lemmatized_word)
        
        # filtered_documents.append(" ".join(temp))
        filtered_documents.append(document)
    
    # total_word_counts = count_words_in_documents(filtered_documents)
    # print(total_word_counts.items())
    # filtered_words = [word for word, count in total_word_counts.items() if count < 0]

    PreProcessedInfo = []
    listOfDocuments = []
    if responseData['enableLemmitization'] == True and responseData['enableStemming'] == True:
        for document in filtered_documents:
            temp = []

            for word in document.split():
                # if word not in stop_words and not word.isdigit() and word not in filtered_words and len(word) < 50:
                
                if word not in stop_words and not word.isdigit() and len(word) < 50:
                    lemmatized_word = WordNetLemmatizer().lemmatize(word)
                    stemmed_word = stemmer.stem(lemmatized_word)
                    temp.append(stemmed_word)
                
        
            document = " ".join(temp)    
            listOfDocuments.append(document)
            PreProcessedInfo.append([{"postText": document}, {"postTokens" : temp}])


    elif responseData['enableLemmitization'] == True:    
        for document in filtered_documents:
            temp = []

            for word in document.split():
                # if word not in stop_words and not word.isdigit() and word not in filtered_words and len(word) < 50:
                
                if word not in stop_words and not word.isdigit() and len(word) < 50:
                    lemmatized_word = WordNetLemmatizer().lemmatize(word)
                    temp.append(lemmatized_word)
                            
            document = " ".join(temp)    
            listOfDocuments.append(document)
            PreProcessedInfo.append([{"postText": document}, {"postTokens" : temp}])


    elif responseData['enableStemming'] == True:    
        for document in filtered_documents:
            temp = []

            for word in document.split():
                # if word not in stop_words and not word.isdigit() and word not in filtered_words and len(word) < 50:
                
                if word not in stop_words and not word.isdigit() and len(word) < 50:
                    stemmed_word = stemmer.stem(word)
                    temp.append(stemmed_word)
                
            document = " ".join(temp)    
            listOfDocuments.append(document)
            PreProcessedInfo.append([{"postText": document}, {"postTokens" : temp}])

    else:
        for document in filtered_documents:
            temp = []

            for word in document.split():
                # if word not in stop_words and not word.isdigit() and word not in filtered_words and len(word) < 50:
                
                if word not in stop_words and not word.isdigit() and len(word) < 50:
                    # word = WordNetLemmatizer().lemmatize(word)
                    temp.append(word)
                
            
            document = " ".join(temp)    
            listOfDocuments.append(document)
            PreProcessedInfo.append([{"postText": document}, {"postTokens" : temp}])


    end_time = time.time()  # Record the end time

    elapsed_time = end_time - start_time  # Calculate the elapsed time
    total_word_counts = count_words_in_documents(listOfDocuments)
    sorted_word_counts = dict(sorted(total_word_counts.items(), key=lambda item: item[1], reverse=True))
    
    return Response(data={
        "payload": PreProcessedInfo,
        "execution_time": elapsed_time,
        "total_word_counts" :sorted_word_counts.items(),
    })

# Create your views here.
@api_view(['POST'])
def reduce_dtd_to_tsne(request):
    responseData = json.loads(request.body)
    
    tsne = TSNE(n_components=2, perplexity=responseData['perplexity'],
                learning_rate=responseData['learningRate'], n_iter=responseData['noOfIterations'],
                random_state=7, angle=responseData['angle'] ,early_exaggeration=120, init='pca')
    # tsne = TSNE(n_components=2, random_state=42, perplexity=32)
    # from sklearn.decomposition import PCA

    # pca = PCA(n_components=2)  
    reduced_data = tsne.fit_transform(np.array(responseData['document_topic_distribution']))

    # Display the shape of the reduced_data array
    # print("Shape of reduced_data:", reduced_data.shape)

    return Response(data={
        "reduced_data": reduced_data,
    })

# Create your views here.
@api_view(['POST'])
def compute_documents_cosine_similarity(request):
    payload = json.loads(request.body)
    vectortizer = CountVectorizer()
    
    cosine_similarity_of_clusters = []

    numberOfDocuments = sum([len(inner_list) for inner_list in payload['clusters_documents']])

    for clusters in payload['clusters_documents']:
        temp = 0
        for document in clusters: 
            temp += cosine_similarity(vectortizer.fit_transform([payload['documents'][0], document]))[1][0]
        cosine_similarity_of_clusters.append(temp / numberOfDocuments)

    # print(cosine_similarity_of_clusters)
    
    return Response(
        data={
            "document_cosine_similarity": cosine_similarity_of_clusters,
        }
    )

@api_view(['POST'])
def compute_clusters_silhouette_score(request):
    
    payload = json.loads(request.body)
    documentTopicDistribution = payload['lda_document_topic_distribution']
    documentLabels = payload['document_labels']

    document_similarity_matrix = pairwise_distances(documentTopicDistribution, metric='cosine')
    silhouette_scores = silhouette_score(document_similarity_matrix, documentLabels)

    return Response(
        data={
            "silhoutte_score": silhouette_scores,
        }
    )


@api_view(['POST'])
def classify_document(request):
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


