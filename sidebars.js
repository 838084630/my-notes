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
      label: 'AWS',
      items: [
        {
          type: 'doc',
          id: 'notes/aws/saa-notes',
          label: 'AWS SAA ノート',
        },
        {
          type: 'doc',
          id: 'notes/aws/site-build-notes',
          label: 'このサイトの構築手順',
        },
      ],
    },
  ],
};

module.exports = sidebars;
