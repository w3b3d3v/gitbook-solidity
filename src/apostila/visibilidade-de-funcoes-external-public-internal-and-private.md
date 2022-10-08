---
title: 5. Visibilidade de Funções (external, public, internal & private)
---
::: tip
  As funções e/ou variáveis de um contrato podem estar sujeitas a quatro
  parâmetros de visibilidade.
:::

## External

Essa função estará acessivel somente de fora do contrato, ele próprio não conseguirá chamá-la.

![](<../assets/image(39).png>)

## Internal

Funções com esse parâmetro estão acessíveis somente no próprio contrato que a contêm e contratos que forem "_**filhos**_" desse, ou seja contatos que herdam suas funções e variáveis. Para entender melhor sobre herança veja a sessão [24.-heranca.md](extra-avancado/24.-heranca.md "mention")

![](<../assets/image(102).png>)

## Public

Essa função estará acessível de todas as formas possíveis. No próprio contrato, externamente através de um programa ou API, em contratos herdados...

![](<../assets/image(38).png>)

## Private

Esse é o modo mais restritivo pois permite acesso somente dentro do próprio contrato.

![](<../assets/image(12).png>)

Observação importante: Blockchains são públicas então todos os dados podem ser acessíveis pelos Bytecodes.
