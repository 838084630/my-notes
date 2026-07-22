import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="ホーム"
      description="自己紹介・職務経歴・学習ノートのポートフォリオ">
      <main>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1 className={styles.title}>ポートフォリオ</h1>
            <p className={styles.subtitle}>自己紹介、職務経歴、学習ノートをまとめたサイトです</p>
            <div className={styles.buttons}>
              <Link className={styles.button} to="/docs/introduction">
                自己紹介を見る →
              </Link>
            </div>
          </div>

          <div className={styles.features}>
            <Link className={styles.feature} to="/docs/introduction">
              <h3>自己紹介</h3>
              <p>あなたの強み、背景、やりたいことを整理して伝えます</p>
            </Link>
            <Link className={styles.feature} to="/docs/resume">
              <h3>職務経歴</h3>
              <p>実務経験、担当業務、成果を職場向けに分かりやすくまとめます</p>
            </Link>
            <Link className={styles.feature} to="/docs/notes">
              <h3>ノート</h3>
              <p>技術・学習内容を継続的に残し、面接や説明資料として活用できます</p>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
