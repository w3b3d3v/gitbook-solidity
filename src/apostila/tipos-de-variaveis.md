---
title:  2. Tipos de Variáveis
---
::: tip
Variáveis são como caixas para guardarem coisas. Em um amibiente de
desenvolvimento e programação elas são para guardar dados, números,
estruturas, textos...
:::

### Considerações importantes.

* Há tipos simples e comuns de variáveis
* Há variáveis complexas e com casos de uso específico
* Quando digo "simples" e complexa" refiro-me a profundidade de entendimento necessário para manipula-las e saber o porquê usa-las.



## Uma breve introdução de como as variáveis funcionam.

Os tipos de dados em solidity são explícitos, ou seja nós precisamos definir através de uma _palavra chave_ qual é o tipo da variável. No print abaixo o tipo e o nome da variável estão em azul e o seu conteúdo está em amarelo.

![](<../assets/image(56).png>)

Após definirmos o tipo da variável e seu nome podemos definir o seu valor ou então deixar para ser definido depois em outra etapa do programa.

![](<../assets/image(55).png>)

![](<../assets/image(41).png>)

exemplo de variável definida que será usada depois. (ignore a parte do código que você não entender agora)

![](<../assets/image(76).png>)

Nesse caso temos uma função chamada _qualSeuNome_ que irá receber de fora do programa um texto digitado, que será armazenado em uma variável temporária chamada _nome\_digitado_ e depois a váriavel _nome_ que foi definida antes receberá esse valor. Depois da execução dessa função a variável _nome_ terá o valor que foi passado pra ela através da função _qualSeuNome_.



## Principais tipos de variáveis:

#### Endereço (address).

![](<../assets/image(107).png>)

o tipo _address_ armazena endereços de carteiras e outros contratos.

#### Booleano.

![](<../assets/image(37).png>)

_bool_ é um tipo de dado primitivo que representa dois valores: verdadeiro ou falso. Em inglês: _true_ and _false_.

#### Números inteiros positivos.

![](<../assets/image(20).png>)

Para armazenar números inteiros positivos usamos o tipo _uint_ e para números de tamanho definido podemos usar por exemplo _uint256_ para números de 256 bytes.

#### Texto simples (string).

![](<../assets/image(88).png>)

_string_ é a forma mais comum de armazenar textos mas também podemos usar o formato _bytes32_ para tamanhos definidos e otimização de gas_._

#### Texto com tamanho específico (bytes)

![](<../assets/image(11).png>)

#### Listas específicas (arrays)

É muito importante saber como arrays funcionam pois são muito usados. Há uma semelhança enorme entre _listas_ e _arrays_ e a maior diferença entre eles é que _arrays são listas de um unico tipo de dado._ Só podemos ter uma lista de números ou uma lista de textos ou uma lista de endereços... não se pode misturar os tipos de dados.

![](<../assets/image(65).png>)

Seguindo a lógica de antes primeiro define-se o tipo da variável e depois o seu nome. Para definir um array usa-se o seu tipo de dado mais "\[]".

#### Chave e valor (mapping).

Pode-se dizer que _mapping_ é como os dicionários em outras linguagens. Utiliza-se um tipo de "lista" de chaves e cada chave guarda um valor.

![](<../assets/image(26).png>)

Nesse caso temos uma "lista" chamada saldos que possui _endereços_ como _chave_ e dentro de cada endereço está guardado um valor.

#### Estrutura de dados (struct).

É o tipo de dado mais parecido com _Objetos_ em outras linguagens. É muito usado para definir uma estrutura padrão de variáveis a serem usadas em contextos específicos.&#x20;

![](<../assets/image(27).png>)

Por exemplo, se você construir um programa que precisa do nome de um usuario, seu id e uma lista de produtos ou NFTs que ele comprou, e precisar disso em vários contextos do seu programa a forma mais compreensível e legível de manipular isso é usando uma estrutura definida de variáveis.

#### Variáveis categóricas (Enums)

Enums são muito uteis para categorização de dados, você pode criar uma categoria "Cor" e guardar várias cores dentro dessa categoria e quando precisar de uma determinada cor pode "pedir" um valor que está guardando dentro dessa categoria.

![](<../assets/image(78).png>)
