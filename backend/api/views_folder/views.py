from django.shortcuts import render, HttpResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import nltk
import time
import numpy as np
from collections import Counter
from nltk.corpus import stopwords
import string
import json
import os

nltk.download('stopwords')
lemma = WordNetLemmatizer()

# Load data from a JSON file


# Extract text content from the data

custom_stopwords = set(["im", "i'm", "ve", "would"])
stop_words = set(stopwords.words('english')).union(custom_stopwords)
stop_words = sorted(stop_words)
punctuation = set(string.punctuation)

translator = str.maketrans("", "", string.punctuation)

# Create your views here.
@api_view(['POST'])
def text_tokenization(request):
    print("RED")
    responseData = json.loads(request.body)

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

    texts = [item.get('postText', '') for item in responseData]
    print(texts)

    filtered_documents = []
    for document in texts:
        temp = []
        # print()
        document = document.translate(translator)
        document = document.replace('“', '').replace('”', '').replace('’', "'")
        document = document.lower()

        # for word in document.split():
        #     if word not in stop_words and not word.isdigit():
        #         temp.append(word)

        # temp = []
        # for word in document.split():
        #     lemmatized_word = WordNetLemmatizer().lemmatize(word)
        #     temp.append(lemmatized_word)
        
        filtered_documents.append(document)
    
    total_word_counts = count_words_in_documents(filtered_documents)

    filtered_words = [word for word, count in total_word_counts.items() if count < 0]

    preprocessed_text = []
    for document in filtered_documents:
        temp = []

        for word in document.split():
            if word not in stop_words and not word.isdigit() and word not in filtered_words:
                temp.append(word)

        document = " ".join(temp)  
        # temp = []
        # for word in document.split():
        #     lemmatized_word = WordNetLemmatizer().lemmatize(word)
        #     temp.append(lemmatized_word)
        
        # document = " ".join(temp)    
        preprocessed_text.append({'postText':document})
            # vectorizer = CountVectorizer(stop_words='english', max_df=0.5, min_df=2)
    # X = vectorizer.fit_transform(preprocessed_text)

    # lda = LatentDirichletAllocation(n_components=5, random_state=42)
    # X_lda = lda.fit_transform(X)
    # topics_list = []
    # document_topic_distribution = lda.fit_transform(X)
    # predicted_clusters = np.argmax(document_topic_distribution, axis=1)
    # for topic_idx, topic in enumerate(lda.components_):
    #     top_words_idx = topic.argsort()[:-10 - 1:-1]
    #     top_words = [vectorizer.get_feature_names_out()[i] for i in top_words_idx]
    #     topics_list.append(top_words)

    end_time = time.time()  # Record the end time

    elapsed_time = end_time - start_time  # Calculate the elapsed time

    return Response(data={
        "preprocessed_text": preprocessed_text,
        'execution_time': elapsed_time,
    })
    # return HttpResponse(f"Code execution completed in {elapsed_time:.2f} seconds. {preprocessed_text[:3]}, {topics_list}, {predicted_clusters[:15]}")