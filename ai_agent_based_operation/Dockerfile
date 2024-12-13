# Python 3.11をベースにしたスリムイメージを使用
FROM python:3.11-slim

# 必要なシステムパッケージをインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# アプリケーションファイルをコピー
COPY . .

# 必要なPythonパッケージをインストール
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 権限を変更 (グループに対して読み書き権限を付与)
RUN chown -R 0 /app && chmod -R g+rwX /app && chmod g+s /app

# UMASK を設定
ENV UMASK 002

# ポート番号を設定
EXPOSE 8000

# 実行コマンド
#CMD ["python", "run.py"]
# コンテナを継続的に稼働させるために無限ループで待機
CMD ["tail", "-f", "/dev/null"]

