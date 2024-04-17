from django.urls import path
from .views_folder import lda_views, lsa_views, views

urlpatterns = [
    path("", views.text_tokenization, name="home"),
    path("lsa", lsa_views.text_clustering_lsa),
    path("lda", lda_views.text_clustering_lda),
    path("trainldaclassifier", lda_views.train_lda_classifier),
    path("ldaclassifydocuments", lda_views.lda_classify_document),
    path("tsne", views.reduce_dtd_to_tsne)
    
]