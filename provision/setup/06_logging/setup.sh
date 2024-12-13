#!/bin/bash

export PJ_NAME=openshift-logging
oc project $PJ_NAME

# MinIO のアクセス情報を格納するシークレットの作成
echo -e "\n ===== Creating Secret for access MINIO ====="
oc apply -f 01_loki-secret.yaml

sleep 5

# LOKI Stack のデプロイ
echo -e "\n ===== Deploying LOKI Stack ====="
oc apply -f 02_logging-loki.yaml

sleep 5

echo -e "\n ===== Creating ServiceAccount & Role ====="
oc create sa collector -n openshift-logging
oc adm policy add-cluster-role-to-user logging-collector-logs-writer -z collector -n openshift-logging
oc apply -f 03_logging-collector-logs-writer.yaml
oc apply -f 04_logging-collector-logs-writer-binding.yaml

oc adm policy add-cluster-role-to-user cluster-logging-collector -z collector -n openshift-logging
oc apply -f 05_cluster-logging-collerctor.yaml
oc apply -f 06_cluster-logging-collector-binding.yaml

oc adm policy add-cluster-role-to-user collect-application-logs -z collector
oc adm policy add-cluster-role-to-user collect-audit-logs -z collector
oc adm policy add-cluster-role-to-user collect-infrastructure-logs -z collector

sleep 5

echo -e "\n ===== Creating Logs UI Plugin ====="
oc apply -f 07_uiplugin-loki.yaml

sleep 5

echo -e "\n ===== Creating ClusterLogForwarder ====="
oc apply -f 08_clusterlogforwarder.yaml


