module.exports = {
  title: "Guia Solidity",
  theme: "reco",
  plugins: [
    ["@dovyp/vuepress-plugin-clipboard-copy", true],
    [
      "@vuepress/google-analytics",
      {
        ga: "G-2FGEVX605M", // UA-00000000-0
      },
    ],
  ],

  base: process.env.BASE_PATH || "/",
  dest: "./dist",

  head: [
    // ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],

  locales: {
    "/": {
      lang: "pt-BR",
    },
    "/es/": {
      lang: "es",
    },
  },

  themeConfig: {
    // logo: "/logo-blue-w3d.png",
    // logoDark: "/logo-blue.png",
    lastUpdated: true,
    editLinks: false,
    sidebar: "auto",

    author: "WEB3DEV Team",
    repo: "https://github.com/w3b3d3v/gitbook-solidity.git",

    locales: {
      "/": {
        label: "Português",
        nav: [
          {
            text: "Site Oficial",
            link: "https://www.web3dev.com.br/",
            target: "_self",
            rel: "",
            icon: "reco-home",
          },
          {
            text: "Discord",
            link: "https://discord.web3dev.com.br/",
            target: "_blank",
            rel: "",
          },
          {
            text: "Manual da Comunidade",
            link: "https://docs.web3dev.com.br/",
            target: "_blank",
            rel: "",
          },
          {
            text: "Glossário",
            link: "https://glossario.web3dev.com.br/",
            target: "_blank",
            rel: "",
          },
          { text: "Índice", link: "/" },
        ],
        sidebar: require("./config/sidebar-pt"),
      },
      "/es/": {
        label: "Español",
        nav: [
          {
            text: "Site Oficial",
            link: "https://www.web3dev.com.br/",
            target: "_self",
            rel: "",
            icon: "reco-home",
          },
          {
            text: "Discord",
            link: "https://es.discord.w3d.community/",
            target: "_blank",
            rel: "",
          },
          { text: "Índice", link: "/es/", icon: "" },
        ],
        sidebar: require("./config/sidebar-es"),
      },
    },
  },
}
