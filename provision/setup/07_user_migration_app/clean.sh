#!/bin/bash

oc project petstore

oc delete all -l app=user-migration-app
oc delete secret gitlab-secret