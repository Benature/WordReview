from django.db import models
import uuid


class Review(models.Model):
    '''复习单词表'''
    word = models.CharField('英文单词', max_length=50, unique=False)
    mean = models.CharField('中文释义', max_length=500, default='')
    total_num = models.IntegerField('复习总次数', default=0)
    forget_num = models.IntegerField('忘记次数', default=0)
    rate = models.FloatField(
        '单词遗忘率', default=None, null=True)
    LIST = models.IntegerField('list', default=0)
    UNIT = models.IntegerField('unit', default=0)
    INDEX = models.IntegerField('index', default=0)
    BOOK = models.CharField('单词书', max_length=20, default='')
    history = models.CharField('记忆历史', max_length=100,
                               default='')  # 10100101

    class Meta:
        db_table = 'review'
        ordering = ('LIST', 'UNIT', 'INDEX')


class BookList(models.Model):
    '''单词书'''
    BOOK = models.CharField('单词书', max_length=20, default='UNKNOWN BOOK')
    LIST = models.IntegerField('list', default=0)
    last_review_date = models.CharField('上次复习时间', max_length=10, default='')
    review_dates = models.CharField(
        '所有复习日期（仅记录复习曲线时间）', max_length=100, default='')
    list_uuid = models.UUIDField(
        'uuid', default=uuid.uuid4, editable=False, unique=True)
    list_rate = models.FloatField('表记忆率', default=-1)
    review_word_counts = models.CharField(
        'list 内单词复习次数（分号分隔）set', max_length=100, default='')
    word_num = models.IntegerField('list 内的单词数目', default=0)
    ebbinghaus_counter = models.IntegerField('艾宾浩斯复习次数', default=0)

    class Meta:
        db_table = 'book_list'
        ordering = ('BOOK', 'LIST', 'last_review_date')
