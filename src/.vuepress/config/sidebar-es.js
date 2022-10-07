module.exports = [
  "",
  {
    title: "Apostila Completa",
    path: "/apostila/",
    collapsable: false,
    children: ["/apostila/estrutura-de-contratos-inteligentes", "/apostila/tipos-de-variaveis"],
  },
  {
    title: "Exemplos",
    path: "/exemplos/",
    collapsable: false,
    children: ["introducao", "aplicacoes", "hacks", "linguagem-v0.8.3", "defi"],
  },
  {
    title: "EVM Máquina Virtual Ethereum",
    path: "/evm-maquina-virtual-ethereum/",
    collapsable: false,
    children: ["/pt/guides/voting-appchain"],
  },
  {
    title: "Segurança",
    path: "/pt/maintain/delegator-delegate",
    collapsable: false,
    children: ["/pt/maintain/delegator-delegate", "/pt/maintain/delegator-operations"],
  },
  {
    title: "Guia de Validadores",
    path: "/pt/maintain/validator-guide",
    collapsable: false,
    children: [
      "/pt/maintain/validator-generate-keys",
      "/pt/maintain/validator-deploy",
      "/pt/maintain/validator-register",
      "/pt/maintain/monitor-node",
    ],
  },
]
