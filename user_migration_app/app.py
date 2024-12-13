import os
import psycopg2
import random
import time
import threading
import logging

# ログ設定
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - [Thread-%(threadName)s] %(message)s')

# スレッド停止用イベント
stop_event = threading.Event()


def generate_database_url():
    """
    環境変数からDATABASE_URLを動的に生成します。
    """
    db_user = os.environ.get("PGUSER")
    db_password = os.environ.get("PGPASSWORD")
    db_host = os.environ.get("PGHOST", "localhost")  # デフォルトはlocalhost
    db_port = os.environ.get("PGPORT", "5432")       # デフォルトポート5432
    db_name = os.environ.get("PGDATABASE")

    # 必須環境変数が設定されているか確認
    if not all([db_user, db_password, db_host, db_port, db_name]):
        raise ValueError("Missing required database environment variables")

    # DATABASE_URLを生成
    #logging.info("DATABASE_URL を生成しました")
    return f"postgres://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"


def worker(conn_str, workload, stop_event, thread_id, load_times):
    """
    データベースにトランザクション負荷をかけるワーカースレッド。

    Args:
        conn_str: データベース接続文字列。
        workload: 負荷の度合い (1秒あたりのトランザクション数)。
        stop_event: スレッド停止用のイベントオブジェクト。
        thread_id: スレッド識別用のID。
        load_times: トランザクションの繰り返し回数。
    """
    #logging.debug(f"スレッド {thread_id} を開始します")
    
    try:
        conn = psycopg2.connect(conn_str)
        #logging.info(f"スレッド {thread_id}: DB接続成功: {conn_str}")
    except Exception as e:
        logging.error(f"スレッド {thread_id}: DB接続失敗: {e}. 接続文字列: {conn_str}", exc_info=True)
        return

    conn.autocommit = False  # トランザクションを手動でコミット
    cursor = conn.cursor()

    for iteration in range(load_times):
        if stop_event.is_set():
            #logging.info(f"スレッド {thread_id}: 停止イベントを検出しました")
            break

        start_time = time.time()
        try:
            # WORKLOAD=0 の場合は処理をスキップ
            if workload == 0:
                #logging.info(f"スレッド {thread_id}: WORKLOAD が 0 のため、トランザクション処理をスキップします")
                continue

            # WORKLOAD に応じたトランザクション処理を実行
            for _ in range(workload):
                # テーブルロック
                #logging.debug(f"スレッド {thread_id}: テーブルロックを試みています: users")
                cursor.execute("LOCK TABLE users IN EXCLUSIVE MODE")
                #logging.info(f"スレッド {thread_id}: テーブルロックが成功しました: users")

                # ランダムなユーザー名を生成
                username = ''.join(random.choice('abcdefghijklmnopqrstuvwxyz') for _ in range(10))
                password = ''.join(random.choice('abcdefghijklmnopqrstuvwxyz0123456789') for _ in range(20))

                # usersテーブルに挿入
                #logging.debug(f"スレッド {thread_id}: データを挿入します: username={username}, password={password}")
                cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
                #logging.info(f"スレッド {thread_id}: データを挿入しました: username={username}, password={password}")

                # 挿入したユーザーを検索
                #logging.debug(f"スレッド {thread_id}: データを検索します: username={username}")
                cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
                inserted_id = cursor.fetchone()[0]
                #logging.info(f"スレッド {thread_id}: 検索結果: id={inserted_id}")

                # 挿入したユーザーを削除
                #logging.debug(f"スレッド {thread_id}: データを削除します: id={inserted_id}")
                cursor.execute("DELETE FROM users WHERE id = %s", (inserted_id,))
                #logging.info(f"スレッド {thread_id}: データを削除しました: id={inserted_id}")

            conn.commit()  # ロック解除もコミットで行われる
            #logging.info(f"スレッド {thread_id}: トランザクションをコミットしました")


        except psycopg2.Error as db_error:
            logging.error(f"スレッド {thread_id}: データベースエラーが発生しました: {db_error}", exc_info=True)
            conn.rollback()
            #logging.info(f"スレッド {thread_id}: トランザクションをロールバックしました")
        except Exception as general_error:
            logging.error(f"スレッド {thread_id}: 未知のエラーが発生しました: {general_error}", exc_info=True)
            conn.rollback()
            #logging.info(f"スレッド {thread_id}: トランザクションをロールバックしました")

        elapsed_time = time.time() - start_time
        sleep_time = max(0, 1 - elapsed_time)
        time.sleep(sleep_time)

    #logging.info(f"スレッド {thread_id}: 所定の回数 {load_times} 回繰り返したため、終了します")


if __name__ == "__main__":
    # 環境変数からスレッド数、負荷の度合い、繰り返し回数を取得
    threads_count = int(os.environ.get("THREADS", 1))  # デフォルト値は1
    workload = int(os.environ.get("WORKLOAD", 1))      # デフォルト値は1
    load_times = int(os.environ.get("LOADTIMES", 1))   # デフォルト値は1

    logging.info(f"設定値: THREADS={threads_count}, WORKLOAD={workload}, LOADTIMES={load_times}")

    # 環境変数からデータベースURLを生成
    try:
        database_url = generate_database_url()
        #logging.info(f"Generated DATABASE_URL: {database_url}")
    except ValueError as e:
        logging.error(f"Error: {e}")
        exit(1)

    threads = []
    try:
        for i in range(threads_count):
            thread = threading.Thread(
                target=worker,
                args=(database_url, workload, stop_event, i + 1, load_times),
                name=f"Worker-{i + 1}"
            )
            threads.append(thread)
            thread.start()
            #logging.info(f"スレッド {i + 1} を開始しました")

        # メインスレッドでスレッドの終了を待機
        for thread in threads:
            thread.join()
    except KeyboardInterrupt:
        #logging.info("負荷テストを終了します...")
        stop_event.set()  # 全スレッドに終了指示を送る
        for thread in threads:
            thread.join()

    logging.info(f"負荷テストを終了します...")

    # 意図的な無限ループ
    while True:
        time.sleep(9999)