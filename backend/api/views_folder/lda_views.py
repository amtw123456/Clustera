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

# Create your views here.
@api_view(['POST'])
def text_clustering_lda(request):
    vectorizer = CountVectorizer(stop_words='english', max_df=0.5, min_df=2)
    X = vectorizer.fit_transform(preprocessed_text)

    # Apply LDA
    n_topics = 4  # Number of topics/clusters
    lda = LatentDirichletAllocation(n_components=n_topics, random_state=42)
    X_lda = lda.fit_transform(X)

    topics_list = []
    document_topic_distribution = lda.fit_transform(X)
    predicted_clusters = np.argmax(document_topic_distribution, axis=1)