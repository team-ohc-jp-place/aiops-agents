#!/bin/bash

# Check if script is run as root or with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or use sudo to execute this script."
  exit 1
fi

# プロジェクトの存在確認と作成
check_or_create_project() {
  local PROJECT_NAME=$1
  if oc get project "$PROJECT_NAME" >/dev/null 2>&1; then
    echo "Project '$PROJECT_NAME' already exists. Skipping creation."
    oc project "$PROJECT_NAME"
  else
    echo "Creating project '$PROJECT_NAME'."
    oc new-project "$PROJECT_NAME"
  fi
}

######################

# OpenShiftに管理者でログイン
if [ "$(oc whoami)" != "admin" ] && [ "$(oc whoami)" != "kube:admin" ]; then
  echo "Login as admin or kubeadmin first."
  exit
fi

# AnshibleのSubscription Manifest
if [ ! -f 04_ansible/automationcontroller_manifest.zip ]; then
  echo "You need to put 04_ansible/automationcontroller_manifest.zip."
  exit
fi

# プロジェクトの有無チェック
PROJECTS=("aap" "petstore" "minio" "ai-agent")

for PROJECT in "${PROJECTS[@]}"; do
  check_or_create_project "$PROJECT"
done

oc adm policy add-scc-to-user privileged -z default -n aap

base=$(pwd)

# フォルダをリストに格納
directories=($(ls -d */))

# リストをループ処理
for directory in "${directories[@]}"; do
  echo "Processing directory: '${directory}'"
  
  cd "${directory}" || { echo "ERROR: Failed to enter directory '${directory}', skipping..."; continue; }
  echo -e "\n ===== at ${directory} ====="

  if [ -f setup.sh ]; then
    echo -e "\n ===== execute setup.sh ====="
    ./setup.sh
    if [ $? -ne 0 ]; then
      echo "WARNING: setup.sh encountered an error in ${directory}, continuing to the next directory..."
    fi
  else
    echo -e "\n ===== No setup.sh found. Executing YAML files ====="
    yaml_files=($(ls *.yaml 2>/dev/null)) # YAMLファイルを取得（なければ空リスト）
    for yaml in "${yaml_files[@]}"; do
      echo "Applying ${yaml} in directory ${directory}"
      while true; do
        oc apply -f "${yaml}"
        if [ $? -eq 0 ]; then
          break
        fi
        echo "Retrying ${yaml} in directory ${directory}..."
        sleep 3
      done
    done
  fi

  cd "${base}" || { echo "ERROR: Failed to return to base directory '${base}', exiting."; exit 1; }

done

echo -e "\n ===== Complete Provisioning ====="