from django.shortcuts import render, redirect, HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from apps.review.models import Review, BookList, Words, Books

from apps.src.util import ormToJson, valueList
import config
from apps.review.src.init_db import init_db, update_db
from apps.review.src.spider import crawl_other_dict

from datetime import datetime, timedelta, date

import traceback

Delay_Hours = 4

EBBINGHAUS_DAYS = [0, 1, 2, 4, 7, 15, 30]


def index(request):
    return render(request, "review.pug")


def temp(request):
    # out = Words.objects.filter(word__icontains='abandon')
    # for w in out:
    #     print(w.word, ".")
    #     print(w.word.count(' '))
    #     print(w.id)
    # print(out)
    update_db(Words)
    return render(request, "homepage.pug")


def import_db(request):
    if request.method == 'POST':
        post = request.POST
        print(post)
        BOOK = post.get('BOOK')
        BOOK_zh = post.get('BOOK_zh')
        BOOK_abbr = post.get('BOOK_abbr')
        excel_path = post.get('excel_path')

        try:
            begin_index = int(post.get('begin_index'))
            if begin_index not in [0, 1]:
                return render(request, "import_db.pug",
                              {'message': '请输入 0 或 1！'})
        except:
            return render(request, "import_db.pug", {'message': '请输入 0 或 1！'})
        print(BOOK, BOOK_zh, BOOK_abbr, begin_index, excel_path)

        try:
            init_db(BOOK, BOOK_zh, BOOK_abbr, begin_index, excel_path, Books,
                    Review, BookList, Words)
        except Exception as e:
            print(traceback.format_exc())
            return render(request, "import_db.pug", {'message': e})
        return redirect('/review')
    return render(request, "import_db.pug")


@csrf_exempt
def review_lists(request):
    '''接口：复习完成 list，更新 book_list'''
    post = request.POST
    today = datetime.now() - timedelta(hours=Delay_Hours)  # 熬夜情况
    today_str = today.strftime('%Y-%m-%d')
    if post.get('yesterday_mode') == 'true':
        LIST = 0
        while True:
            print(LIST)
            try:
                book_list = BookList.objects.get(BOOK='WORD_REVIEW', LIST=LIST)
            except BookList.DoesNotExist:
                if LIST == 0:  # 这个 BOOK 还没建
                    from apps.review.src.init_db import init_db_books
                    init_db_books(Books,
                                  'WORD_REVIEW',
                                  '昨日重现自主复习',
                                  '😇',
                                  0,
                                  hide=True)
                book_list = BookList.objects.create(BOOK='WORD_REVIEW',
                                                    LIST=LIST)
            dates = book_list.review_dates_plus
            if today_str != dates.split(';')[-1]:
                book_list.review_dates_plus = (dates + ';' +
                                               today_str).strip(';')
                book_list.save()
                print(book_list.review_dates_plus)
                break
            else:
                LIST += 1
        LISTS = []
    else:
        LISTS = [int(i) for i in post.get('list').split('-')]
        if len(LISTS) == 2:
            LISTS = list(range(LISTS[0], LISTS[1] + 1))
        BOOK = post.get('book')

    msg = 'done'
    status = 200
    for LIST in LISTS:
        try:
            # list data: where flag < 1
            ld = Review.objects.filter(BOOK=BOOK, LIST=LIST,
                                       flag__lt=1)  # list data
            # list data passed: where flag > 0
            ld_pass = Review.objects.filter(BOOK=BOOK, LIST=LIST,
                                            flag__gt=0)  # list data
            L_db = BookList.objects.get(BOOK=BOOK, LIST=LIST)
        except Exception as e:
            msg = f'获取数据异常：{e}'
            status = 501
            break

        L_db.word_num = len(ld) + len(ld_pass)

        # 背过的单词进度
        list_rate = len([r for r in ld.values_list('rate') if r[0] != -1
                         ]) / L_db.word_num
        list_rate = 1 - list_rate if list_rate != 0.0 else 0

        if list_rate == 0 and len(ld) > 0:
            status = 404
            msg = '你好像还没背过这个 List 诶 😳'
            continue

        L_db.unlearned_num = len(ld)
        L_db.review_word_counts = ';'.join(
            set([str(t[0]) for t in ld.values_list('total_num')]))

        L_db.list_rate = list_rate
        # 计算近期记忆率
        recent_history = ''
        for word in ld:
            recent_history += word.history[-2:]
        L_db.recent_list_rate = recent_history.count('1') / len(recent_history)

        # 艾宾浩斯时间处理
        if 0 < L_db.ebbinghaus_counter < len(EBBINGHAUS_DAYS):
            ebbinghaus_counter = L_db.ebbinghaus_counter
            should_next_date = datetime.strptime(
                L_db.review_dates.split(';')[-1], '%Y-%m-%d') + timedelta(
                    days=EBBINGHAUS_DAYS[ebbinghaus_counter])
            if (today - should_next_date).days >= 0:
                print(should_next_date)
                # 今天 不早于 理论下一天
                L_db.ebbinghaus_counter += 1
                L_db.review_dates += ';' + today_str
                L_db.last_review_date = today_str
            elif today_str != L_db.review_dates_plus.split(';')[-1]:
                # 自愿复习
                L_db.review_dates_plus += ';' + today_str \
                    if L_db.review_dates_plus != "" else today_str
        elif L_db.ebbinghaus_counter == 0:
            L_db.last_review_date = today_str
            L_db.ebbinghaus_counter = 1
            L_db.review_dates = today_str
        else:
            # 已完成艾宾浩斯一周目
            L_db.ebbinghaus_counter = 0
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
def update_note(request):
    '''接口：更新单词note'''
    post = request.POST
    msg = 'done'
    status = 200
    try:
        print(post)
        word = Words.objects.get(word=post.get('word'))
        word.note = post.get('note')
        word.save()
    except Exception as e:
        msg = e
        status = 501
    data = {'msg': msg, 'status': status}
    return JsonResponse(data)


