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

## Experimente no Remix

- [Sobreando.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4zOwoKY29udHJhY3QgQSB7CiAgICBzdHJpbmcgcHVibGljIG5hbWUgPSAiQ29udHJhY3QgQSI7CgogICAgZnVuY3Rpb24gZ2V0TmFtZSgpIHB1YmxpYyB2aWV3IHJldHVybnMgKHN0cmluZyBtZW1vcnkpIHsKICAgICAgICByZXR1cm4gbmFtZTsKICAgIH0KfQoKLy8gU29tYnJlYW1lbnRvIG5hbyBlIHBlcm1pdGlkbyBubyBTb2xpZGl0eSAwLjYKLy8gSVNUTyBOQU8gVkFJIENPTVBJTEFSCi8vIGNvbnRyYXRvIEIgZSBBIHsKLy8gICAgIHN0cmluZyBwdWJsaWMgbmFtZSA9ICJDb250cmFjdCBCIjsKLy8gfQoKY29udHJhY3QgQyBpcyBBIHsKICAgIC8vIEVzdGEgZSBhIGZvcm1hIGNvcnJldGEgZGUgc3Vic3RpdHVpciB2YXJpYXZlaXMgZGUgZXN0YWRvIGhlcmRhZGFzLgogICAgY29uc3RydWN0b3IoKSB7CiAgICAgICAgbmFtZSA9ICJDb250cmFjdCBDIjsKICAgIH0KCiAgICAvLyBDLmdldE5hbWUgcmV0b3JuYSAiQ29udHJhY3QgQyIKfQ==)
