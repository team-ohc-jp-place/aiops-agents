#!/bin/bash
export APP_NAME=petstore-demo
export PJ_NAME=petstore

oc project $PJ_NAME

echo -e "\n ===== Deploying Petstore Demo App ====="

# Petstore Demo App のConfigmap作成
echo -e "\n ===== Creating Configmap for Petstore Demo App ====="
oc apply -f 01_petstore_configmap.yaml -n $PJ_NAME

sleep 5

# Petstore Demo App のデプロイ from Quay.io
echo -e "\n ===== Deploying Petstore Demo App ====="
oc new-app --name=$APP_NAME quay.io/kamori/petstore-demo:latest
#oc new-app --name=$APP_NAME quay.io/kamori/petstore-demo:test-1.0

oc set resources deployment/$APP_NAME -n $PJ_NAME \
    --limits=cpu=300m,memory=512Mi

# Configmapの反映
oc set env deployment/$APP_NAME --from=configmap/database-config

# Route作成
oc create route edge --service=$APP_NAME --port=5000

oc label deployment $APP_NAME app.openshift.io/runtime=nodejs --overwrite -n $PJ_NAME
