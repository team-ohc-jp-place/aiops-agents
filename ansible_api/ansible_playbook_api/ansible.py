import os
import requests
from dotenv import load_dotenv
from requests.auth import HTTPBasicAuth
import urllib3

# SSL警告を無視（必要に応じて削除）
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

load_dotenv()  # .envファイルを読み込む

# 環境変数から設定を取得
CONTROLLER_URL = os.getenv("CONTROLLER_URL")
USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")

def get_job_template_id(controller_url, username, password, template_name):
    """
    ジョブテンプレートの名前からIDを取得する関数
    """
    url = f"{controller_url}/api/v2/job_templates/?name={template_name}"
    response = requests.get(url, auth=HTTPBasicAuth(username, password), verify=False)

    if response.status_code == 200:
        data = response.json()
        if data["count"] > 0:
            return data["results"][0]["id"]
        else:
            print(f"No Job Template found with name: {template_name}")
            return None
    else:
        print(f"Failed to fetch Job Templates: {response.status_code}")
        print(response.text)
        response.raise_for_status()

def launch_job_template(controller_url, username, password, job_template_id, extra_vars=None):
    """
    ジョブテンプレートを実行する関数
    """
    url = f"{controller_url}/api/v2/job_templates/{job_template_id}/launch/"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {}
    if extra_vars:
        payload["extra_vars"] = extra_vars

    response = requests.post(
        url,
        json=payload,
        headers=headers,
        auth=HTTPBasicAuth(username, password),
        verify=False
    )

    if response.status_code == 201:
        print("Job Template launched successfully.")
        return True
    else:
        print(f"Failed to launch Job Template: {response.status_code}")
        print(response.text)
        return False

def ansible_playbook_api(control_device_name: str, action: str) -> bool:
    """
    Ansible Automation Controllerのジョブテンプレートを実行する関数

    :param control_device_name: 制御対象デバイス名
    :param action: 実行するアクション
    :return: 成功した場合はTrue、失敗した場合はFalse
    """
    # 許容される値をチェック
    valid_devices = ["application_server", "database", "user_migration_app"]
    valid_actions = ["start", "stop", "reset"]

    if control_device_name not in valid_devices:
        print(f"Invalid control_device_name: {control_device_name}")
        return False

    if action not in valid_actions:
        print(f"Invalid action: {action}")
        return False

    # Playbook名を決定
    playbook_name = f"{control_device_name}_{action}"

    try:
        # 名前からIDを取得
        job_template_id = get_job_template_id(CONTROLLER_URL, USERNAME, PASSWORD, playbook_name)

        if job_template_id:
            # ジョブテンプレートを実行
            success = launch_job_template(CONTROLLER_URL, USERNAME, PASSWORD, job_template_id)
            return success
        else:
            print(f"Job Template '{playbook_name}' not found.")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False
