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
    # print(texts)

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

    documents_tokens = []
    preprocessed_text = []
    PreProcessedInfo = []
    for document in filtered_documents:
        temp = []

        for word in document.split():
            if word not in stop_words and not word.isdigit() and word not in filtered_words:
                temp.append(word)

        document = ", ".join(temp)  
        # temp = []
        # for word in document.split():
        #     lemmatized_word = WordNetLemmatizer().lemmatize(word)
        #     temp.append(lemmatized_word)
        
        # document = " ".join(temp)    
        # documents_tokens.append({"postTokens:" : temp})
        # preprocessed_text.append({"postText": document})
        PreProcessedInfo.append([{"postText": document}, {"postTokens" : temp}])

    end_time = time.time()  # Record the end time

    elapsed_time = end_time - start_time  # Calculate the elapsed time
    print(len(PreProcessedInfo))
    return Response(data={
        "payload": PreProcessedInfo,
        "execution_time": elapsed_time,
    })
