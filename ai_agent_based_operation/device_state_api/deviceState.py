import os
import requests
import json
import logging
from dotenv import load_dotenv  # .envの利用
import urllib3

# .envファイルを読み込む
#load_dotenv()

# SSL警告を無視（必要に応じて削除）
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class DeviceState:
    __instance = None

    @staticmethod
    def get_instance():
        if DeviceState.__instance is None:
            DeviceState()
        return DeviceState.__instance

    def __init__(self):
        if DeviceState.__instance is not None:
            raise Exception("This class is a singleton!")
        else:
            DeviceState.__instance = self
            self.state = {}

    def fetch_states_from_openshift(self):
        # 環境変数からAPI設定を読み込む
        API_SERVER = os.getenv("API_SERVER")
        TOKEN = os.getenv("OPENSHIFT_BEARER_TOKEN")
        NAMESPACE = "petstore"
        HEADERS = {
            "Authorization": f"Bearer {TOKEN}",
            "Accept": "application/json"
        }
        PODS_ENDPOINT = f"{API_SERVER}/api/v1/namespaces/{NAMESPACE}/pods"

        try:
            # OpenShift APIからPod情報を取得
            response = requests.get(PODS_ENDPOINT, headers=HEADERS, verify=False)
            response.raise_for_status()
            pods_data = response.json()

            # 対象コンテナのステータスを収集
            container_mapping = {
                "application_server": "petstore-demo",
                "database": "postgresql",
                "user_migration_app": "user-migration-app"
            }
            states = {key: "stopped" for key in container_mapping}  # デフォルトは "stopped"

            for pod in pods_data.get("items", []):
                pod_name = pod["metadata"]["name"]
                for container in pod.get("status", {}).get("containerStatuses", []):
                    container_name = container["name"]
                    for key, target_container in container_mapping.items():
                        if container_name == target_container:
                            state_info = container["state"]
                            if "running" in state_info:
                                states[key] = "running"
                            else:
                                states[key] = "stopped"

            self.state = states
        except requests.exceptions.RequestException as e:
            print(f"Error fetching container states: {e}")
            self.state = {}

    def get_state(self, device_name):
        return self.state.get(device_name)

    def get_all_states(self):
        self.fetch_states_from_openshift()
        return self.state