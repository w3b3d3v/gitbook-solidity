# Lendo e Escrevendo para uma Variável de Estado

Para escrever ou atualizar uma variável de estado é necessário enviar uma transação.

Por outro lado, podem-se ler variáveis de estado, gratuitamente, sem nenhuma taxa de transação.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ArmazenamentoSimples {
    // Variável de estado para armazenar um número
    uint public num;

    // É necessário enviar uma transação para gravar em uma variável de estado.
    function set(uint _num) public {
        num = _num;
    }

    // Você pode ler a partir de uma variável de estado sem enviar uma transação.
    function get() public view returns (uint) {
        return num;
    }
}
```

## Experimente no Remix

- [ArmazenamentoSimples.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEFybWF6ZW5hbWVudG9TaW1wbGVzIHsKICAgIC8vIFZhcmlhdmVsIGRlIGVzdGFkbyBwYXJhIGFybWF6ZW5hciB1bSBudW1lcm8KICAgIHVpbnQgcHVibGljIG51bTsKCiAgICAvLyBFIG5lY2Vzc2FyaW8gZW52aWFyIHVtYSB0cmFuc2FjYW8gcGFyYSBncmF2YXIgZW0gdW1hIHZhcmlhdmVsIGRlIGVzdGFkby4KICAgIGZ1bmN0aW9uIHNldCh1aW50IF9udW0pIHB1YmxpYyB7CiAgICAgICAgbnVtID0gX251bTsKICAgIH0KCiAgICAvLyBWb2NlIHBvZGUgbGVyIGEgcGFydGlyIGRlIHVtYSB2YXJpYXZlbCBkZSBlc3RhZG8gc2VtIGVudmlhciB1bWEgdHJhbnNhY2FvLgogICAgZnVuY3Rpb24gZ2V0KCkgcHVibGljIHZpZXcgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiBudW07CiAgICB9Cn0=)