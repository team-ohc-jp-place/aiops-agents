#!/bin/bash

export PJ_NAME=minio
oc project $PJ_NAME

# S3 Bucket のデプロイ
echo -e "\n ===== Deploying MINIO ====="
oc apply -f 01_minio.yaml







