from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('review/', views.review, name='review'),
    path('review/get_word', views.get_word, name='获取单词'),
    path('review/review_a_word', views.review_a_word, name='获取单词'),
    path('temp/', views.temp, name='temp'),
]
