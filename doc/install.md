# MySQL Install

## MacOS

1. 下载
download from <https://dev.mysql.com/downloads/mysql/>, select `macOS 10.14 (x86, 64-bit), DMG Archive`(.dmg file)

>顺路会看到一个叫 workbench 的，可视化工具，就像看 excel 看数据库，which is recommended.

2. 安装
clike `next` all the way.

set the PATH

```shell
vim ~/.bash_profile
PATH=$PATH:/usr/local/mysql/bin
```

## GUI app 数据库可视化工具

- MySQL Workbench (free & recommend)
  ~~如同处理 excel，不用学 mysql 命令也能操作数据库啦~~