@csrf_exempt
def update_word_flag(request):
    '''接口：更新单词flag'''
    post = request.POST
    msg = 'done'
    status = 200
    try:
        if post.get('yesterday_mode') == 'true':
            words = [Words.objects.get(word=post.get('word'))]
        else:
            words = [Words.objects.get(word=post.get('word'))]
            if post.get('flag') == '0' and int(post.get('last_flag')) > 0:
                # 如果是从正向标签退回默认，则对数据库所有 list 操作
                words += [
                    rw for rw in Review.objects.filter(word=post.get('word'))
                ]
            else:
                words.append(
                    Review.objects.get(word=post.get('word'),
                                       LIST=post.get('list'),
                                       BOOK=post.get('book')))
        for word in words:
            word.flag = post.get('flag')
            word.save()
        # if post.get('flag') == 0:
        #     Review.objects.filter(word=post.get(
        #         'word')).update(flag=post.get('flag'))
    except Exception as e:
        msg = e
        status = 501
    data = {'msg': msg, 'status': status}
    return JsonResponse(data)


@csrf_exempt
def spider_other_dict(request):
    '''API: spider to crawl http://dict.cn/mini.php'''
    status, data = crawl_other_dict(request.POST.get('word'),
                                    request.POST.get('url'))
    return JsonResponse({'status': status, 'data': data})


@csrf_exempt
def review_a_word(request):
    '''接口：在数据库更新单词记忆情况'''
    post = request.POST
    try:
        word = Words.objects.get(word=post.get('word'))
        if post.get('repeat') == 'true' or post.get(
                'yesterday_mode') == 'true':
            word_dbs = [word]
        else:
            word_in_list = Review.objects.filter(word=post.get('word'),
                                                 BOOK=post.get('book'),
                                                 LIST=post.get('list'))[0]
            word_dbs = [word, word_in_list]
    except Exception as e:
        return JsonResponse({'msg': '数据库损坏！' + e, 'status': 500})

    # update database
    if (post.get('note') != 'false'):
        word.note = post.get('note')
    word.last_forget_num = post.get('last_forget_num')

    for w in word_dbs:
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
    pankeys = {
        'total_num': 'panTotalNum',
        'forget_num': 'panForgetNum',
        'rate': 'panRate',
        'history': 'panHistory',
        'flag': 'panFlag',
    }
    sortType = ['乱序', '记忆序']
    msg = ''
    mode = 'normal'

    BOOK = request.GET.get('book')
    LIST = request.GET.get('list')
    limit = request.GET.get('limit')
    print("...", limit)

    yesterday_mode = BOOK == '' and LIST == ''

    if yesterday_mode:
        mode = 'yesterday'
        day0 = datetime.now() - timedelta(days=4, hours=Delay_Hours)
        today = datetime.now() - timedelta(hours=Delay_Hours)
        date_range = [
            datetime.strptime(
                f"{day0.year}-{day0.month}-{day0.day} {Delay_Hours}",
                '%Y-%m-%d %H'),
            datetime.strptime(
                f"{today.year}-{today.month}-{today.day} {Delay_Hours}",
                '%Y-%m-%d %H')
        ]
        list_info = Words.objects.filter(
            modify_time__range=date_range, last_forget_num__gt=0).order_by(
                "rate").order_by("-last_forget_num")
        msg = f"There are {len(list_info)} words that you need to review😋"
        list_info = list_info[:50] if limit == None else list_info[:int(limit)]

    else:
        LIST_li = [int(i) for i in LIST.split('-')]
        if len(LIST_li) == 1:
            list_info = Review.objects.filter(LIST=LIST, BOOK=BOOK, flag__lt=2)
            if BookList.objects.get(LIST=LIST,
                                    BOOK=BOOK).ebbinghaus_counter == 0:
                sortType = ['顺序']
        elif len(LIST_li) == 2:
            list_info = Review.objects.filter(LIST__range=LIST_li, BOOK=BOOK)
        else:
            raise KeyError('LIST_li 长度异常')

    list_info = ormToJson(list_info)
    for l in list_info:
        l = l['fields']
        try:
            w = l if yesterday_mode else ormToJson(
                [Words.objects.get(word=l['word'])])[0]['fields']
        except Words.DoesNotExist:
            return JsonResponse({
                "msg": f"Word not found:{l['word']}",
                'status': 404
            })

        for old, pan in pankeys.items():
            w.update({pan: w.pop(old)})
        l.update(w)

    yesterday = datetime.now() - timedelta(days=1, hours=Delay_Hours)
    recent_words = Words.objects.filter(modify_time__gt=date(
        yesterday.year, yesterday.month, yesterday.day)).values_list('word')

    data = dict(data=list_info,
                status=200,
                sort=sortType,
                begin_index=int(Books.objects.get(
                    BOOK=BOOK).begin_index == 0) if BOOK != '' else 0,
                recent_words=[rw[0] for rw in recent_words],
                mode=mode,
                msg=msg)
    return JsonResponse(data)


