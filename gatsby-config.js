module.exports = {
  siteMetadata: {
    title: `Paweł Pukszta's personal site`,
    name: `Paweł Pukszta`,
    siteUrl: `https://novela.narative.co`,
    description: `Paweł Pukszta's personal site. Resume, blog posts, tech product marketing stuff, maybe some tech-y stuff too.`,
    hero: {
      heading: `Hi. I'm Paweł. My handle is usually pawelpukszta. This is my site.`,
      maxWidth: 652,
    },
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/pucieq`,
      },
      {
        name: `github`,
        url: `https://github.com/pawelpukszta`,
      },
      {
        name: `linkedin`,
        url: `https://https://www.linkedin.com/in/pawel-pukszta/`,
      },
    ],
  },
  plugins: [
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: true,
        sources: {
          local: true,
          // contentful: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Novela by Narative`,
        short_name: `Novela`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
      },
    },
  ],
};
