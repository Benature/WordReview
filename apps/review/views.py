from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from apps.review.src.import_excel import import_excel
from apps.review.models import Review

from django.core import serializers
import json


def ormToJson(ormData):
    '''数据转换器'''
    jsonData = serializers.serialize("json", ormData)
    data = json.loads(jsonData)
    return data


def index(request):
    return render(request, "review.pug")


def temp(request):
    # import_excel(Review)
    # rev = Review.objects.filter(BOOK='GRE3000')
    # print(len(rev))
    return render(request, "review.pug")


def get_word(request):
    LIST = request.GET.get('list')
    word = Review.objects.filter(LIST=LIST)
    data = {
        'data': ormToJson(word),
        'status': 200,
    }
    return JsonResponse(data)


@csrf_exempt
def review_a_word(request):
    post = request.POST
    print(post)
    word = Review.objects.get(word=post.get('word'))
    word.total_num += 1
    if post.get('remember') == 'true':
        word.history += '1'
    elif post.get('remember') == 'false':
        word.history += '0'
        word.forget_num += 1
    word.rate = word.forget_num / word.total_num
    word.save()
    data = {'msg': 'done', 'status': 200}
    return JsonResponse(data)


def review(request):
    LIST = request.GET.get('list')
    if LIST is None:
        LIST = 1
        return redirect('/review?list=1')
    # word = Review.objects.all()[:1]
    # data = ormToJson(word)[0]
    # print('data', data)
    # means = data['fields']['mean'].split('\n')

    return render(request, "review.pug", locals())
