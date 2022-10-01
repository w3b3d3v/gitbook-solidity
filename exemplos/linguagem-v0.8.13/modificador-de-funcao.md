# Modificador de função

Modificadores são códigos que podem ser rodados antes e / ou depois de chamar uma função.

Modificadores podem ser usados para:

* Restrição de acesso
* Validação de entradas
* Proteção contra hack de reentrada

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ModificadorDeFuncao {
    // Vamos utilizar essas variáveis para demonstrar como usar
    // modificadores.
    address public owner;
    uint public x = 10;
    bool public locked;

    constructor() {
        // Define o remetente da transação como dono do contrato.
        owner = msg.sender;
    }

    // Modificador para checar se quem chama é o dono do contrato.
    modifier onlyOwner() {
        require(msg.sender == owner, "Não é o dono do contrato");
        // Underscore é um caractere especial somente usado dentro
        // de um modificador de função que diz ao Solidity para
        // executar o resto do código.
        _;
    }

    // Modificadores podem receber entradas. Esse modificador checa se
    // o endereço passado não é endereço zero.
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Endereço inválido");
        _;
    }

    function changeOwner(address _newOwner) public onlyOwner validAddress(_newOwner) {
        owner = _newOwner;
    }

    // Modificadores podem ser chamados antes e/ou depois de uma função.
    // Esse modificador impede que uma função seja chamada enquanto
    // esteja sendo executada.
    modifier noReentrancy() {
        require(!locked, "Sem reentrada");

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
## Experimente no Remix

[ModificadorDeFuncao.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IE1vZGlmaWNhZG9yRGVGdW5jYW8gewogICAgLy8gVmFtb3MgdXRpbGl6YXIgZXNzYXMgdmFyaWF2ZWlzIHBhcmEgZGVtb25zdHJhciBjb21vIHVzYXIKICAgIC8vIG1vZGlmaWNhZG9yZXMuCiAgICBhZGRyZXNzIHB1YmxpYyBvd25lcjsKICAgIHVpbnQgcHVibGljIHggPSAxMDsKICAgIGJvb2wgcHVibGljIGxvY2tlZDsKCiAgICBjb25zdHJ1Y3RvcigpIHsKICAgICAgICAvLyBEZWZpbmUgbyByZW1ldGVudGUgZGEgdHJhbnNhY2FvIGNvbW8gZG9ubyBkbyBjb250cmF0by4KICAgICAgICBvd25lciA9IG1zZy5zZW5kZXI7CiAgICB9CgogICAgLy8gTW9kaWZpY2Fkb3IgcGFyYSBjaGVjYXIgc2UgcXVlbSBjaGFtYSBlIG8gZG9ubyBkbyBjb250cmF0by4KICAgIG1vZGlmaWVyIG9ubHlPd25lcigpIHsKICAgICAgICByZXF1aXJlKG1zZy5zZW5kZXIgPT0gb3duZXIsIFwiTmFvIGUgbyBkb25vIGRvIGNvbnRyYXRvXCIpOwogICAgICAgIC8vIFVuZGVyc2NvcmUgZSB1bSBjYXJhY3RlcmUgZXNwZWNpYWwgc29tZW50ZSB1c2FkbyBkZW50cm8KICAgICAgICAvLyBkZSB1bSBtb2RpZmljYWRvciBkZSBmdW5jYW8gcXVlIGRpeiBhbyBTb2xpZGl0eSBwYXJhCiAgICAgICAgLy8gZXhlY3V0YXIgbyByZXN0byBkbyBjb2RpZ28uCiAgICAgICAgXzsKICAgIH0KCiAgICAvLyBNb2RpZmljYWRvcmVzIHBvZGVtIHJlY2ViZXIgZW50cmFkYXMuIEVzc2UgbW9kaWZpY2Fkb3IgY2hlY2Egc2UKICAgIC8vIG8gZW5kZXJlY28gcGFzc2FkbyBuYW8gZSBlbmRlcmVjbyB6ZXJvLgogICAgbW9kaWZpZXIgdmFsaWRBZGRyZXNzKGFkZHJlc3MgX2FkZHIpIHsKICAgICAgICByZXF1aXJlKF9hZGRyICE9IGFkZHJlc3MoMCksIFwiRW5kZXJlY28gaW52YWxpZG9cIik7CiAgICAgICAgXzsKICAgIH0KCiAgICBmdW5jdGlvbiBjaGFuZ2VPd25lcihhZGRyZXNzIF9uZXdPd25lcikgcHVibGljIG9ubHlPd25lciB2YWxpZEFkZHJlc3MoX25ld093bmVyKSB7CiAgICAgICAgb3duZXIgPSBfbmV3T3duZXI7CiAgICB9CgogICAgLy8gTW9kaWZpY2Fkb3JlcyBwb2RlbSBzZXIgY2hhbWFkb3MgYW50ZXMgZS9vdSBkZXBvaXMgZGUgdW1hIGZ1bmNhby4KICAgIC8vIEVzc2UgbW9kaWZpY2Fkb3IgaW1wZWRlIHF1ZSB1bWEgZnVuY2FvIHNlamEgY2hhbWFkYSBlbnF1YW50bwogICAgLy8gZXN0ZWphIHNlbmRvIGV4ZWN1dGFkYS4KICAgIG1vZGlmaWVyIG5vUmVlbnRyYW5jeSgpIHsKICAgICAgICByZXF1aXJlKCFsb2NrZWQsIFwiU2VtIHJlZW50cmFkYVwiKTsKCiAgICAgICAgbG9ja2VkID0gdHJ1ZTsKICAgICAgICBfOwogICAgICAgIGxvY2tlZCA9IGZhbHNlOwogICAgfQoKICAgIGZ1bmN0aW9uIGRlY3JlbWVudCh1aW50IGkpIHB1YmxpYyBub1JlZW50cmFuY3kgewogICAgICAgIHggLT0gaTsKCiAgICAgICAgaWYgKGkgPiAxKSB7CiAgICAgICAgICAgIGRlY3JlbWVudChpIC0gMSk7CiAgICAgICAgfQogICAgfQp9)