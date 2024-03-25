from django.shortcuts import render, HttpResponse

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
    vectorizer = CountVectorizer(stop_words='english', max_df=0.5, min_df=2)
        
    responseData = json.loads(request.body)

    X = vectorizer.fit_transform(responseData['preprocessed_text'])
    print(X.shape)
    # Apply LDA
    n_topics = (responseData['num_topics'])  # Number of topics/clusters
    lsa = TruncatedSVD(n_components=n_topics, random_state=42)

    document_topic_distribution = lsa.fit_transform(X)
    document_topic_distribution_normalized = normalize(document_topic_distribution, norm='l1')
    predicted_clusters = np.argmax(document_topic_distribution_normalized, axis=1)

    feature_names = vectorizer.get_feature_names_out()
    topics = []
    for topic_idx, topic in enumerate(lsa.components_):
        top_words_indices = topic.argsort()[:-30:-1]  # Get indices of top 10 words for each topic
        top_words = [feature_names[i] for i in top_words_indices]
        topics.append(top_words)

    return Response(data={
        "document_topic_distribution" : document_topic_distribution_normalized,
        "predicted_clusters": predicted_clusters,
        "topics" : topics,
    })