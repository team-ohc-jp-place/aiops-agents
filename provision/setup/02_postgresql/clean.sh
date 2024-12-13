#!/bin/bash

export APP_NAME=postgresql
export DATABASE_SERVICE_NAME=postgresql
export POSTGRESQL_USER=chatbiz
export POSTGRESQL_PASSWORD=chatbiz
export POSTGRESQL_DATABASE=mydatabase
export PJ_NAME=petstore

oc delete deployment $APP_NAME -n $PJ_NAME
oc delete svc/$DATABASE_SERVICE_NAME -n $PJ_NAME
oc delete secret/$APP_NAME -n $PJ_NAME
oc delete cm/postgres-init-scripts -n $PJ_NAME
oc delete pvc/postgresql -n $PJ_NAME