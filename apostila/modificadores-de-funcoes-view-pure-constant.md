---
description: >-
  Usando funções podemos guardar novos dados na blockchain, ler dados guardados
  na blockchain ou modifica-los. Cada tipo de função irá exigir um tipo de
  chamada diferente e consequentemente um custo diferente.
---

# 4. Parâmetros de estado (view, pure)

## Por padrão.

Se nenhuma _palavra-chave_ de definição de estado for passada essa função terá todos os acessos, poderá retornar dados, gravar novos dados ou alterar dados existentes.

![](<../.gitbook/assets/image (52).png>)

Essa função será executada no modo _**transaction**_ pelo minerador então mesmo que somente faça leitura de dados irá custar taxa de mineração.

## View

O parâmetro _**view**_ é usado para funções que não alteram dados nem o estado do contrato na blockchain. Tudo permenece igual e será somete _**ler**_ os dados_**.**_

![](<../.gitbook/assets/image (14).png>)

Essa função é executada pelo minerador no modo _**call**_ o que implica em **não ter custos de transação**.

## Pure

É um dos parâmetros mais restritivos pois não poderá alterar dados ou o estado do contrato nem mesmo ler dados de variáveis.

![](<../.gitbook/assets/image (109).png>)

É bastante usado para realizar cálculos que dependem da entrada de parâmetros na função e também é executada no modo _**call**_ tornando assim sua execução sem custo de gas_**.**_

