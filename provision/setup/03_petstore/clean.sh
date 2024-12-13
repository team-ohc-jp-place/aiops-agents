#!/bin/bash

export APP_NAME=petstore-demo
export PJ_NAME=petstore

oc delete deployment $APP_NAME -n $PJ_NAME
oc delete svc/$APP_NAME -n $PJ_NAME
oc delete cm/database-config -n $PJ_NAME
oc delete route $APP_NAME -n $PJ_NAME