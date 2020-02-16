from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage, name='index'),
    path('review/review/', views.review, name='复习单词'),
    path('review/homepage/', views.homepage, name='复习主页'),
    path('review/', views.homepage, name='复习主页'),
    path('temp/', views.temp, name='temp'),

    # 接口
    path('review/get_word', views.get_word, name='获取单词'),
    path('review/review_a_word', views.review_a_word, name='获取单词'),
]
