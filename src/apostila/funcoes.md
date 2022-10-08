---
title: 3. Funções
---
::: tip
  Funções são usadas para encapsular trechos de código para serem
  chamados/invocados sempre que necessário, evitando assim a necessidade de reescreve-los.
:::

### Algumas definições

* Possuem uma palavra chave de definição.
* Um nome para ser invocada.
* Podem receber parâmetros externos.
* Possuem um parâmetro de visibilidade.
* Possuem um identificador de estado.
* Podem receber modificadores.
* Podem ser pagáveis (receber eth/cripto).
* Podem ou não retornar dados.

## O corpo de uma função

![](<../assets/image(67).png>)

Essa estrutura pode variar, dependendo do contexto dessa função algumas _palavras-chave_ estarão implícitas por padrão da linguagem.

## Parâmetros

Funções podem receber parâmetros externos, veja a função abaixo.

![](<../assets/image(33).png>)

Por enquanto preste atenção somente nos parâmetros dentro dos parêntesis (uint a , uint b). Esse trecho de código indica que essa função recebe dois números, um está na variável 'a' e outro está na variável 'b'.

#### Sem parâmetros

Funções também podem funcionar sem parâmetros externos, como é o caso dessa função à baixo que somente retorna o número do bloco atual.

![](<../assets/image(82).png>)

## Visibilidade

Parâmetros de visibilidade definem como essa função poderá ser acessada.

![](<../assets/image(116).png>)

## Estados

Quando uma função é executa ela pode ou não alterar dados que estão guardados na blockchain. Para cada caso à uma palavra chave que define as permissões e possibilidades dessa função.

![](<../assets/image(71).png>)

![](<../assets/image(80).png>)

pure é bastante usado para fazer cálculos e retornar resultados.

## Modificadores

Há muitos casos de uso para modificadores mas um dos mais comuns é definir permissões e restrições no contrato para que somente o administrador possa fazer algumas coisas.

![](<../assets/image(115).png>)

Nesse caso temos uma função chamada _**somenteAdminAlteraIdade**_ que só poderá ser executada se o modificador _**somenteadm**_ retornar um valor **true**. Esse modificador verifica se o endereço que chamou o contrato é o endereço administrador, se sim irá retornar true e a função será executada.

## Funções pagáveis (Payable)

Algumas funções podem receber eth e outros tokens e para isso devem levar a palavra chave _payable._

![](<../assets/image(44).png>)

Funções com parâmetro de estado _view_ não podem ser pagáveis.

## Return e Returns

Para que uma função retorne algum dado é preciso especificar o tipo de dado que será retornado, isso é feito através do parâmetro _**returns**_ é diferente da palavra chave _**return**_ que é usada para retornar o dado efetivamente.

![](<../assets/image(22).png>)
