from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from apps.review.src.import_excel import import_qugen
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
    # import_qugen(Review)
    # rev = Review.objects.filter(BOOK='GRE3000')
    # print(len(rev))
    return render(request, "review.pug")


def get_word(request):
    LIST = request.GET.get('list')
    BOOK = request.GET.get('book')
    word = Review.objects.filter(LIST=LIST, BOOK=BOOK)
    data = {
        'data': ormToJson(word),
        'status': 200,
    }
    return JsonResponse(data)


@csrf_exempt
def review_a_word(request):
    post = request.POST
    print(post)
    word = Review.objects.filter(
        word=post.get('word'), BOOK=post.get('book'))[0]
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
    BOOK = request.GET.get('book')
    if LIST is None or BOOK is None:
        if LIST is None:
            LIST = 0
        if BOOK is None:
            BOOK = 'qugen10000'
        return redirect(f'/review?list={LIST}&book={BOOK}')

    # word = Review.objects.all()[:1]
    # data = ormToJson(word)[0]
    # print('data', data)
    # means = data['fields']['mean'].split('\n')

    return render(request, "review.pug", locals())
