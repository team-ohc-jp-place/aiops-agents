#!/bin/bash

export APP_NAME=postgresql
export DATABASE_SERVICE_NAME=postgresql
export POSTGRESQL_USER=chatbiz
export POSTGRESQL_PASSWORD=chatbiz
export POSTGRESQL_DATABASE=mydatabase
export PJ_NAME=petstore

oc project $PJ_NAME

# Postgresql のConfigmap作成
echo -e "\n ===== Creating Configmap for PostgreSQL ====="
oc apply -f 01_postgresql-configmap.yaml -n $PJ_NAME

sleep 5

echo -e "\n ===== Deploying PostgreSQL ====="
oc process -n $PJ_NAME -f 02_postgresql-template.yaml -l app=$APP_NAME \
    -p DATABASE_SERVICE_NAME=$DATABASE_SERVICE_NAME \
    -p POSTGRESQL_USER=$POSTGRESQL_USER \
    -p POSTGRESQL_PASSWORD=$POSTGRESQL_PASSWORD \
    -p POSTGRESQL_DATABASE=$POSTGRESQL_DATABASE \
      | oc create -f -

# Postgresql のデプロイ完了待ち
echo -e "\n ===== Waiting for deploying PostgreSQL ====="
while true; do
  # DC/Postgresql の conditions を取得
  CONDITIONS=$(oc get deployment/$APP_NAME -o=jsonpath="{.status.conditions}" -n $PJ_NAME)

  # 条件が取得できているか確認
  if [ -z "$CONDITIONS" ]; then
    echo "CONDITIONS is empty. Exiting..."
    exit 1
  fi

  # type: Available の条件を抽出し reason を取得
  STATUS=$(echo "$CONDITIONS" | grep -o '{"lastTransitionTime":[^}]*"type":"Available"[^}]*}' | grep -o '"status":"[^"]*"' | awk -F':' '{print $2}' | tr -d '"')

  # 条件を満たすか確認
  if [ "$STATUS" = "True" ]; then
    break
  fi

  # 条件を満たしていない場合は再試行
  echo "Waiting for deploying postgresql..."
  sleep 5
done

# Postgresql の初期設定
echo -e "\n ===== PostgreSQL Initialization ====="

POSTGRESQL_POD=$(oc get pods --field-selector=status.phase=Running -o custom-columns="NAME:{.metadata.name}" | grep postgresql)
oc cp ./config/postgresql.conf $POSTGRESQL_POD:/var/lib/pgsql/data/userdata/postgresql.conf -n $PJ_NAME

oc rsh -n $PJ_NAME deployment/$APP_NAME psql -U $POSTGRESQL_USER -d $POSTGRESQL_DATABASE -f /docker-entrypoint-initdb.d/init.sql

sleep 10

oc label deployment/$APP_NAME app.openshift.io/runtime=postgresql --overwrite -n $PJ_NAME

oc set resources deployment/$DATABASE_SERVICE_NAME -n $PJ_NAME \
    --limits=cpu=300m,memory=512Mi



