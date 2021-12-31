# Modificador de função

Modificadores são códigos que podem ser rodados antes e / ou depois de chamar uma função.

Modificadores podem ser usados para:

* Restrição de acesso
* Validação de entradas
* Proteção contra hack de reentrada

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract FunctionModifier {
    // Vamos utilizar essas variáveis para demonstrar como usar
    // modificadores.
    address public owner;
    uint public x = 10;
    bool public locked;

    constructor() {
        // Define o remetente da transação como dono do contrato.
        owner = msg.sender;
    }

    // Modificador para checar se quem chama é o proprietário 
    // do contrato.
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore é um caractere especial somente usado dentro
        // de um modificador de função que diz ao Solidity para
        // executar o resto do código.
        _;
    }

    // Modificadores podem receber input. Esse modificador checa se
    // o endereço passado não é endereço zero.
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Not valid address");
        _;
    }

    function changeOwner(address _newOwner) public onlyOwner validAddress(_newOwner) {
        owner = _newOwner;
    }

    // Modificadores podem ser chamados antes e / ou depois de uma função.
    // Esse modificador impede que uma função seja chamada enquanto
    // esteja sendo executada.
    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }

    function decrement(uint i) public noReentrancy {
        x -= i;

        if (i > 1) {
            decrement(i - 1);
        }
    }
}
```
