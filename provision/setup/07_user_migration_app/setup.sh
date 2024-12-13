#!/bin/bash

export PJ_NAME=petstore
export APP_NAME=user-migration-app
export GITLAB_USER=<input git-username>
export GITLAB_TOKEN=<input git-access-token>
oc project $PJ_NAME

# GITLAB ACCESS TOKEN Secret
echo -e "\n ===== Creating Secret for GITLAB ACCESS ====="
oc create secret generic gitlab-secret \
    --from-literal=username=$GITLAB_USER \
    --from-literal=password=$GITLAB_TOKEN

sleep 5

### PostgreSQLに負荷をかけるアプリを作成
echo -e "\n ===== Creating an application that loads PostgreSQL ====="
oc new-app python:3.9-ubi9~https://github.com/team-ohc-jp-place/aiops-agents.git \
    --context-dir=user_migration_app \
    --name=$APP_NAME \
    --source-secret=gitlab-secret \
    -e THREADS=200 \
    -e WORKLOAD=200 \
    -e LOADTIMES=120 

sleep 5

oc set resources deployment/$APP_NAME -n $PJ_NAME \
    --limits=cpu=300m,memory=512Mi

sleep 5

# Configmapの反映
oc set env deployment/$APP_NAME --from=configmap/database-config

