import os
import requests
import json
import logging
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv  # .envの利用
import urllib3

# .envファイルを読み込む
load_dotenv()

# SSL警告を無視（必要に応じて削除）
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# ログ設定
#logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


def load_queries(file_path: str) -> dict:
    """
    外部JSONファイルからQueryデータをロードする関数

    Args:
        file_path (str): JSONファイルのパス

    Returns:
        dict: Queryデータを格納した辞書
    """
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def collect_metrics(prometheus_api: str, token: str, queries: dict) -> dict:
    """
    Prometheus APIを使用してメトリクスデータを収集する関数

    Args:
        prometheus_api (str): Prometheus APIのエンドポイント
        token (str): 認証用のBearerトークン
        queries (dict): Prometheusクエリデータ

    Returns:
        dict: メトリクスデータ
    """
    now = datetime.now(timezone.utc)
    start_time = now - timedelta(minutes=1)
    start_time_str = start_time.strftime('%Y-%m-%dT%H:%M:%SZ')
    end_time_str = now.strftime('%Y-%m-%dT%H:%M:%SZ')
    step = "15s"

    metrics_data = {}

    headers = {
        "Authorization": f"Bearer {token}"
    }

    for metric_type, components in queries.items():
        for component, query in components.items():
            try:
                #logging.debug(f"Querying {component} for {metric_type}: {query}")
                response = requests.get(
                    f"https://{prometheus_api}/api/v1/query_range",
                    headers=headers,
                    params={
                        "query": query,
                        "start": start_time_str,
                        "end": end_time_str,
                        "step": step
                    },
                    verify=False
                )
                response.raise_for_status()
                data = response.json()

                if "data" in data and "result" in data["data"] and data["data"]["result"]:
                    latest_value = data["data"]["result"][0]["values"][-1][1]
                    metrics_data.setdefault(component, {})[metric_type] = f"{float(latest_value) * 100:.2f}%"

            except requests.exceptions.RequestException as e:
                logging.error(f"Error fetching {metric_type} data for {component}: {e}")
                metrics_data.setdefault(component, {})[metric_type] = "N/A"

    return metrics_data


def collect_logs(loki_api: str, token: str, pod_patterns: dict) -> dict:
    """
    Loki APIを使用してログデータを収集する関数
    """
    now = datetime.now(timezone.utc)
    start_time = now - timedelta(minutes=5)  # 5分前からのログを取得
    start_time_str = start_time.strftime('%Y-%m-%dT%H:%M:%SZ')
    end_time_str = now.strftime('%Y-%m-%dT%H:%M:%SZ')

    headers = {
        "Authorization": f"Bearer {token}"
    }

    logs_data = {}

    for component, pod_pattern in pod_patterns.items():
        try:
            query = f'{{kubernetes_container_name="{pod_pattern}", kubernetes_namespace_name="petstore"}}'
            response = requests.get(
                f"https://{loki_api}/api/logs/v1/application/loki/api/v1/query_range",
                headers=headers,
                params={
                    "query": query,
                    "start": start_time_str,
                    "end": end_time_str,
                    "step": "5s",
                },
                verify=False
            )
            response.raise_for_status()
            data = response.json()

            logs = []
            if "data" in data and "result" in data["data"]:
                for result in data["data"]["result"]:
                    for log_entry in result["values"]:
                        log_json = json.loads(log_entry[1])
                        timestamp_raw = log_json.get("@timestamp", "")
                        message = log_json.get("message", "").strip()

                        # 空メッセージをスキップ
                        if not message:
                            continue

                        # タイムスタンプをフォーマット
                        timestamp = datetime.fromisoformat(timestamp_raw.rstrip("Z")).strftime('%Y-%m-%d %H:%M:%S')
                        logs.append({"timestamp": timestamp, "message": message})

            logs_data[component] = logs

        except requests.exceptions.RequestException as e:
            logs_data[component] = []

    return logs_data

def monitor_system() -> str:
    """
    メトリクスとログを統合してシステムの監視データを生成する関数

    Returns:
        str: 監視データを含むJSON文字列
    """
    prometheus_api = os.environ.get("PROMETHEUS_API")
    loki_api = os.environ.get("LOKI_API")
    token = os.environ.get("OPENSHIFT_BEARER_TOKEN")
    queries_file = "monitor_system_api/queries.json"

    if not prometheus_api or not loki_api or not token:
        raise EnvironmentError("PROMETHEUS_API, LOKI_API, or OPENSHIFT_BEARER_TOKEN environment variable is missing")

    # Prometheusクエリのロード
    queries = load_queries(queries_file)

    # Pod名のパターン
    pod_patterns = {
        "application_server": "petstore-demo",
        "database": "postgresql",
        "user_migration_app": "user-migration-app"
    }

    # メトリクスとログの収集
    metrics_data = collect_metrics(prometheus_api, token, queries)
    logs_data = collect_logs(loki_api, token, pod_patterns)

    # メトリクスとログを統合
    system_data = {}
    for component in metrics_data:
        system_data[component] = {
            "cpu": metrics_data[component].get("cpu", "N/A"),
            "memory": metrics_data[component].get("memory", "N/A"),
            "logs": logs_data.get(component, [])  # 抽出されたログを使用
        }

    return json.dumps(system_data, ensure_ascii=False, indent=4)
