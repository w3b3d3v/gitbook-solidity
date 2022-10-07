# Fallback

`fallback` é uma função que não recebe nenhum argumento e não retorna nada.

Ela é executada quando

* uma função que não existe é chamada ou quando
* Ether é enviado diretamente para um contrato mas `receive()` não existe ou `msg.data` não está vazio

`fallback` tem um limite de gás de 2300 quando chamado por `transfer` ou `send`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Fallback {
    event Log(uint gas);

    // Função fallback deve ser declarada como externa.
    fallback() external payable {
        // send / transfer (encaminha 2300 de gás para esta função fallback)
        // call (encaminha todo o gás)
        emit Log(gasleft());
    }

    // Função auxiliar para verificar o saldo deste contrato
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract SendToFallback {
    function transferToFallback(address payable _to) public payable {
        _to.transfer(msg.value);
    }

    function callFallback(address payable _to) public payable {
        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}
```
