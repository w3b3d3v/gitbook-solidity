# Sombreamento de Variáveis de Estado Herdadas

Ao contrário das funções, as variáveis de estado não podem ser substituídas por declaração no contrato de classe filho.

Vamos aprender como substituir corretamente variáveis de estado herdadas.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract A {
    string public name = "Contract A";

    function getName() public view returns (string memory) {
        return name;
    }
}

// Sombreamento não é permitido no Solidity 0.6
// ISTO NÃO VAI COMPILAR
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

## Teste no Remix

- [Sobreando.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEEgewogICAgc3RyaW5nIHB1YmxpYyBuYW1lID0gIkNvbnRyYWN0IEEiOwoKICAgIGZ1bmN0aW9uIGdldE5hbWUoKSBwdWJsaWMgdmlldyByZXR1cm5zIChzdHJpbmcgbWVtb3J5KSB7CiAgICAgICAgcmV0dXJuIG5hbWU7CiAgICB9Cn0KCi8vIFNvbWJyZWFtZW50byBuYW8gZSBwZXJtaXRpZG8gbm8gU29saWRpdHkgMC42Ci8vIElTVE8gTkFPIFZBSSBDT01QSUxBUgovLyBjb250cmF0byBCIGUgQSB7Ci8vICAgICBzdHJpbmcgcHVibGljIG5hbWUgPSAiQ29udHJhY3QgQiI7Ci8vIH0KCmNvbnRyYWN0IEMgaXMgQSB7CiAgICAvLyBFc3RhIGUgYSBmb3JtYSBjb3JyZXRhIGRlIHN1YnN0aXR1aXIgdmFyaWF2ZWlzIGRlIGVzdGFkbyBoZXJkYWRhcy4KICAgIGNvbnN0cnVjdG9yKCkgewogICAgICAgIG5hbWUgPSAiQ29udHJhY3QgQyI7CiAgICB9CgogICAgLy8gQy5nZXROYW1lIHJldG9ybmEgIkNvbnRyYWN0IEMiCn0=&version=soljson-v0.8.20+commit.a1b79de6.js)
