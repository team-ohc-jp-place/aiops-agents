#!/bin/bash

# 管理者ログインの確認
if [ "$(oc whoami)" != "admin" ] && [ "$(oc whoami)" != "kube:admin" ]; then
  echo "Login as admin or kubeadmin first."
  exit
fi

## インストール済みチェック
#if [ -f installed ]; then
#  echo "already installed."
#  exit
#fi
#
## 既存のサブスクリプション（Subscription）の削除
#echo -e "\n ===== Delete an existing Subscription ====="
#oc get subs -n openshift-operators | grep -v NAME | awk '{ print $1 }' | while read subscription; do
#  oc delete subs/${subscription} -n openshift-operators
#done
#
## 既存の CSV（Cluster Service Version）の削除
#echo -e "\n ===== Delete an existing CSV ====="
#oc get csv -n openshift-operators | grep -v NAME | awk '{ print $1 }' | while read csv; do
#  oc delete csv/${csv} -n openshift-operators
#done
#
#sleep 20

# リソース適用（YAML ファイルの再適用）
echo -e "\n ===== Installing Operator ====="
find . -type f -name "*.yaml" | sort | while read yaml; do
  while true; do
    oc apply -f ${yaml}
    if [ $? -eq 0 ]; then
      break
    fi
    sleep 3
  done

  # CSV 状態の確認
  sleep 5
  sc=$(oc get subs -n openshift-operators | grep -v elastic | grep -v NAME | wc -l)
  sc=${sc:-0}

  limit=30
  while true; do
    cc=$(oc get csv -n openshift-operators | grep -v elastic | grep -v NAME | wc -l)
    cc=${cc:-0}
    
    csc=$(oc get csv -n openshift-operators | grep -v elastic | grep -v NAME | grep Succeeded | wc -l)
    csc=${csc:-0}
    
    echo "Subs/CSV/Succeeded CSV : ${sc}/${cc}/${csc} [${limit}]"
    if [ "${sc}" -eq "${cc}" ] && [ "${sc}" -eq "${csc}" ]; then
      break
    fi
    sleep 5
    limit=$((limit-1))
    if [ "${limit}" -eq 0 ]; then
      touch retry
      exit 1
    fi
  done
done

if [ ! -f retry ]; then
  touch installed
  exit 0
else
  rm -f retry
  exit 1
fi
