# 数据库初始化导入

目前是应急方案，反正是临时性的，导入一次 OK 了就不管了。

`apps/review/src/init_db.py`是一组示例代码，思路是你先整理好了一组 table，里面应该有英文、中文、List 序号、Unit 序号、Index 序号（也就是 Unit 里面第几个单词）这几列，然后给代码导入就好了。  
当然有些地方需要自己改下定义，详见[代码](../apps/review/src/init_db.py)。

然后来到`apps/review/views.py`，找到

```python
# from apps.review.src.init_db import import_word, init_db_word, init_db_booklist(BookList, Review)

...

def temp(request):
    # import_word(Review, BookList, Words)
    # init_db_booklist(BookList, Review)
    # init_db_word(Review, Words)
    return render(request, "calendar.pug")
```

把四行注释恢复了，然后`python manage.py runserver`

打开<localhost:8000/temp/>，当你网页加载完成，说明数据库导入结束了，或者你也可以看下 terminal，原始代码是导入一个单词都打印出来了，你可以看到哗啦啦的一片。

结束后再把那几行给注释了，以后用不着了。
