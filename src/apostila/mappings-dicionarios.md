---
title: 10. Mappings (Dicionários)
---
::: tip
  Não é incorreto afirmar que mappings são como dicionários de outras linguagens pois também se armazena dados utilizando uma estrutura de chave-valor. Você verá eu usar as duas palavras nesse tutorial.
:::

### Criando um dicionário.

Assim como todas as outras [variáveis em solidity](tipos-de-variaveis.md) nós primeiros definimos o tipo do dicionário e depois seu nome. No nosso exemplo, temos um dicionário em que as _**chaves são endereços**_ e os **valores são números inteiros** que representam os saldos e o mapping se chama _**balances**_.

![](<../assets/image(28).png>)

### Adicionando dados.

Diferente das [listas](arrays-listas.md) onde indicamos o nome e a posição, com dicionários indicamos o nome e a chave. Nesse caso abaixo, dicionario balances no _endereço de quem chamar a transação_ ([msg.sender](variaveis-built-in-msg.sender-msg.value....md)) terá o valor 100 guardado.

![](<../assets/image(113).png>)

### Ler dados.

Também muito parecido com listas mas ao invés de passar a posição-da-lista onde estão os dados, passamos a chave que nesse caso também é aquele que chamar a transação.&#x20;



![acessar dados](<../assets/image(91).png>)

### Atualizar dados.

Praticamente a mesma coisa que adicionar um novo dado, se no dicionário não existir nada no endereço de chave passado será adicionado pela primeira vez, se já existir algo será então substituído.

![](<../assets/image(121).png>)

### Deletar dados.

Esse sim é exatamente como em listas, basta passar a chave do dicionário após a instrução _**delete**_.

![](<../assets/image(110).png>)

## Valor padrão

Listas e Dicionários tem um valor padrão caso tentemos acessar uma chave ou posição-de-lista que não exista, esse valor é 0.

![](<../assets/image(5).png>)

## Tipos Exóticos de Mappings.

### Dicionário de dicionários.

É possível armazenar outros dicionários dentro de um dicionário. Imagine que você constrói um contrato em que é possível que outras pessoas guardem dinheiro e disponibilizem para outras pessoas além delas mesmas. Essa situação é representada no nosso exemplo abaixo onde temos um dicionario de endereços (chaves) principais (que guardam dinheiro no contrato) e os valores dentro desses endereços há outra lista de endereços que são chaves e dentro dessas chaves há valores bool, que podem ser positivo ou negativo.

Resumidamente, temos uma lista de endereços que guarda outros endereços e valors true ou false para indicar se esses endereços podem ou não realizar uma determinada ação.

![](<../assets/image(98).png>)

### Listas dentro de dicionários

Se estivermos contruíndo um jogo onde cada jogador pode jogar várias partidas e armazenar sua pontuação de cada partida para no final realizar um calcúlo.

Nesse caso, pode haver um dicionário que guarda endereços como chave e dentro de cada endereço há uma lista de valores.

![](<../assets/image(85).png>)
