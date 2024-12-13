#!/bin/bash

export PJ_NAME=ai-agent

oc delete all -l app=ai-agent-operation -n $PJ_NAME
oc delete secret api-secrets -n $PJ_NAME
oc delete cm api-config -n $PJ_NAME