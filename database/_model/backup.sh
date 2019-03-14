#!/bin/sh
#host port user password
# ./backup.sh 127.0.0.1 33066 root {password}
_now=$(date +"%m_%d_%Y_%H_%M_%S")

mysqldump -h $1 -P $2 -u $3 -p$4 "app" --add-drop-database --databases app --triggers --routines > "app.sql"
mysqldump -h $1 -P $2 -u $3 -p$4 "log" --add-drop-database --databases log --triggers --routines > "log.sql"