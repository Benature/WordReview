from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from apps.review.models import Review, BookList, Words

from apps.src.util import ormToJson, valueList

# from apps.review.src.init_db import import_word, init_db_word, init_db_booklist(BookList, Review)

from datetime import datetime, timedelta

EBBINGHAUS_DAYS = [1, 2, 4, 7, 15, 30]
EBBINGHAUS_DELTA = [0, 1, 2, 3, 8, 15]


def index(request):
    return render(request, "review.pug")


def temp(request):
    # import_word(Review, BookList, Words)
    # init_db_booklist(BookList, Review)
    # init_db_word(Review, Words)
    return render(request, "calendar.pug")


@csrf_exempt
def review_lists(request):
    '''接口：复习完成 list，更新 book_list'''
    post = request.POST
    today = datetime.now() - timedelta(hours=4)  # 熬夜情况
    today_str = today.strftime('%Y-%m-%d')

    LISTS = [int(i) for i in post.get('list').split('-')]
    if len(LISTS) == 2:
        LISTS = list(range(LISTS[0], LISTS[1]+1))
    BOOK = post.get('book')

    msg = 'done'
    status = 200
    # try:
    for LIST in LISTS:
        try:
            ld = Review.objects.filter(BOOK=BOOK, LIST=LIST)  # list data
            L_db = BookList.objects.get(BOOK=BOOK, LIST=LIST)
        except Exception as e:
            msg = f'获取数据异常：{e}'
            status = 501
            break

        rate = sum([r[0] if r[0] is not None else 1 for r in ld.values_list('rate')
                    ]) / len(ld)
        rate = 1 - rate if rate != 0.0 else 0

        L_db.word_num = len(ld)
        L_db.review_word_counts = ';'.join(
            set([str(t[0]) for t in ld.values_list('total_num')]))
        L_db.list_rate = rate

        if 0 < L_db.ebbinghaus_counter < len(EBBINGHAUS_DELTA):
            c = L_db.ebbinghaus_counter
            should_next_date = datetime.strptime(L_db.last_review_date, '%Y-%m-%d'
                                                 ) + timedelta(days=EBBINGHAUS_DELTA[c])
            # print(should_next_date)
            if (today - should_next_date).days >= 0:
                # 今天 不早于 理论下一天
                L_db.ebbinghaus_counter += 1
                L_db.review_dates += ';' + today_str
                L_db.last_review_date = today_str
        elif L_db.ebbinghaus_counter == 0:
            L_db.last_review_date = today_str
            L_db.ebbinghaus_counter = 1
            L_db.review_dates = today_str
        else:
            print('这个 list 背完了')

        try:
            L_db.save()
        except Exception as e:
            msg = f'保存数据异常：{e}'
            status = 502
            break
        # data = {'msg': msg, 'status': 200}
    # except Exception as e:
    #     data = {'msg': e, 'status': 500}
    data = {'msg': msg, 'status': status}
    return JsonResponse(data)


@csrf_exempt
def review_a_word(request):
    '''接口：在数据库更新单词记忆情况'''
    post = request.POST
    word_in_list = Review.objects.filter(
        word=post.get('word'), BOOK=post.get('book'))[0]
    word = Words.objects.get(word=post.get('word'))
    if (post.get('note')):
        word.note = post.get('note')
    for w in [word, word_in_list]:
        w.total_num += 1
        if post.get('remember') == 'true':
            w.history += '1'
        elif post.get('remember') == 'false':
            w.history += '0'
            w.forget_num += 1
        w.rate = word.forget_num / word.total_num
        w.save()
    data = {'msg': 'done', 'status': 200}
    return JsonResponse(data)


def get_word(request):
    '''接口：获取单词'''
    BOOK = request.GET.get('book')
    LIST = request.GET.get('list')
    LIST_li = [int(i) for i in LIST.split('-')]
    if len(LIST_li) == 1:
        list_info = Review.objects.filter(LIST=LIST, BOOK=BOOK)
    elif len(LIST_li) == 2:
        list_info = Review.objects.filter(LIST__range=LIST_li, BOOK=BOOK)
    else:
        raise KeyError('LIST_li 长度异常')
    # word_list = [w[0] for w in list_info.values_list('word')]
    # word = Words.objects.filter(word__in=word_list)
    # if len(word) != len(word_list):
    #     return JsonResponse({"msg": 'Words 数据库内缺少单词', 'status': 404})
    list_info = ormToJson(list_info)
    for l in list_info:
        l = l['fields']
        try:
            w = Words.objects.get(word=l['word'])
        except Words.DoesNotExist:
            return JsonResponse({"msg": f"Word not found:{l['word']}", 'status': 404})
        l['panTotalNum'] = w.total_num
        l['panForgetNum'] = w.forget_num
        l['panRate'] = w.rate
        l['panHistory'] = w.history
        l['mean'] = w.mean
        l['note'] = w.note
    data = {
        'data': list_info,
        'status': 200,
    }
    return JsonResponse(data)


def get_calendar_data(request):
    '''接口：获取日历渲染数据'''
    # db = BookList.objects.filter(~Q(ebbinghaus_counter=0))
    db = BookList.objects.filter(ebbinghaus_counter__range=[1, 5])
    # today = datetime.now()
    # begin = today - timedelta(days=(today.weekday() + 1))
    # end = begin + timedelta(days=(7 * 4))
    data = {
        'data': ormToJson(db),
        'EBBINGHAUS_DELTA': EBBINGHAUS_DELTA,
        'status': 200,
        # 'begin': begin.strftime('%Y-%m-%d'),
        # 'end': end.strftime('%Y-%m-%d'),
        # 'today': today.strftime('%Y-%m-%d'),
    }
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


def calendar(request):
    '''页面：艾宾浩斯日历图'''
    return render(request, "calendar.pug", )


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
            ld = BookList.objects.get(BOOK=BOOK, LIST=l)
            # total = sorted([int(i) for i in ld.review_word_counts.split(';')])
            list_info.append({
                'i': l,
                'len': ld.word_num,
                'rate': int(ld.list_rate * 100),
                # 'min': min(total),
                # 'max': max(total),
                'times': ld.ebbinghaus_counter,
            })
        data.append({
            'name': book,
            'name_en': BOOK,
            'lists': list_info,
        })

    return render(request, "homepage.pug", locals())
