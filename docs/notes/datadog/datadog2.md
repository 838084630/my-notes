---
title: Datadog ダッシュボードの活用
sidebar_label: ダッシュボード活用
---

# ダッシュボードの活用

## マルチ環境で共通利用するダッシュボード

Filter を作成します。

1. 左上の Add Variable をクリックする
2. 例として `env` というタグを選ぶ
3. Data Source として `select all` などを選ぶ
4. 保存する
5. 各 Monitor の Metrics に `$env` のような条件を設定する
6. 画面上で指定した環境ごとに Monitor を表示できるようになる
