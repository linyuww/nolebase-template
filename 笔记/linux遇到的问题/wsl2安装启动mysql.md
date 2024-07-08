**wsl2安装启动mysql**

启动

```bash
 sudo /etc/init.d/mysql start
```

配置文件

```bash
sudo cat /etc/mysql/debian.cnf
```

用户名密码就在这

```mysql
[client]
host     = localhost
user     = debian-sys-maint
password = GVJVTcLmTS4uubBB
socket   = /var/run/mysqld/mysqld.sock
[mysql_upgrade]
host     = localhost
user     = debian-sys-maint
password = GVJVTcLmTS4uubBB
socket   = /var/run/mysqld/mysqld.sock
```

复制到用户名文件夹可以免输入用户名密码

```bash
sudo cp /etc/mysql/debian.cnf .my.cnf
```

要改变文件的所有者为用户

```ba
sudo chown cgz .my.cnf
```





遇到报错

```bash
ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)
```

问题就是没启动

运行上面的启动命令就行
