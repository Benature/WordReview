<a href="https://benature.github.io/WordReview/"><img src="./WordReview/static/media/muyi.png" height="200" align="right"></a>
<a href="https://benature.github.io/WordReview/"><img src="./WordReview/static/media/vocabulary.png" height="70" align="left"></a>

# Word Review 单词复习

![GitHub stars](https://img.shields.io/github/stars/Benature/WordReview?style=flat)
![GitHub stars](https://img.shields.io/github/forks/Benature/WordReview?style=flat)
![GitHub issues](https://img.shields.io/github/issues/Benature/WordReview)
![GitHub closed issues](https://img.shields.io/github/issues-closed/Benature/WordReview)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Benature/WordReview)
<!-- [![Gitter](https://badges.gitter.im/WordReview/community.svg)](https://gitter.im/WordReview/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) -->

<!-- ![GitHub](https://img.shields.io/github/license/Benature/WordReview) -->

Django + MySQL + Pug + JS

- Python 3.7+
- Django 3
- Mysql 8 / sqlite 3

---

- DEMO
  - 二月的时候简单录了一个 DEMO 视频，上传到了[B 站](https://mp.weixin.qq.com/s/zOmpevAUafFY5kPGYr65uA)，欢迎康康。
  - 还有一个[在线试玩](https://benature.github.io/WordReview/)，可以先感受一下。  
    _在线体验的版本对应`master`分支，现在默认显示的是`ben`分支（开发分支）_
<!-- - _百度网盘_
  - _对于不熟悉这个网站的同学，可以直接去[网盘](https://pan.baidu.com/s/17h-HjnZBbPHC45EYPCcoxA)下载，密码：l3g6。_
  - _导入数据库操作请看下文（或[这里](doc/database_init.md)）。_
  - _另：国内打开这个网页可能回稍慢，请耐心一些 dbq_ -->
- 资瓷一下呗 😋  
  如果觉得还不错的话，不如在右上方点个 stars🌟 呗(￣ ▽ ￣)~  
  如果童鞋有兴趣的话希望可以一起开发新功能呀 ٩(๑>◡<๑)۶  
  <!-- Discuss: _[Telegram](https://t.me/joinchat/IEhuIhx4UJKf_ZK-46mbNw)_ / _[Gitter](https://gitter.im/WordReview/community)_ -->
  <!-- 你好鸭，恭喜你发现我懒得删除的联系方式 -->
  <!-- Discuss: _[Telegram](https://t.me/joinchat/IEhuIhx4UJKf_ZK-46mbNw)_ / _[Slack](https://join.slack.com/t/word-review/shared_invite/zt-f2hnv9v9-rW_DV0y7fsAyFQFsJwOFlg)_ / _[Discord](https://discord.gg/6sE32Jh)_ / _[Gitter](https://gitter.im/WordReview/community)_ -->

---

[前言](#前言)  
[安装指引](#安装)  
[使用说明](#使用)  
[问题自检](#问题自检)  
[更新日志](#更新日志)

## 前言

此项目主要是将`Excel背单词`方法给 App 化，更符合用户操作习惯。  
第一次听说`Excel背单词`这个方法是看了[红专学姐](https://www.zhihu.com/people/you-hong-you-zhuan-ai-dang-wu-si-qing-nian)的[文章](https://zhuanlan.zhihu.com/p/100104481)，后来在[B 站](https://www.bilibili.com/video/av46223252/)看到了更详细的讲解，几天后这个项目便诞生了。

第一篇[介绍推送](https://mp.weixin.qq.com/s/zOmpevAUafFY5kPGYr65uA)微信公众号「恰好恰好」上发送了，这里就先不展开讲了。

<!-- 功能特性太多，写在这就太长了，新开一页写[特性说明](https://www.notion.so/benature/Word-Review-0f56c8a9131b4ae3b6d9a6fda5c4e655)（更新中）。 -->

</br>

<p align="center">单词复习页</p>
<p align="center">
  <a href="https://mp.weixin.qq.com/s/zOmpevAUafFY5kPGYr65uA"><img src="https://i.loli.net/2020/04/22/NvbTWkYVEgKysiq.gif" width="70%"/></a>
</p>
</br>
<p align="center">艾宾浩斯日历 & 主页</p>
<p align="center">
  <a href="https://mp.weixin.qq.com/s/zOmpevAUafFY5kPGYr65uA"><img src="https://mmbiz.qpic.cn/mmbiz_png/9Qko6AjFLJdWC8mmC154CmyorfPV5WRHibAXfZGR0mvIK64kKUQ6Z3iaqwibsgBeeaAmL2heNOSoEZ52XBFkMvy7A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" width="45%"/></a>
  <a href="https://mp.weixin.qq.com/s/zOmpevAUafFY5kPGYr65uA"><img src="https://mmbiz.qpic.cn/mmbiz_png/9Qko6AjFLJdWC8mmC154CmyorfPV5WRHal8icL0XqQQwTqTiatlE7icuEO9XOFU6BvZnc0dpiazo3hHicySRMsW11DA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" width="47%"/></a>
</p>
</br>

_蓝条是历史记忆率，绿条是上一轮的记忆率_  
_关于两种进度条的具体解释见[此处](#list-%E7%9A%84%E8%AE%B0%E5%BF%86%E7%8E%87)_

</br>

## 安装

> 对于小白可能还需要一些预备说明，请看[这里](https://www.notion.so/benature/Word-Review-9046ae4330ff49198c39491602064f3e)

命令行输入

```shell
git clone https://github.com/Benature/WordReview.git
```

或者点击右上角的`Clone or Download`的绿色按钮。

详细的安装指引写的有点长，请点击[这里](doc/install.md)查看，数据库初始化看[这里](doc/database_init.md)。

> 如果你实在不想折腾配置的话，可以在[这里](https://github.com/Benature/WordReview/releases)直接安装可执行文件。（但不推荐）

## 使用

```shell
conda activate <venvName> # 小白流程不用这条命令
python manage.py runserver
```

默认情况下会自动在默认浏览器打开<localhost:8000/>，开始背单词之旅吧 🤓

当您想要更新代码的时候，请

```shell
git pull
python manage.py makemigrations
python manage.py migrate
```

如果您想获取即时的统治（如新的 release 发布），可以点击网页右上方的`Watch`。

### 快捷键

|          操作          |                            快捷键                            |   页面   |       状态       |
| :--------------------: | :----------------------------------------------------------: | :------: | :--------------: |
|       设为重难词       |             <kbd>Shift</kbd>+<kbd>H</kbd> (Hard)             | 复习页面 |       全局       |
|       设为已掌握       |             <kbd>Shift</kbd>+<kbd>G</kbd> (Get)              | 复习页面 |       全局       |
|       设为很熟悉       |           <kbd>Shift</kbd>+<kbd>F</kbd> (Familiar)           | 复习页面 |       全局       |
|       设为太简单       |             <kbd>Shift</kbd>+<kbd>E</kbd> (Easy)             | 复习页面 |       全局       |
|     进入笔记输入框     |                     <kbd>N</kbd> (Note)                      | 复习页面 |       全局       |
|  跳转查看助记法（中）  |          <kbd>T</kbd> (Tips) / <kbd>V</kbd> (View)           | 复习页面 |       全局       |
|  跳转查看助记法（英）  |                   <kbd>M</kbd> (Mnemonic)                    | 复习页面 |       全局       |
|     跳转查看近义词     |                   <kbd>S</kbd> (Synonyms)                    | 复习页面 |       全局       |
|      词卡前后切换      |                  <kbd><</kbd>、<kbd>></kbd>                  | 复习页面 |       全局       |
|     List 前后切换      | <kbd>Shift</kbd>+<kbd><</kbd>、<kbd>Shift</kbd>+<kbd>></kbd> | 复习页面 |     学习状态     |
|        查看释义        |                       <kbd>空格</kbd>                        | 复习页面 |     复习状态     |
|     切换至学习状态     |                    <kbd>P</kbd> (Preview)                    | 复习页面 |     复习状态     |
|      触发重现模式      |                    <kbd>R</kbd> (Repeat)                     | 复习页面 |     复习状态     |
| 触发输入模式（实验中） |                     <kbd>I</kbd> (Input)                     | 复习页面 |     复习状态     |
|         我记得         |                <kbd>Shift</kbd>+<kbd>→</kbd>                 | 复习页面 |     复习状态     |
|         不认识         |                <kbd>Shift</kbd>+<kbd>←</kbd>                 | 复习页面 |     复习状态     |
|  复制`WordSand`助记法  |                     <kbd>C</kbd> (Copy)                      | 复习页面 | 安装 Chrome 插件 |
|     跳转到日历页面     |                   <kbd>C</kbd> (Calendar)                    |   主页   |        -         |
|     跳转到昨日重现     |                   <kbd>Y</kbd> (Yesterday)                   |   主页   |        -         |

### 词根词缀词源拆词渲染

1. 【推荐】等号`=`与回车作为标记符，detain 为例：

   ```txt
   de=down
   tain
   ```

2. 以中文括号与`＋`标识，temerity 为例：

   ```txt
   temer（轻率）＋ity
   ```

### List 的记忆率

- 蓝条：历史记忆率，对 List 内单词的总记忆率取平均
- 绿条：上轮记忆率，按 List 内单词的 **最新两次** 记忆情况计算平均记忆率

### 单词的`flag`

- 太简单：✅ 打钩，下次背词不再出现，统计记忆率时视为 `1`
- 很熟悉：☁️ 浮云，下次背词不再出现，统计记忆率时视为 `1`
- 已掌握：🟢 绿灯，下次背词仍然出现，统计记忆率时视为 `1`
- 重难词：⭐️ 标星

---

<!-- [TODO 清单](https://www.notion.so/benature/WordReview-fa7e264c1e2048639586af4eb952374f)（有点杂乱） -->


### 问题自检
如果遇到问题，请先查看这几处是否有报错信息
- 浏览器的 Console (<kbd>F12</kbd>)
- 启动`python manage.py runserver`的命令行

如果导入数据出现问题，请先尝试导入本仓库提供的示例数据。如果示例数据导入成功，很有可能是自定义数据哪里有误。

请先尝试根据上方得到的信息自行检索尝试，如若仍未解决，可以 issue 提出。


### 更新日志
参见 [CHANGELOG.md](./doc/CHANGELOG.md)
