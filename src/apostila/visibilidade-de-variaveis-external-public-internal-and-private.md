---
title: 6. Visibilidade de Variáveis (public, internal & private)
---
::: tip
  Muito semelhantes às funções com exceção de "External" que se aplicam somente a funções.
:::

## Public

Variável sem nenhuma restrição de visibilidade.

![](<../assets/image(36).png>)

## Internal

Acessível para funções dentro do contrato e também para contratos derivados do qual contém essa variável.

![](<../assets/image(9).png>)

## Private

Dados guardados nesse tipo de variável estão acessíveis somente para o contrato em qual ela foi escrita.

![](<../assets/image(72).png>)

Observação importante: Blockchains são públicas então não guarde senhas ou coisas importantes dentro de variáveis pois mineradores e pesquisadores com o conhecimento certo conseguem montar Bytecodes e ver dados em variáveis e funções _**privadas**_.
