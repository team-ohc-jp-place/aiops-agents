#!/bin/bash

# Check if script is run as root or with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or use sudo to execute this script."
  exit 1
fi

export CONTROLLER_USERNAME=admin
export CONTROLLER_PASSWORD=redhat
export CONTROLLER_NAME=ansible
export CONTROLLER_NAMESPACE=aap
export CSV_NAME=$(oc get csv -n $CONTROLLER_NAMESPACE | grep aap-operator | awk '{print $1}')

oc project $CONTROLLER_NAMESPACE

# Ansible Operator のステータスがSucceedになっている
echo -e "\n ===== Waiting Ansible Operator ====="
while true; do
  RESPONSE=$(oc get csv $CSV_NAME -o=jsonpath='{.status.phase}' -n $CONTROLLER_NAMESPACE)
  if [ "$RESPONSE" = "Succeeded" ]; then
    break
  fi
  echo -e "waiting..."
  sleep 3
done

# Ansible Controller のデプロイ
echo -e "\n ===== Deploying Ansible Controller ====="
oc apply -f 01_secret.yaml

sleep 5

oc apply -f 02_instance.yaml

# Ansible Controller のデプロイ完了待ち
echo -e "\n ===== Checking Ansible Controller ====="
while true; do
  # AutomationController の conditions を取得
  CONDITIONS=$(oc get AutomationController "$CONTROLLER_NAME" -o=jsonpath="{.status.conditions}" -n "$CONTROLLER_NAMESPACE")

  # 条件が取得できているか確認
  if [ -z "$CONDITIONS" ]; then
    echo "CONDITIONS is empty. Exiting..."
    exit 1
  fi

  # type: Successful の条件を抽出し reason を取得
  REASON=$(echo "$CONDITIONS" | grep -o '{"lastTransitionTime":[^}]*"type":"Successful"[^}]*}' | grep -o '"reason":"[^"]*"' | awk -F':' '{print $2}' | tr -d '"')

  # 条件を満たすか確認
  if [ "$REASON" = "Successful" ]; then
    echo "Condition met: type: Successful and reason: Successful"
    break
  fi

  # 条件を満たしていない場合は再試行
  echo "Waiting for type: Successful with reason: Successful..."
  sleep 5
done

# Python仮想環境のセットアップ
echo -e "\n ===== Python venv Install ====="
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip3 install ansible

# Ansibleコレクションのインストール
echo -e "\n ===== Ansible Collection Install ====="
ansible-galaxy collection install -r requirements.yaml

# OpenShift Routeの確認
echo -e "\n ===== Checking Ansible Controller Route ====="
max_retries=30
retries=0
while true; do
  controller_host=$(oc get route/ansible -o jsonpath="{.spec.host}" 2>/dev/null)
  if [ -n "$controller_host" ]; then
    break
  fi
  retries=$((retries + 1))
  if [ $retries -ge $max_retries ]; then
    echo "Route creation timed out."
    exit 1
  fi
  sleep 3
done

# ライセンス適用
echo -e "\n ===== Applying Subscription ====="
while true; do
  ansible localhost -m awx.awx.license -a "manifest=automationcontroller_manifest.zip controller_host=${controller_host} controller_username=${CONTROLLER_USERNAME} controller_password=${CONTROLLER_PASSWORD}"
  if [ $? -eq 0 ]; then
    break
  fi
  sleep 3
done

# Playbookの実行
echo -e "\n ===== Launch Playbook for Setup ====="
while true; do
  ansible-playbook -i inventory.yaml setup.yaml -e "automation_controller_host=${controller_host}"
  if [ $? -eq 0 ]; then
    break
  fi
  sleep 3
done
