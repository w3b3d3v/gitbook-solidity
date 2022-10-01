# Sombreamento de Variáveis de Estado Herdadas

Ao contrário das funções, as variáveis de estado não podem ser substituídas por redeclaração no contrato de classe filho.

Vamos aprender como substituir corretamente variáveis de estado herdadas.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract A {
    string public name = "Contract A";

    function getName() public view returns (string memory) {
        return name;
    }
}

// Sombreamento não é permitido no Solidity 0.6
// Isto não vai compilar
// contrato B é A {
//     string public name = "Contract B";
// }

contract C is A {
    // Esta é a forma correta de substituir variáveis de estado herdadas.
    constructor() {
        name = "Contract C";
    }

    // C.getName retorna "Contract C"
}
```
