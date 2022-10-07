# Pagável

Funções e endereços declarados `payable` podem receber `ether` nesse contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Payable {
    // Endereço pagável pode receber Ether
    address payable public owner;

    // Constructor pagável pode receber Ether
    constructor() payable {
        owner = payable(msg.sender);
    }

    // Função para depositar Ether neste contrato.
    // Chamar essa função junto com algum Ether.
    // O saldo desse contrato será automaticamente atualizado.
    function deposit() public payable {}

    // Chamar essa função junto com algum Ether.
    // A função vai lançar um erro já que ela não é pagável.
    function notPayable() public {}

    // Função para retirar todo Ether deste contrato.
    function withdraw() public {
        // pega a quantidade de Ether armazenado nesse contrato
        uint amount = address(this).balance;

        // envia todo Ether para o proprietário
        // Proprietário pode receber Ether já que o endereço dele é pagável
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to send Ether");
    }

    // Função para transferir Ether deste contrato para o endereço de entrada
    function transfer(address payable _to, uint _amount) public {
        // Note que "to" está declarada como pagável
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }
}
```
