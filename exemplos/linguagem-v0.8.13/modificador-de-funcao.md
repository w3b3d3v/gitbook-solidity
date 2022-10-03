# Modificador de função

Modificadores são códigos que podem ser rodados antes e/ou depois de chamar uma função.

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
## Teste no Remix

[ModificadorDeFuncao.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IE1vZGlmaWNhZG9yRGVGdW5jYW8gewogICAgLy8gVmFtb3MgdXRpbGl6YXIgZXNzYXMgdmFyaWF2ZWlzIHBhcmEgZGVtb25zdHJhciBjb21vIHVzYXIKICAgIC8vIG1vZGlmaWNhZG9yZXMuCiAgICBhZGRyZXNzIHB1YmxpYyBvd25lcjsKICAgIHVpbnQgcHVibGljIHggPSAxMDsKICAgIGJvb2wgcHVibGljIGxvY2tlZDsKCiAgICBjb25zdHJ1Y3RvcigpIHsKICAgICAgICAvLyBEZWZpbmUgbyByZW1ldGVudGUgZGEgdHJhbnNhY2FvIGNvbW8gZG9ubyBkbyBjb250cmF0by4KICAgICAgICBvd25lciA9IG1zZy5zZW5kZXI7CiAgICB9CgogICAgLy8gTW9kaWZpY2Fkb3IgcGFyYSBjaGVjYXIgc2UgcXVlbSBjaGFtYSBlIG8gZG9ubyBkbyBjb250cmF0by4KICAgIG1vZGlmaWVyIG9ubHlPd25lcigpIHsKICAgICAgICByZXF1aXJlKG1zZy5zZW5kZXIgPT0gb3duZXIsICJOYW8gZSBvIGRvbm8gZG8gY29udHJhdG8iKTsKICAgICAgICAvLyBVbmRlcnNjb3JlIGUgdW0gY2FyYWN0ZXJlIGVzcGVjaWFsIHNvbWVudGUgdXNhZG8gZGVudHJvCiAgICAgICAgLy8gZGUgdW0gbW9kaWZpY2Fkb3IgZGUgZnVuY2FvIHF1ZSBkaXogYW8gU29saWRpdHkgcGFyYQogICAgICAgIC8vIGV4ZWN1dGFyIG8gcmVzdG8gZG8gY29kaWdvLgogICAgICAgIF87CiAgICB9CgogICAgLy8gTW9kaWZpY2Fkb3JlcyBwb2RlbSByZWNlYmVyIGVudHJhZGFzLiBFc3NlIG1vZGlmaWNhZG9yIGNoZWNhIHNlCiAgICAvLyBvIGVuZGVyZWNvIHBhc3NhZG8gbmFvIGUgZW5kZXJlY28gemVyby4KICAgIG1vZGlmaWVyIHZhbGlkQWRkcmVzcyhhZGRyZXNzIF9hZGRyKSB7CiAgICAgICAgcmVxdWlyZShfYWRkciAhPSBhZGRyZXNzKDApLCAiRW5kZXJlY28gaW52YWxpZG8iKTsKICAgICAgICBfOwogICAgfQoKICAgIGZ1bmN0aW9uIGNoYW5nZU93bmVyKGFkZHJlc3MgX25ld093bmVyKSBwdWJsaWMgb25seU93bmVyIHZhbGlkQWRkcmVzcyhfbmV3T3duZXIpIHsKICAgICAgICBvd25lciA9IF9uZXdPd25lcjsKICAgIH0KCiAgICAvLyBNb2RpZmljYWRvcmVzIHBvZGVtIHNlciBjaGFtYWRvcyBhbnRlcyBlL291IGRlcG9pcyBkZSB1bWEgZnVuY2FvLgogICAgLy8gRXNzZSBtb2RpZmljYWRvciBpbXBlZGUgcXVlIHVtYSBmdW5jYW8gc2VqYSBjaGFtYWRhIGVucXVhbnRvCiAgICAvLyBlc3RlamEgc2VuZG8gZXhlY3V0YWRhLgogICAgbW9kaWZpZXIgbm9SZWVudHJhbmN5KCkgewogICAgICAgIHJlcXVpcmUoIWxvY2tlZCwgIlNlbSByZWVudHJhZGEiKTsKCiAgICAgICAgbG9ja2VkID0gdHJ1ZTsKICAgICAgICBfOwogICAgICAgIGxvY2tlZCA9IGZhbHNlOwogICAgfQoKICAgIGZ1bmN0aW9uIGRlY3JlbWVudCh1aW50IGkpIHB1YmxpYyBub1JlZW50cmFuY3kgewogICAgICAgIHggLT0gaTsKCiAgICAgICAgaWYgKGkgPiAxKSB7CiAgICAgICAgICAgIGRlY3JlbWVudChpIC0gMSk7CiAgICAgICAgfQogICAgfQp9)