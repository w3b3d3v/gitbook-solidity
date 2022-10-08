---
title: 1. Estrutura de Contratos Inteligentes
---
::: tip
  Smart contract são conjuntos de regras matemática definidas previamente. Essas
  regras podem estar condicionadas à contextos, ex: só executar se for dia X do
  ano ou só executar à cada 3 dias etc...
:::

São realmente infinitas as possibilidades do que se pode fazer com eles mas seu funcionamento se resume em:

![basic structure of smart contract](<../assets/image(108).png>)

### Definindo a versão da linguagem

O comando pragma é usado para definir qual será a versão da linguagem solidity que será usada nesse contrato.

![](<../assets/image(114).png>)

repare no parâmetro .8 entre o .0 e .11 ele indica que é a versão principal, isso quer dizer que um compilador executando a versão 0.8.12 também funcionará, assim como 0.8.12 ou 13.

### Importação de bibliotecas e código pronto

![](<../assets/image(24).png>)

No mundo do desenvolvimento estamos sempre reaproveitando códigos prontos e já testados e você deve se habituar à isso. Mas fique atento pois cada linguagem tem seu padrão de como importar outros códigos.

Pra uma explicação mais detalhada sobre como fazer importações e reutilização de contratos veja o a sessão [21.-bibliotecas-librarys.md](extra-avancado/21.-bibliotecas-librarys.md "mention")

### Código do contrato

![](<../assets/image(47).png>)

dentro _contract_ é onde ficam todas as regras e condições do contrato.
