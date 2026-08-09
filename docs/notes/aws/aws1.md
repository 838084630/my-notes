# Docusaurus を AWS (S3 + CloudFront + OAC) にデプロイする手順

> 対象環境
> - Windows
> - Docker Desktop
> - Git
> - GitHub
> - 独自ドメイン取得済み
> - AWS (S3 + CloudFront + OAC)

---

# 全体構成

```text
                ローカル開発

        Windows + Docker Desktop
                 │
                 │ npm run build
                 ▼
        Docusaurus 静的ファイル(build)
                 │
                 │ git push
                 ▼
             GitHub Repository
                 │
      GitHub Actions(CI/CD)
                 │
                 ▼
            Amazon S3 Bucket
        (静的サイトホスティング用)
                 ▲
                 │
          OACでのみアクセス許可
                 │
        Amazon CloudFront
                 │
         ACM SSL証明書
                 │
        Route53(DNS)
                 │
                 ▼
      https://rinrintech.com
```

---

# Step1 Docusaurus をローカルで作成

## Docker 起動（PowerShell）

```powershell
docker run -it ^
-v ${PWD}:/workspace ^
-w /workspace ^
node:22 bash
```

Docker コンテナ内

```bash
npx create-docusaurus@latest my-notes classic
cd my-notes
npm start -- --host 0.0.0.0
exit
```

静的サイト生成

```bash
npm run build
```

---

# Step2 GitHub Repository 作成

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/<ユーザー名>/my-notes.git
git push -u origin main
```

---

# Step3 build フォルダを Windows にコピー

```powershell
docker ps
docker cp <ContainerID>:/workspace/my-notes/build C:\Users\shi-l\Desktop\build\
```

---

# Step4 S3 Bucket 作成

- Region：Asia Pacific (Tokyo) / ap-northeast-1
- Block Public Access：**デフォルトのまま（変更しない）**

---

# Step5 build ファイルをアップロード

S3 Bucket の Upload から **build フォルダ内のファイルのみ** をアップロードする。

✅ 正しい

```text
index.html
assets/
img/
```

❌ 誤り

```text
build/
  index.html
```

---

# Step6 CloudFront 作成

- Create Distribution
- Origin Domain：S3 Bucket を選択
- Origin Access：**Create new OAC**
- Signing behavior：**Sign requests**

---

# Step7 Default Root Object

```
index.html
```

---

# Step8 Bucket Policy

CloudFront の Origin → Edit → **Copy policy**

S3 → Permissions → Bucket Policy に貼り付ける。

---

# Step9 デプロイ待ち

CloudFront の Status が

```
Deploying
```

↓

```
Enabled
```

になるまで待つ。

---

# Step10 CloudFront 動作確認

```
https://xxxxxxxx.cloudfront.net
```

---

# Step11 ACM 証明書

- Request certificate
- Public certificate
- ドメイン
  - rinrintech.com
  - www.rinrintech.com
- DNS Validation

---

# Step12 CloudFront に独自ドメイン設定

Alternate Domain Names

```
rinrintech.com
www.rinrintech.com
```

ACM 証明書を選択。

---

# Step13 GitHub Actions 自動デプロイ

GitHub

```
Settings
↓
Secrets and variables
↓
Actions
```

登録する Secret 例

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
```

Workflow

```
.github/workflows/deploy.yml
```

CI/CD フロー

```text
git push
   │
   ▼
GitHub Actions
   │
npm install
   │
npm run build
   │
aws s3 sync
   │
CloudFront Invalidation
   │
Website Update
```

---

# 最終アーキテクチャ

```text
Windows + Docker
      │
      ▼
Docusaurus
      │
      ▼
GitHub
      │
      ▼
GitHub Actions
      │
      ▼
Amazon S3
      ▲
      │ OAC
      ▼
CloudFront
      │
 ACM
      │
Route53
      │
      ▼
https://rinrintech.com
```