def get_calendar_data(request):
    '''接口：获取日历渲染数据'''
    books = Books.objects.all()
    book_info = {}
    for b in books:
        book_info[b.BOOK] = {
            'abbr': b.BOOK_abbr,
            'begin_index': 1 if b.begin_index == 0 else 0,
        }
    # db = BookList.objects.filter(~Q(ebbinghaus_counter=0))
    db = BookList.objects.filter(
        Q(ebbinghaus_counter__gt=0) | ~Q(review_dates_plus=''))
    data = ormToJson(db)
    for d in data:
        d = d['fields']
        d['abbr'] = book_info[d['BOOK']]['abbr']
        d['begin_index'] = book_info[d['BOOK']]['begin_index']

    data = {'data': data, 'EBBINGHAUS_DAYS': EBBINGHAUS_DAYS, 'status': 200}
    return JsonResponse(data)


def review(request):
    '''页面：单词复习页'''
    LIST = request.GET.get('list')
    BOOK = request.GET.get('book')
    # if LIST is None or BOOK is None:
    #     return redirect(f'/review/review?list={LIST}&book={BOOK}')
    return render(request, "review.pug", locals())


def calendar(request):
    '''页面：艾宾浩斯日历图'''
    return render(request, "calendar.pug")


def homepage(request):
    '''页面：复习主页'''
    books = Books.objects.filter(hide=False)[::-1]
    dic = {}
    for b in books:
        dic[b.BOOK] = {'BOOK_zh': b.BOOK_zh, 'begin_index': b.begin_index}
    data = []
    for BOOK, book_info in dic.items():
        book = book_info['BOOK_zh']
        index = book_info['begin_index']
        # index = 1 if index == 0 else 0
        lists = sorted([
            l[0] for l in (
                set(Review.objects.filter(BOOK=BOOK).values_list('LIST')))
        ])
        list_info = []
        for l in lists:
            try:
                ld = BookList.objects.get(BOOK=BOOK, LIST=l)
            except Exception as e:
                print(l, e)
                continue
            if ld.unlearned_num == -1:
                L = ld.word_num
                del_L = 0
            else:
                L = ld.unlearned_num
                del_L = ld.word_num - ld.unlearned_num
            # total = sorted([int(i) for i in ld.review_word_counts.split(';')])
            plus = len(ld.review_dates_plus.split(
                ';')) if ld.review_dates_plus != "" else 0
            list_info.append(
                dict(i=l,
                     len=L,
                     del_len=del_L,
                     rate=int(max(0, ld.list_rate) * 100),
                     recent_rate=int(max(0, ld.recent_list_rate) * 100),
                     times=len(ld.review_dates.split(';'))
                     if ld.review_dates != "" else 0,
                     plus='' if plus == 0 else '+' + str(plus),
                     index=index))
        data.append({'name': book, 'name_en': BOOK, 'lists': list_info})

    return render(request, "homepage.pug", locals())
