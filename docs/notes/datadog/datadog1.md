---
title: EKS での Datadog 活用
sidebar_label: Datadog 実践
---

# EKS で Datadog を活用する

## 1. 全体構成

プロジェクトでは **Datadog Agent + Kubernetes Autodiscovery (AD)** を用いて監視データを収集します。

```
                Datadog
                    ▲
                    │
      Metrics / Logs / Traces
                    ▲
                    │
         Datadog Agent (DaemonSet)
                    ▲
                    │
         Kubernetes Pod（Annotation）
                    ▲
                    │
              Deployment
```

Datadog Agent 部署在 EKS 中，每个 Node 都会运行一个 Agent。

Agent 会：

- 收集 Kubernetes Metrics
- 收集容器 Logs
- 收集 APM Trace（如果开启）
- 根据 Pod Annotation 自动发现需要监控的服务

---

## 2. Datadog Agent の設定

プロジェクトでは通常、次の設定を有効にします。

```yaml
datadog:
  logs:
    enabled: true
    containerCollectAll: false
```

意味は次のとおりです。

- `logs.enabled=true`
  - ログ収集を有効にします。

- `containerCollectAll=false`
  - デフォルトでは**コンテナログを一切収集しません**
  - **Annotation を設定した Pod のログだけが収集されます**

この方式は次のように呼ばれます。

> **Opt-in（ホワイトリスト方式）**

ではなく、

> **Collect All（全収集）**

---

## 3. なぜ Collect All を使わないのか

主な理由は次の4点です。

### 1. Datadog コストを抑える

Datadog Logs 按日志量收费。

如果开启：

```yaml
containerCollectAll: true
```

那么：

- CoreDNS
- ArgoCD
- metrics-server
- ingress-nginx
- cert-manager
- Sidecar
- InitContainer
- 所有业务服务

都会上传日志。

每天可能产生几十 GB 甚至几百 GB 日志。

因此很多公司都会关闭 Collect All。

---

### 2. 業務サービスだけを収集する

例如：

```
order-service
payment-service
user-service
```

需要日志。

但是：

```
CoreDNS
metrics-server
aws-node
kube-proxy
```

通常不用采集。

这样可以节省大量费用。

---

### 3. 各サービスごとに独自の Service Name を付けられる

例如：

order-service

```yaml
service: order-service
```

payment-service

```yaml
service: payment-service
```

Datadog 中可以直接查询：

```
service:order-service
```

或者

```
service:payment-service
```

十分方便。

---

### 4. 各サービスごとに異なるログ解析ルールを設定できる

例如：

Java

```yaml
source: java
```

Nginx

```yaml
source: nginx
```

Python

```yaml
source: python
```

Datadog 会自动套用对应 Parser。

---

## 4. Pod Annotation

プロジェクトの Deployment には、通常次のような設定を追加します。

```yaml
template:
  metadata:
    annotations:
```

例如：

```yaml
template:
  metadata:
    annotations:
      ad.datadoghq.com/application.logs: |
        [{
          "source":"java",
          "service":"order-service"
        }]

      ad.datadoghq.com/tags: |
        {
          "env":"prod",
          "team":"platform"
        }
```

Deployment 创建出来的所有 Pod 都会继承这些 Annotation。

---

## 5. ad.datadoghq.com/<container>.logs

例如：

```yaml
ad.datadoghq.com/application.logs
```

这里最容易搞错。

### application は固定名ではない

これは次に対応する必要があります。

```
spec:
  containers:
```

中的 container 名称。

例如：

```yaml
containers:
- name: application
```

那么：

```yaml
ad.datadoghq.com/application.logs
```

就是正确的。

如果：

```yaml
containers:
- name: api
```

那么必须写：

```yaml
ad.datadoghq.com/api.logs
```

否则 Datadog Agent 不会识别。

---

### logs 設定の説明

例如：

```yaml
ad.datadoghq.com/application.logs: |
  [{
    "source":"java",
    "service":"order-service"
  }]
```

表示：

### source

日志类型。

例如：

```
java
nginx
python
go
```

Datadog 会自动应用对应 Parser。

---

### service

业务服务名称。

例如：

```
order-service
```

之后在 Datadog 可以查询：

```
service:order-service
```

APM、Logs、Dashboard 都会使用这个名字。

---

## 6. ad.datadoghq.com/tags

例如：

```yaml
ad.datadoghq.com/tags: |
  {
    "env":"prod",
    "team":"platform",
    "project":"payment"
  }
```

作用：

给当前 Pod 上报的数据统一增加 Tag。

包括：

- Logs
- Metrics
- Traces

都会带：

```
env:prod

team:platform

project:payment
```

以后查询非常方便。

例如：

```
env:prod

team:platform
```

Dashboard、Monitor、Logs 都可以直接筛选。

---

## 7. ログ収集の流れ

```
Deployment
      │
      ▼
Pod（带 Annotation）
      │
      ▼
stdout / stderr
      │
      ▼
Datadog Agent
      │
      ▼
Datadog Logs
```

Agent 会：

1. 发现 Pod
2. 检查 Annotation
3. 判断是否需要采集
4. 给日志添加 source、service、tags
5. 上传 Datadog

---

## 8. 現在の監視方式のまとめ

現在のプロジェクトでは、次の方式を採用しています。

EKS

↓

Datadog Agent（DaemonSet）

↓

Kubernetes Autodiscovery

↓

Pod Annotation 控制日志采集

↓

Logs 上传 Datadog

↓

使用 Service + Tags 分类管理日志

整体特点：

- 默认不采集所有日志
- 通过 Annotation 精确控制采集范围
- 节省 Datadog 日志费用
- 每个微服务拥有独立 Service
- 支持统一 Tags
- 方便 Dashboard、Monitor、APM、Logs 查询

---

## 9. 主要設定の一覧

### ログを有効にする

```yaml
logs:
  enabled: true
```

---

### 全てのコンテナを収集しない

```yaml
containerCollectAll: false
```

---

### Java サービスログを有効にする

```yaml
ad.datadoghq.com/application.logs: |
  [{
    "source":"java",
    "service":"order-service"
  }]
```

---

### 共通タグを追加する

```yaml
ad.datadoghq.com/tags: |
  {
    "env":"prod",
    "team":"platform"
  }
```

---

## 10. 重要なポイント（面接・業務での要点）

- Datadog Agent 通常以 DaemonSet 部署到 EKS。
- `containerCollectAll=false` 表示默认不采集容器日志，需要通过 Annotation 显式开启。
- `ad.datadoghq.com/<container>.logs` 用于配置日志采集规则，其中 `<container>` 必须与 Pod 中的容器名称一致。
- `source` 用于指定日志类型，Datadog 会自动选择对应的日志解析器。
- `service` 用于标识业务服务，是 Logs、APM、Dashboard 等功能关联的核心字段。
- `ad.datadoghq.com/tags` 用于给 Metrics、Logs、Traces 添加统一标签，便于筛选、聚合和告警。
- 使用 Annotation 的白名单采集模式可以有效控制日志成本，并支持不同服务使用不同的日志配置。