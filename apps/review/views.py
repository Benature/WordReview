from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from apps.review.models import Review

from apps.src.util import ormToJson, valueList

from apps.review.src.import_excel import import_qugen


def index(request):
    return render(request, "review.pug")


def temp(request):
    # import_qugen(Review)
    # rev = Review.objects.filter(BOOK='GRE3000')
    # print(len(rev))
    return render(request, "review.pug")


def get_word(request):
    '''接口：获取单词'''
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
    '''接口：在数据库更新单词记忆情况'''
    post = request.POST
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
    '''页面：单词复习页'''
    LIST = request.GET.get('list')
    BOOK = request.GET.get('book')
    if LIST is None or BOOK is None:
        if LIST is None:
            LIST = 0
        if BOOK is None:
            BOOK = 'qugen10000'
        return redirect(f'/review/review?list={LIST}&book={BOOK}')
    return render(request, "review.pug", locals())


def homepage(request):
    '''页面：复习主页'''
    # BOOK = request.GET.get('book')
    # if BOOK is None:
    #     BOOK = 'qugen10000'
    # b = set(Review.objects.values_list('BOOK'))
    dic = {'qugen10000': '曲根一万单词', 'GRE3000': '再要你命3000'}
    data = []
    for BOOK, book in dic.items():
        lists = sorted([l[0] for l in (set(Review.objects.filter(
            BOOK=BOOK).values_list('LIST')))])
        list_info = []
        for l in lists:
            ld = Review.objects.filter(BOOK=BOOK, LIST=l)  # list data
            total = [t[0] for t in ld.values_list('total_num')]
            rate = sum([r[0] if r[0] is not None else 1 for r in ld.values_list('rate')
                        ]) / len(ld) * 100
            rate = 100 - rate if rate != 0.0 else 0
            list_info.append({
                'i': l,
                'len': len(ld),
                'rate': int(rate),
                'min': min(total),
                'max': max(total),
            })
        data.append({
            'name': book,
            'name_en': BOOK,
            'lists': list_info,
        })

    return render(request, "homepage.pug", locals())
