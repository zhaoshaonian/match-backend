#!/bin/sh

docker build -t registry-vpc.cn-shanghai.aliyuncs.com/naquyong/songjiang-backend:latest .

docker push registry-vpc.cn-shanghai.aliyuncs.com/naquyong/songjiang-backend:latest

curl 'https://cs.console.aliyun.com/hook/trigger?triggerUrl=Y2U5YzFkM2QwYjRiNzRkOWRhYTM2MzA3OTg4MmUxZDkyfHN1aW5peW9uZy1iYWNrZW5kfHJlZGVwbG95fDFhdjBicjRwcW1yNmZ8&secret=6a674a36765a4857674344586b30783787c5ac579bb52f428350536401438ba0'
