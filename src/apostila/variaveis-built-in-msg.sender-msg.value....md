---
title: 7. Variáveis built-in (msg.sender, msg.value...)
---

## block.chainid

Cada rede possui um número único de identificação e através da variável 'block.chainid' é possível identificar a rede atual.
A Ethereum mainnet, que é a principal, possui o id 1. Já a Rinkeby, uma de suas redes de teste, possui o id 3.

ID de outras redes EVM:
- Binance Smart Chain (BSC) => id 56
- Polygon Mainnet => id 137
- Fantom Opera => id 250

Você pode ver uma lista completa de Chain IDs em [https://chainlist.org/](https://chainlist.org).

![](<../assets/image(99).png>)

## block.coinbase

Quando for feito o deploy do contrato que estiver sendo escrito, um minerador irá incluí-lo na blockchain e através desse parâmetro é possível interagir com esse minerador. Ou até mesmo depois quando for feita uma interação com esse contrato poderá acessar o minerador que processou essa interação.

![](<../assets/image(15).png>)

## block.difficulty

O parâmetro dificuldade é o que "regula" a emissão de novas moedas dentro de uma rede baseado na quantidade de mineradores que estão trabalhando nisso e esse parâmetro está sempre sendo ajustado de acordo com a oferta e demanda de poder computacional para realizar os testes de hash. Atráves de block.difficulty é possível acessar a dificuldade de mineração no bloco atual.

![](<../assets/image(103).png>)

## block.gaslimit

Quanto mais cálculos e operações um smart contract tiver, mais gas ele irá consumir. Usando esse parâmetro é possível acessar a quantidade de gas disponível no bloco atual para saber se seu contrato irá ser processado ou não.

![](<../assets/image(34).png>)

## block.number

Retorna o número do bloco atual, pode ser usado para muitas coisas e uma das mais comuns é travar dinheiro até determinado bloco.

No momento em que escrevo isso o bloco atual da rede Ethereum é [13525758](https://etherscan.io/block/13525758).

![](<../assets/image(75).png>)

## block.timestamp

Timestamp é um formato muito conhecido para _encodar_ data e hora em um formato númerico, por exemplo o timestamp de agora é: 1635696570.

![](../assets/image.png)

## msg.sender

Deve-se ficar muito atento ao uso que será feito dessa instrução pois no caso de criação do contrato, msg.sender será o criador do contrato mas depois em uma interação com esse contrato msg.sender será a carteira ou outro contrato que interagiu com ele.

![](<../assets/image(105).png>)

## msg.value

Irá acessar a quantidade de Ethers (ou outra moeda se for outra blockchain) que foi enviada em uma transação.

![](<../assets/image(101).png>)

## tx.origin

Muito parecido com msg.sender porém refere-se somente a endereços de carteira enquanto msg.sender pode referir-se também a contratos. Para compreender o uso mais detalhado acesse [Broken link](broken-reference "mention").

![](<../assets/image(62).png>)

## tx.gasprice

Irá retornar o preço de gas da transação.

![](<../assets/image(31).png>)



