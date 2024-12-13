# monitor_system()

## ローカルからの実行手順

### 1. 前提

* OpenShiftに、`OpenShift Logging Operator` と `Loki Operator` をインストールし、`Loki Stack` にログ転送する仕組みを構築する必要があります。

### 2. Python仮想環境のセットアップ(ローカルで実行する場合)

```
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install python-dotenv
pip install requests
```

### 3. 環境変数の設定

.env に環境変数を記述

以下のコマンドで取得

```
PROMETHEUS_API=$(oc get route prometheus-k8s -n openshift-monitoring -o jsonpath='{.spec.host}')
LOKI_API=$(oc get route logging-loki -n openshift-logging -o jsonpath='{.spec.host}')
OPENSHIFT_BEARER_TOKEN=$(oc whoami --show-token)
```

OpenShift上で実行する場合は、ConfigMapとSecretから取得

### 4. 実行

python3 app.py

* メトリクスは過去１分間の平均値から算出
* ログは過去５分間のログを抽出

他のPythonからコールする場合は、

* `monitor_system_api` フォルダをコピー
* `from monitor_system_api.monitor_system import monitor_system` をソースの冒頭に記述

詳細は `app.py` の中身を見てください


### 5. 出力例

```
{
    "application_server": {
        "cpu": "0.00%",
        "memory": "0.15%",
        "logs": [
            {
                "timestamp": "2024-11-28 12:56:07",
                "message": "12:56:06 PM [express] serving on port 5000"
            },
            {
                "timestamp": "2024-11-28 12:56:05",
                "message": "> NODE_ENV=production node dist/index.js"
            },
            {
                "timestamp": "2024-11-28 12:56:05",
                "message": "> rest-express@1.0.0 start"
            },
            {
                "timestamp": "2024-11-28 12:56:04",
                "message": "npm error You can rerun the command with `--loglevel=verbose` to see the logs in your terminal"
            },
            {
                "timestamp": "2024-11-28 12:56:04",
                "message": "npm error Log files were not written due to an error writing to the directory: /.npm/_logs"
            },
            {
                "timestamp": "2024-11-28 12:56:04",
                "message": "npm notice"
            },
            {
                "timestamp": "2024-11-28 12:56:04",
                "message": "npm notice To update run: npm install -g npm@10.9.1"
            },
            {
                "timestamp": "2024-11-28 12:56:04",
                "message": "npm notice Changelog: https://github.com/npm/cli/releases/tag/v10.9.1"
            },
            {
                "timestamp": "2024-11-28 12:56:04",
                "message": "npm notice New minor version of npm available! 10.8.2 -> 10.9.1"
            },
            {
                "timestamp": "2024-11-28 12:56:04",
                "message": "npm notice"
            },
            {
                "timestamp": "2024-11-28 12:56:04",
                "message": "npm error command sh -c NODE_ENV=production node dist/index.js"
            },
            {
                "timestamp": "2024-11-28 12:56:04",
                "message": "npm error signal SIGTERM"
            },
            {
                "timestamp": "2024-11-28 12:56:04",
                "message": "npm error command failed"
            },
            {
                "timestamp": "2024-11-28 12:56:04",
                "message": "npm error path /app"
            }
        ]
    },
    "database": {
        "cpu": "1.18%",
        "memory": "0.10%",
        "logs": [
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "2024-11-28 12:56:10 UTC [1]: [6] HINT:  Future log output will appear in directory \"log\"."
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "2024-11-28 12:56:10 UTC [1]: [5] LOG:  redirecting log output to logging collector process"
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "2024-11-28 12:56:10 UTC [1]: [4] LOG:  listening on Unix socket \"/tmp/.s.PGSQL.5432\""
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "2024-11-28 12:56:10 UTC [1]: [3] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\""
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "2024-11-28 12:56:10 UTC [1]: [2] LOG:  listening on IPv6 address \"::\", port 5432"
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "2024-11-28 12:56:10 UTC [1]: [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432"
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "Starting server..."
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "server stopped"
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "waiting for server to shut down.... done"
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "ALTER ROLE"
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "=> sourcing /usr/share/container-scripts/postgresql/start/set_passwords.sh ..."
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "/var/run/postgresql:5432 - accepting connections"
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "server started"
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "done"
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "2024-11-28 12:56:10 UTC [24]: [4] HINT:  Future log output will appear in directory \"log\"."
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "2024-11-28 12:56:10 UTC [24]: [3] LOG:  redirecting log output to logging collector process"
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "2024-11-28 12:56:10 UTC [24]: [2] LOG:  listening on Unix socket \"/tmp/.s.PGSQL.5432\""
            },
            {
                "timestamp": "2024-11-28 12:56:10",
                "message": "waiting for server to start....2024-11-28 12:56:10 UTC [24]: [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\""
            }
        ]
    },
    "user_migration_app": {
        "cpu": "0.00%",
        "memory": "8.99%",
        "logs": []
    }
}
```

