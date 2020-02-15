from django.db import models


class Review(models.Model):
    '''复习单词表'''
    word = models.CharField('英文单词', max_length=50, unique=False)
    mean = models.CharField('中文释义', max_length=500, default='')
    total_num = models.IntegerField('复习总次数', default=0)
    forget_num = models.IntegerField('忘记次数', default=0)
    rate = models.FloatField(
        '遗忘率', default=None, null=True)
    LIST = models.IntegerField('list', default=0)
    UNIT = models.IntegerField('unit', default=0)
    INDEX = models.IntegerField('index', default=0)
    BOOK = models.CharField('单词书', max_length=20, default='')
    history = models.CharField('记忆历史', max_length=100,
                               default='')  # 10100101

    class Meta:
        db_table = 'review'
        ordering = ('LIST', 'UNIT', 'INDEX')
