/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  introductionSidebar: [
    {
      type: 'doc',
      id: 'introduction',
      label: '自己紹介',
    },
  ],

  resumeSidebar: [
    {
      type: 'category',
      label: '職務経歴',
      link: {
        type: 'doc',
        id: 'resume',
      },
      items: [
        {
          type: 'doc',
          id: 'resume/overview',
          label: '経歴概要',
        },
        {
          type: 'doc',
          id: 'resume/current',
          label: '2023年 - 現在',
        },
        {
          type: 'doc',
          id: 'resume/past',
          label: '2021年 - 2023年',
        },
      ],
    },
  ],

  notesSidebar: [
    {
      type: 'doc',
      id: 'notes',
      label: 'ノート一覧',
    },
    {
      type: 'category',
      label: 'Kafka',
      items: [
        {
          type: 'doc',
          id: 'notes/kafka/overview',
          label: '概要',
        },
        {
          type: 'doc',
          id: 'notes/kafka/consumer',
          label: 'Consumerの概念',
        },
        {
          type: 'doc',
          id: 'notes/kafka/installation',
          label: 'Kafkaのインストール',
        },
      ],
    },
    {
      type: 'category',
      label: 'AWS',
      items: [
        {
          type: 'doc',
          id: 'notes/aws/saa-notes',
          label: 'AWS SAA ノート',
        },
      ],
    },
    {
      type: 'category',
      label: 'Java',
      items: [
        {
          type: 'doc',
          id: 'notes/java/overview',
          label: '概要',
        },
        {
          type: 'doc',
          id: 'notes/java/collections',
          label: 'コレクションの基礎',
        },
      ],
    },
    {
      type: 'category',
      label: 'Datadog',
      items: [
        {
          type: 'doc',
          id: 'notes/datadog/overview',
          label: '概要',
        },
        {
          type: 'doc',
          id: 'notes/datadog/metrics',
          label: 'メトリクス基礎',
        },
      ],
    },
    {
      type: 'category',
      label: 'Terraform',
      items: [
        {
          type: 'doc',
          id: 'notes/terraform/overview',
          label: '概要',
        },
        {
          type: 'doc',
          id: 'notes/terraform/resources',
          label: 'リソース構築',
        },
      ],
    },
  ],
};

module.exports = sidebars;
