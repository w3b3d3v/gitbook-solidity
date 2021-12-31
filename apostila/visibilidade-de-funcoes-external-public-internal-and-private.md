---
description: >-
  As funções e/ou variáveis de um contrato podem estar sujeitas a quatro
  parâmetros de visibilidade.
---

# 5. Visibilidade de Funções (external, public, internal & private)

## External

Essa função estará acessivel somente de fora do contrato, ele próprio não conseguirá chama-la.

![](<../.gitbook/assets/image (39).png>)

## Internal

Funções com esse parâmetro estão acessíveis somente no próprio contrato que à contêm e contratos que forem "_**filhos**_" desse, ou seja contatos que herdam suas funções e variaveis. Para entender melhor sobre herança veja a sessão [24.-heranca.md](extra-avancado/24.-heranca.md "mention")

![](<../.gitbook/assets/image (102).png>)

## Public

Essa função estará acessível de todas as formas possíveis. No próprio contrato, externamente através de um programa ou API, em contratos herdados...

![](<../.gitbook/assets/image (38).png>)

## Private

Esse é o modo mais restritivo pois permite acesso somente dentro do próprio contrato.

![](<../.gitbook/assets/image (12).png>)

Observação importante: Blockchains são públicas então todos os dados podem ser acessíveis pelos Bytecodes.
