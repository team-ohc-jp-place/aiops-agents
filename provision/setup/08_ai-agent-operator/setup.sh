#!/bin/bash

export PJ_NAME=ai-agent
export APP_NAME=ai-agent-operation

export API_SERVER=$(oc whoami --show-server)
export PROMETHEUS_API=$(oc get route prometheus-k8s -n openshift-monitoring -o jsonpath='{.spec.host}')
export LOKI_API=$(oc get route logging-loki -n openshift-logging -o jsonpath='{.spec.host}')
export OPENAI_API_KEY=<input your openai-api-key> #自分のOPENAI_API_KEYを入力してください。
export OPENSHIFT_BEARER_TOKEN=$(oc whoami --show-token)
export CONTROLLER_URL=$(oc get route ansible -n aap -o jsonpath='{.spec.host}')
export USERNAME=admin
export PASSWORD=redhat

oc project $PJ_NAME

# Configmap作成
echo -e "\n ===== Creating Configmap for AI Agent Operation ====="
oc create configmap api-config \
  --from-literal=API_SERVER=$API_SERVER \
  --from-literal=PROMETHEUS_API=$PROMETHEUS_API \
  --from-literal=LOKI_API=$LOKI_API \
  --from-literal=CONTROLLER_URL="https://$CONTROLLER_URL" \
  --from-literal=USERNAME=$USERNAME

sleep 5

# Secret作成
echo -e "\n ===== Creating Secret for AI Agent Operation ====="
oc create secret generic api-secrets \
  --from-literal=OPENAI_API_KEY=$OPENAI_API_KEY \
  --from-literal=OPENSHIFT_BEARER_TOKEN=$OPENSHIFT_BEARER_TOKEN \
  --from-literal=PASSWORD=$PASSWORD

sleep 5

# Deploy from Quay.io
echo -e "\n ===== Deploying AI Agent Operation ====="
oc new-app --name=$APP_NAME quay.io/kamori/$APP_NAME:latest -n $PJ_NAME

sleep 5

oc set env deployment/$APP_NAME --from=configmap/api-config -n $PJ_NAME
oc set env deployment/$APP_NAME --from=secret/api-secrets -n $PJ_NAME
