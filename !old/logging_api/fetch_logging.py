import requests
import argparse
from datetime import datetime, timedelta, timezone
import json
import os
import urllib3

# SSL警告を無視（必要に応じて削除）
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def get_loki_logs(loki_api, token, namespace, container_name, start_minutes_ago=1, step="5s"):
    url = f"https://{loki_api}/api/logs/v1/application/loki/api/v1/query_range"
    
    # 現在時刻と開始時刻を計算
    end_time = datetime.now(timezone.utc)
    start_time = end_time - timedelta(minutes=start_minutes_ago)
    
    params = {
        "query": f'{{kubernetes_container_name="{container_name}", kubernetes_namespace_name="{namespace}"}}',
        "start": start_time.strftime('%Y-%m-%dT%H:%M:%SZ'),
        "end": end_time.strftime('%Y-%m-%dT%H:%M:%SZ'),
        "step": step,
    }

    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = requests.get(url, headers=headers, params=params, verify=False)
        response.raise_for_status()
        return response.json(), end_time
    except requests.exceptions.RequestException as e:
        print(f"Error fetching logs: {e}")
        return None, end_time

def save_raw_response_to_file(raw_data, end_time, file_prefix="logs"):
    # "logs" フォルダを作成
    output_dir = "logs"
    os.makedirs(output_dir, exist_ok=True)

    try:
        # ファイル名にタイムスタンプを追加 (秒まで)
        timestamp = end_time.strftime('%Y%m%dT%H%M%SZ')
        file_name = f"{file_prefix}_{timestamp}.json"
        file_path = os.path.join(output_dir, file_name)  # "logs" フォルダ内のパス

        with open(file_path, "w") as file:
            json.dump(raw_data, file, indent=4)  # JSONを整形して保存
        print(f"Raw response saved to {file_path}")
    except IOError as e:
        print(f"Error saving raw response: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch logs from OpenShift Loki API with certificate verification")
    parser.add_argument("loki_api", help="Loki API endpoint (e.g., logging-loki.<domain>)")
    parser.add_argument("token", help="Bearer token for authentication")
    parser.add_argument("--namespace", default="petstore", help="Namespace of the logs to fetch (default: petstore)")
    parser.add_argument("--container", default="petstore-demo", help="Container name of the logs to fetch (default: petstore-demo)")
    parser.add_argument("--start-minutes-ago", type=int, default=1, help="How many minutes ago to start fetching logs (default: 1)")
    parser.add_argument("--step", default="5s", help="Step duration for the query (default: 5s)")
    parser.add_argument("--output-prefix", default="logs", help="Prefix for the output log file (default: logs)")
    
    args = parser.parse_args()
    
    raw_data, end_time = get_loki_logs(args.loki_api, args.token, args.namespace, args.container, args.start_minutes_ago, args.step)

    if raw_data:
        print("Raw Response:")
        print(json.dumps(raw_data, indent=4))  # ターミナルに整形して出力
        save_raw_response_to_file(raw_data, end_time, args.output_prefix)
    else:
        print("Failed to retrieve logs.")
