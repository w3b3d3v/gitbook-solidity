# Lendo e Escrevendo para uma Variável de Estado

Para escrever ou atualizar uma variável de estado é necessário enviar uma transação.

Por outro lado, podem-se ler variáveis de estado, gratuitamente, sem nenhuma taxa de transação.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract SimpleStorage {
    // Variável de estado para armazenar um número
    uint public num;

    // É necessário enviar uma transação para escrever para uma variável de estado.
    function set(uint _num) public {
        num = _num;
    }

    // Você pode ler de uma váriável de estado sem enviar uma transação.
    function get() public view returns (uint) {
        return num;
    }
}
```
