# 数据库初始化导入

导入数据的方法有以下两种：

- [网页版的导入说明，另开一页，请点这里。](https://www.notion.so/benature/Word-Review-98fd460445ff44868d53c8739ff9793a)
- 自定义导入需要编写代码，参考`apps/review/src/init_db.py`，然后打开 <localhost:8000/temp/>，当你网页加载完成，说明数据库导入结束了，或者你也可以看下 terminal，原始代码是导入一个单词都打印出来了，你可以看到哗啦啦的一片（不要多次访问这个页面，否则重复导入数据）。

关于导入的文件格式，请参考[这个文件](https://github.com/Benature/WordReview/raw/ben/data/sample/sample.xlsx)，或者在线预览看[这里](../data/sample/sample.csv)。注意表头要一致哦，区分大小写。

<!-- 结束后再把那几行给注释了，以后用不着了。 -->

<!-- **Warning: 只能跑一次，跑多次数据库内容就重复了！** -->

>上面方法仅支持基础字段，如果想增加导入的信息（如音标、例句等），可以在`apps/review/src/init_db.py`参考代码并修改，或者也可以联系我来帮你加，推荐通过 [Issue](https://github.com/Benature/WordReview/issues) 来反馈。

---

一些资源整合：
- [IELTS 绿皮书](https://blog.csdn.net/M_sdn/article/details/85532520?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task)
- [再要你命三千](https://github.com/liurui39660/3000)
- [TOEFL 曲根单词](https://github.com/yihui-he/TOEFL-10000-0)
- [一个强大开源中英字典](https://github.com/skywind3000/ECDICT)

>如果🔍搜索资料有困难的话，可以在 [Issue](https://github.com/Benature/WordReview/issues) 说一下，我可以试着帮忙找下。

欢迎大家补充
