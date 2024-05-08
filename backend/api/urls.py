from django.urls import path
from .views_folder import lda_views, lsa_views, views

urlpatterns = [
    path("", views.text_tokenization, name="home"),
    path("tokenizationtranslation", views.text_tokenization_with_translation),
    path("tsne", views.reduce_dtd_to_tsne),
    path("cosinesimilarity", views.compute_documents_cosine_similarity),
    path("silhouettescore", views.compute_clusters_silhouette_score),
    path("lsa", lsa_views.text_clustering_lsa),
    path("lda", lda_views.text_clustering_lda),
    path("trainldaclassifier", lda_views.train_lda_classifier),
    path("ldaclassifydocuments", lda_views.lda_classify_document),
    # path('ldav2', lda_views.text_clustering_lda_v2)
    
]