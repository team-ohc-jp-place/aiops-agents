# Automation Controller Job Template Runner

このスクリプトは、Ansible Automation Controller（旧 Ansible Tower）のジョブテンプレートを**名前で指定して実行**するためのPythonプログラムです。

## Job Template Name
* `restart_petstore_webapp`: PetstoreのWebappを再起動する
* `restart_petstore_postgresql`: PetstoreのPostgreSQLを再起動する

## 機能
- ジョブテンプレートの**名前**からIDを取得
- ジョブテンプレートを実行
- 実行結果を表示

## 必要条件

1. **Python 3.x** がインストールされていること
2. 必要なPythonパッケージをインストールする（後述）
3. Automation Controller（またはAnsible Tower）のAPIにアクセス可能な環境

## インストール

1. **スクリプトをクローンまたはコピー**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **仮想環境の作成（推奨）**

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # Windowsの場合は venv\Scripts\activate
    ```

3. **必要なパッケージのインストール**

    ```bash
    pip install requests
    ```

## 使用方法

以下のコマンドでスクリプトを実行します。

```bash
python launch_job_template.py <CONTROLLER_URL> <USERNAME> <PASSWORD> <JOB_TEMPLATE_NAME>
```

1. **引数の説明**

* `CONTROLLER_URL`: Automation ControllerのURL（例: https://your-controller.example.com）
* `USERNAME`: Automation Controllerにログインするユーザー名
* `PASSWORD`: 上記ユーザーのパスワード
* `JOB_TEMPLATE_NAME`: 実行するジョブテンプレートの名前

2. **実行例**

```bash
python launch_job_template.py \
    https://ansible-aap.apps.cluster-jjtnm.jjtnm.sandbox1352.opentlc.com \
    admin \
    redhat \
    restart_petstore_webapp
```

---

## 結果の表示

### 成功時

スクリプトは次のような出力を表示します：

```plaintext
Job Template launched successfully.
Job launched with response:
{'job': 13, 'id': 13, 'status': 'pending', ...}
```

### 失敗時

ジョブテンプレートが見つからない場合やエラーが発生した場合、エラーメッセージが表示されます。

例:
```plaintext
No Job Template found with name: restart_petstore_webapp
```

## 追加設定

### Extra Variables

ジョブテンプレートに渡す追加変数を指定する場合、スクリプト内の以下の部分を編集してください。

```python
extra_vars = {
    "variable_name": "value"
}
```

## 注意点

1. **SSL警告の抑制**

   スクリプトではSSL証明書の検証を無効化しています（`verify=False`）。本番環境では適切なSSL証明書を設定し、`verify=True` に変更することを推奨します。

   ```python
   verify=True  # 本番環境では必須
   ```