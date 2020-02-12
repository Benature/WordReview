# TG Word

- django-3.0.3
- Mysql

## Mysql configuration

```sql
show databases;
use mysql;
create database tg_word_db character set utf8;
create user 'tg_word_user'@'localhost' identified by 'tg_word2020'; -- 新建用户
grant all privileges ON tg_word_db.* TO 'tg_word_user'@'localhost'; -- 授权
flush privileges; -- 刷新系统权限表
```