# Eventos

`Events` permite logar o blockchain do Ethereumn. Alguns casos de uso de eventos são:

* Monitorar os eventos e atualizar a interface do usuário
* Uma forma econômica de armazenamento

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Event {
    // Declaração do evento
    // Podem ser indexados até 3 parâmetros.
    // Parâmetros indexados ajudam a filtrar os logs 
    event Log(address indexed sender, string message);
    event AnotherLog();

    function test() public {
        emit Log(msg.sender, "Hello World!");
        emit Log(msg.sender, "Hello EVM!");
        emit AnotherLog();
    }
}
```
