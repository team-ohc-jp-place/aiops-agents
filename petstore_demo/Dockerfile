# ベースイメージ: ビルド用ステージ
FROM node:18-alpine as builder

# 作業ディレクトリを設定
WORKDIR /app

# パッケージ情報をコピーし、依存関係をインストール
COPY package*.json tsconfig.json ./
RUN npm install --production=false

# アプリケーションコードをコピーしてビルド
COPY . .
RUN npm run build

# 本番環境用ステージ
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# 必要なファイルだけをコピー
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# 権限変更 (OpenShift 非rootユーザー対応)
RUN chown -R 1001:0 /app
USER 1001

# 必要なポートを公開
EXPOSE 5000

# サーバーを起動
CMD ["npm", "run", "start"]
