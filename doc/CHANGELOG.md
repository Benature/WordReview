# 更新日志

- update: 导入数据时对表头进行检查（[Issue#13](https://github.com/Benature/WordReview/issues/13)）@08-19
- feature: 新增听写功能（输入模式）（[Issue#10](https://github.com/Benature/WordReview/issues/10)）@07-09


<b><details open><summary>2020.06</summary></b>

- update: 导入报错在命令行输出完整报错 @06-16

</details>

<b><details open><summary>2020.05</summary></b>

- feature: 英文助记法爬取+渲染 @05-22
- update: 单词标记从正向标记恢复为普通标记时，对数据库所有相同单词刷新标记 @05-20
- update: `昨日重现`支持自定义每次词表长度 @05-19
- feature: `昨日重现`复习词表 @05-09
- feature: 单词标记增加`很熟悉` @05-09
- update: 同一个 List 可以重复进行艾宾浩斯复习安排 @05-09
- update: 导入单词`Unit`列取消为必选 @05-09
- feature: 复习页进度条 @05-09
- feature: 复习页增加关于记忆率的分布色条 @05-08
- feature: 艾宾浩斯复习安排之外的自主复习日期记录与渲染 @05-08
- update: 目录结构变更 @05-07
- feature: 区分渲染数据库`Words`和`Review`的`flag`难度标记 @05-07
- feature: `相关词`栏内对近期复习单词做高亮 @05-05

</details>

<b><details><summary>2020.04</summary></b>

- feature: wiki quote 每日名言（主页）<https://en.wikiquote.org/wiki/Wikiquote:Quote_of_the_day> @04-29
- feature: 新增两个单词网页（助记、近义词）跳转 @04-28
- update: 剪贴板复制后自动离焦`input` @04-28
- update: <http://dict.cn/mini.php>接口例句红色高亮（[Issue#7](https://github.com/Benature/WordReview/issues/7#issuecomment-620127755)） @04-28
- fix: `font awesome` 路径错误（[Issue#7](https://github.com/Benature/WordReview/issues/7)） @04-27
- update: 网页导入数据库支持例句、助记法、音标、近、反、派词（[Issue#7](https://github.com/Benature/WordReview/issues/7)） @04-27
- fix: 艾宾浩斯日历安排采用《杨鹏 17 天》形式 @04-26
- feature: 新增`近`、`反`、`派`词字段与渲染 @04-24
- fix: 0.2.0 版本 dmg 报错 @04-21
- release: version 0.2.0 @04-19
- update: 导航栏样式增加激活状态(`.enabled`) @04-18
- update: 配置文件更换为`.conf`文件（以支持默认参数） @04-18
- feature: 命令行启动后自动打开浏览器 ([Issue#4](https://github.com/Benature/WordReview/issues/4)) @04-16
- feature: 新增[在线预览](https://benature.github.io/WordReview/) @04-16
- feature: 对<http://dict.cn/mini.php>的后端爬虫 API ([Issue#2](https://github.com/Benature/WordReview/issues/2)) @04-15
- update: Note 区高度自适应 @04-13
- update: 修改 Note 区显示渲染逻辑 @04-13
- feature: 对记忆之沙内容进行快捷键复制 @04-13
- feature: 单词的`flag`新增`已掌握` @04-13
- feature: Chrome Extension 谷歌浏览器插件：记忆之沙助记法显示 @04-12
- update: 错不过三：不认识三次后强制不再背该词 @04-11
- update: 无论状态，错一次后需重背一次该词 @04-11
- feature: 例句支持关键词高亮 @04-11
- update: 未显示释义不能选择是否认识 @04-11
- update: 优化复习页面布局 @04-10
- feature: 新增`助记法`与`音标`字段 @04-10
- feature: 新增预习(学习状态) @04-08
- update: 优化获取单词键值对处理 @04-08
- feature: 新增 [WebsterVocabularyBuilder](https://www.zhihu.com/question/27538740) 是否收录字段 @04-08
- fix: 日历页面任务过期太久引发页面渲染失败 @04-05
- update: `note` 光标离焦后自动更新，不必点击`我记得`或`不认识` @04-05
- feature: 主页显示近期记忆率 @04-05
- feature: 词根词缀词源拆词渲染 @04-05
- feature: `太简单`与`重难词`标记 @04-05
- feature: 离开`review`页面前询问（防止手误离开页面） @04-02
- feature: 增加 **例句** 显示 @04-02
- update: 单个单词进度条改为左记右忘 @04-01
- feature: 词表初始化排序设置支持叠加排序 @04-01

</details>

<b><details><summary>2020.03</summary></b>

- update: 增加添加笔记快捷键`N` @03-24
- update: 重现模式在 `背词数目==已背单词+50` 后自动关闭一次（防止无脑过词） @03-24
- update: 增加重现模式快捷键`R` @03-18
- update: `note` 输入框无视快捷键 @03-18
- update: 重现模式在背词数目超过词表长度 50 次后自动关闭一次（防止无脑过词） @03-17
- update: 历史曲线 X 轴 label 从数字改为单词 @03-01

</details>

<b><details><summary>2020.02</summary></b>

- feature: 背单词的重现模式 ([PR#1](https://github.com/Benature/WordReview/pull/1)) @02-29
- release: 打包可执行文件 @02-28
- feature: 新增导入单词本页面 @02-27
- feature: 笔记框默认隐藏，点击显示（增加有无笔记之对比） @02-27
- update: 优化线型图显示（0 起） @02-27
- fix: 日历显示月份 bug 修复 @02-27
- more: 略······

</details>
