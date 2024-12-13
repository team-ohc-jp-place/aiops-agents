import os,sys
import json
import os

from device_state_api.deviceState import DeviceState
from ansible_playbook_api.ansible import ansible_playbook_api


# デバイスの状態を管理するシングルトン
#class DeviceState:
#    __instance = None
#
#    @staticmethod
#    def get_instance():
#        if DeviceState.__instance is None:
#            DeviceState()
#        return DeviceState.__instance
#
#    def __init__(self):
#        if DeviceState.__instance is not None:
#            raise Exception("This class is a singleton!")
#        else:
#            DeviceState.__instance = self
#            self.state = {
#                "application_server": "stopped",
#                "database": "stopped",
#                "user_migration_app": "stopped"
#            }
#
#    def get_state(self, device_name):
#        return self.state.get(device_name)
#
#    def set_state(self, device_name, state):
#        self.state[device_name] = state
#
#    def get_all_states(self):
#        return self.state
#


#def ansible_playbook_api(control_device_name, action):
#    """
#    Ansible Playbook APIのモック実装
#
#    Args:
#        control_device_name: コントロール対象のデバイス名 (application_server, database, user_migration_app)
#        action: 実行するアクション (stop, start, reset)
#    """
#
#    device_state = DeviceState.get_instance()
#
#    if control_device_name not in ["application_server", "database", "user_migration_app"]:
#        return "Invalid control device name."
#
#    if action not in ["stop", "start", "reset"]:
#        return "Invalid action."
#
#    current_state = device_state.get_state(control_device_name)
#
#    if action == "start":
#        if current_state == "stopped":
#            device_state.set_state(control_device_name, "running")
#            #print(f"{control_device_name} running.")
#    elif action == "stop":
#        if current_state == "running":
#            device_state.set_state(control_device_name, "stopped")
#            #print(f"{control_device_name} stopped.")
#    # monitoring_data.jsonの更新
#    try:
#        with open("monitoring_data.json", "r") as f:
#            monitoring_data = json.load(f)
##    except FileNotFoundError:
#        monitoring_data = {  # 初期データを作成
#            "application_server": {
#                "cpu": "20%",
#                "memory": "30%",
#                "error_log": []
#            },
#            "database": {
#                "cpu": "15%",
#                "memory": "40%",
#                "error_log": ["DB connection error"]
#            },
#            "user_migration_app": {
#                "cpu": "5%",
#                "memory": "10%",
#                "error_log": []
#            }
#        }
#
#
#    new_state = device_state.get_state(control_device_name)
#
#    if new_state == "stopped":
#        monitoring_data[control_device_name]["cpu"] = "0%"
#        monitoring_data[control_device_name]["memory"] = "0%"
#    elif new_state == "running":
#        monitoring_data[control_device_name]["cpu"] = "5%"
#        monitoring_data[control_device_name]["memory"] = "5%"  # メモリも5%に修正
#
#
#   monitoring_data[control_device_name]["error_log"] = [] # error_logクリア
#
#
#    with open("monitoring_data.json", "w") as f:
#        json.dump(monitoring_data, f, indent=4)
#
#
#    return f"{control_device_name} {action} successful. Current state: {new_state}"
#
#
#def monitor_system() -> str:
#    """
#    A function that monitors CPU usage, memory usage, and error logs
#    for the application server, database, and user migration application.
#
#    Returns:
#        str: Returns monitoring results as a JSON-formatted string.
#             If file reading fails, returns JSON containing an error message.
#    """
#
#    filepath = "monitoring_data.json"  # 監視データのファイルパス
#
#    try:
#        with open(filepath, "r", encoding="utf-8") as f:
#            monitoring_data = json.load(f)
#            return json.dumps(monitoring_data, indent=4, ensure_ascii=False)
#
#    except FileNotFoundError:
#        error_message = {
#            "error": f"ファイル '{filepath}' が見つかりません。"
#        }
#        return json.dumps(error_message, indent=4, ensure_ascii=False)
#    except json.JSONDecodeError:
#        error_message = {
#            "error": f"ファイル '{filepath}' のJSON形式が不正です。"
#        }
#        return json.dumps(error_message, indent=4, ensure_ascii=False)
#    except Exception as e:  # その他のエラーをキャッチ
#        error_message = {
#            "error": f"エラーが発生しました: {str(e)}"
#        }
#        return json.dumps(error_message, indent=4, ensure_ascii=False)
#

def fault_injection():
    ansible_playbook_api("database", "start")
    ansible_playbook_api("database", "start")
    ansible_playbook_api("user_migration_app", "start")

    try:
        with open("monitoring_data.json", "r") as f:
            monitoring_data = json.load(f)
    except FileNotFoundError:
        monitoring_data = {  # 初期データを作成
            "application_server": {
                "cpu": "20%",
                "memory": "30%",
                "error_log": []
            },
            "database": {
                "cpu": "15%",
                "memory": "40%",
                "error_log": ["DB connection error"]
            },
            "user_migration_app": {
                "cpu": "5%",
                "memory": "10%",
                "error_log": []
            }
        }

    monitoring_data["database"]["cpu"] = "100%"
    monitoring_data["database"]["memory"] = "100%"
    monitoring_data["application_server"]["error_log"] = ["error: sorry, too many clients already\n    at /home/tikeda/workspace/temp/petstore_demo/node_modules/pg-pool/index.js:45:11\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)\n    at async <anonymous> (/home/tikeda/workspace/temp/petstore_demo/node_modules/src/node-postgres/session.ts:104:19)\n    at async Strategy._verify (/home/tikeda/workspace/temp/petstore_demo/server/auth.ts:64:24)"]
    monitoring_data["user_migration_app"]["cpu"] = "100%"

    with open("monitoring_data.json", "w") as f:
        json.dump(monitoring_data, f, indent=4)

def main():

    #fault_injection()
    #print(monitor_system())
    print( DeviceState.get_instance().get_all_states())
    exit()
    print(ansible_playbook_api("application_server", "start"))
    print(ansible_playbook_api("database", "start"))
    print(ansible_playbook_api("user_migration_app", "stop"))
    print( DeviceState.get_instance().get_all_states())
    print(monitor_system())

if __name__ == "__main__":
    main()


