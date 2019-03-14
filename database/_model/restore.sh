#!/bin/sh
#host port user password
# ./restore.sh 127.0.0.1 33066 root {password}
# export PATH=$PATH:/usr/local/mysql/bin
mysql -h $1 -P $2 -u $3 -p$4 < app.sql
mysql -h $1 -P $2 -u $3 -p$4 < log.sql