---
description: >-
  Arrays são listas de um único tipo de dado e as utilidades e aplicações são
  praticamente infinitas.
---

# 8. Arrays (Listas)

## Criando Arrays

Usamos os sinais de colchetes como em outras linguagens porém precisamos especificar o tipo desse array primeiro, e depois o seu nome.

![](<../.gitbook/assets/image (92).png>)

lista chamada _**saldos**_ do tipo _**uint**_ (números inteiros positivos).

## Adicionando itens à lista.

Para adicionar um registro usamos o comando _push(valor\_a\_ser\_adicionado)_ e para atualizar acessamos o indice (posição da lista) em que esse vaor está armazenado. Assim como tudo na computação, listas _começam com indice 0_ então o primeiro valor estará armazenado na posição 0 e o segundo na posição 2 e assim segue.

![](<../.gitbook/assets/image (51).png>)

## Acessando itens.

Para acessar os dados que estão guardados nessa lista usamos seu nome e a posição do item dentro de colchetes.

![](<../.gitbook/assets/image (59).png>)

## Deletando itens.

Muito semelhante à outras linguagens para deletar um item é usado a palavra _**delete**_ e a posição da lista que será apagada.

![](<../.gitbook/assets/image (8).png>)

## Arrays multidimencionais

Parecido com tabelas ou outras estruturas multidi-mencionais como tensores, também é possível construir "listas de listas" em solidity.

![](<../.gitbook/assets/image (84).png>)

Nesse caso temos uma lista que contém outras listas de shitcoins.

Para acessar um valor guardado em uma lista de listas precisamos encontra-lo pelos indices da seguinte forma: _**nomedalista\[primeiro\_indice]\[segundo\_indice].**_
