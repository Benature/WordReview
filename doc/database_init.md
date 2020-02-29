# 数据库初始化导入

<!-- 目前是应急方案，反正是临时性的，导入一次 OK 了就不管了。

`apps/review/src/init_db.py`是一组示例代码，思路是你先整理好了一组 table，里面应该有英文、中文、List 序号、Unit 序号、Index 序号（也就是 Unit 里面第几个单词）这几列，然后给代码导入就好了。  
当然有些地方需要自己改下定义，详见[代码](../apps/review/src/init_db.py)。 -->

<!-- 然后来到`apps/review/views.py`，找到

```python
from apps.review.src.init_db import (
    import_word, init_db_words, init_db_booklist, init_db_books)

...

def temp(request):
    # import_word(Review, BookList, Words)
    # init_db_word(Review, Words)
    # init_db_booklist(BookList, Review)
    # init_db_books(Books)
    return render(request, "calendar.pug")
``` -->

<!-- 把四行注释恢复了，然后`python manage.py runserver` -->

所要导入的单词的数据格式参见`data`文件夹下的`sample.xlsx`。

在`config.py`下，按提示修改下面这部分代码

```python
# ======================================================
#                    新增数据库信息配置
# ======================================================

# 初始化数据库时请使用 True，初始化后一定要改回 False！！！
# 初始化数据库时请使用 True，初始化后一定要改回 False！！！
# 初始化数据库时请使用 True，初始化后一定要改回 False！！！
init_db_mode = False  # 初始化数据库时请使用 True，初始化后一定要改回 False！！！

BOOK = 'CET6_green'  # 单词本的名字（请用英文，不带空格）
BOOK_zh = '新东方六级绿皮书'  # 单词本的中文名
BOOK_abbr = 'G'  # 单词本的缩写（用于日历显示，建议一个英文大写字符）
begin_index = 0  # 单词本 list、unit、index 的序号从 0 开始还是从 1 开始

# 单词数据的文件路径（建议使用绝对路径，若用相对路径请修改请参考下面示例代码）
excel_path = 'data/sample.xlsx'
```

**重点**：在导入单词之前`init_db_mode`调`True`，导入完后务必改为`Flase`！！！  
**重点**：在导入单词之前`init_db_mode`调`True`，导入完后务必改为`Flase`！！！  
**重点**：在导入单词之前`init_db_mode`调`True`，导入完后务必改为`Flase`！！！  
否则你数据库就有重复内容了

打开<localhost:8000/temp/>，当你网页加载完成，说明数据库导入结束了，或者你也可以看下 terminal，原始代码是导入一个单词都打印出来了，你可以看到哗啦啦的一片。

<!-- 结束后再把那几行给注释了，以后用不着了。 -->

<!-- **Warning: 只能跑一次，跑多次数据库内容就重复了！** -->