# Variáveis

Existem 3 tipos de variáveis no Solidity

* **local**
  * declarada dentro de uma função
  * não armazenada no blockchain
* **de estado**
  * declarada fora de uma função
  * armazenada no blockchain
* **global** (fornece informação sobre o blockchain)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Variables {
    // Variáveis de estado são armazenadas no blockchain.
    string public text = "Hello";
    uint public num = 123;

    function doSomething() public {
        // Variáveis locais não ficam salvas para o blockchain.
        uint i = 456;

        // Aqui estão algumas variáveis globais
        uint timestamp = block.timestamp; // Registro da hora do
             bloco atual
        address sender = msg.sender; // endereço do remetente
    }
}
```
