import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'bird-sql',
  description: 'sql query Builder for bun',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/getting-started' },
    ],

    sidebar: [
      {
        items: [
          { text: 'Getting started', link: '/docs/getting-started' },
          { text: 'Select', link: '/docs/select' },
          { text: 'Where', link: '/docs/where' },
          { text: 'Insert', link: '/docs/insert' },
          { text: 'Update', link: '/docs/update' },
          { text: 'Delete', link: '/docs/delete' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/malik-shr/bird-sql' },
    ],
  },
});
