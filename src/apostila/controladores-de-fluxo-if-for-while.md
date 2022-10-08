---
title: 9. Controladores de Fluxo (if, for, while)
---
::: tip
  A parte mais importante de toda programação é a lógica de como um script é
  programado e controladores de fluxo são os tijolos dessa construção.
:::

## If & else

Usado para criar condições que devem ser atendidas para que um determinado trecho de código seja executado. Já o _**else é uma condição**_ que será executado _**caso a primeira não seja**_.

![](<../assets/image(17).png>)

## Loop for

Quando precisamos fazer interações por vários itens dentro de um array ou mapping, ou então executar algo por um número definido de vezes podemos usar loops for.

![](<../assets/image(61).png>)

_o valor de_ ** **_**i começa em zero**_ e _****_ irá _**acrescentando 1**_ até chegar no valor armazenado em _**listaDeEnderecos.length**_ que é reponsável por retornar o tamanho da lista. De 1 em 1 o loop irá executar o trecho de código para cada endereço guardado na _**listaDeEnderecos.**_

## loop While

Se precisarmos repetir um trecho de código por um número indefinido de vezes ou até que uma condição seja atingida usamos loops while.

![Obs: isso pode gastar muito gás então use com muita atenção.](<../assets/image(29).png>)

O loope While irá ficar rodando até que as condições pra ele parar sejam alcançadas e essa condição pode ser construída com _**if**_ seguido de um _**break**_ que é o código irá parar. Há outra instrução nesse código que é o _**continue**_, responsável por fazer o loop "pular" para o inicio ao invés de ser executado até o final e só então recomeçar.
