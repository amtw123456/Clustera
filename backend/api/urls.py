from django.urls import path
from .views_folder import lda_views, lsa_views, views

urlpatterns = [
    path("", views.text_tokenization, name="home")
]