import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="ホーム"
      description="個人的なノートとドキュメント">
      <main>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1 className={styles.title}>マイノート</h1>
            <p className={styles.subtitle}>個人的なノート＆ドキュメント</p>
            <div className={styles.buttons}>
              <Link
                className={styles.button}
                to="/docs">
                読み始める →
              </Link>
            </div>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>AWS</h3>
              <p>クラウドコンピューティングのノートとチュートリアル</p>
            </div>
            <div className={styles.feature}>
              <h3>Kafka</h3>
              <p>メッセージストリーミングプラットフォームのドキュメント</p>
            </div>
            <div className={styles.feature}>
              <h3>Flink</h3>
              <p>ストリーム処理フレームワークガイド</p>
            </div>
            <div className={styles.feature}>
              <h3>Kubenetes</h3>
              <p>ストリーム処理フレームワークガイド</p>
            </div>
            <div className={styles.feature}>
              <h3>Terraform</h3>
              <p>インフラストラクチャをコードで管理するためのツール</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
