# Eventos

`Events` permitir o login na blockchain Ethereum. Alguns casos de uso para eventos são:

- Monitorar os eventos e atualizar a interface do usuário
- Uma forma econômica de armazenamento

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Evento {
    // Declaração do evento
    // Podem ser indexados até 3 parâmetros.
    // Parâmetros indexados ajudam a filtrar os logs
    event Log(address indexed sender, string message);
    event AnotherLog();

    function test() public {
        emit Log(msg.sender, "Olá Mundo!");
        emit Log(msg.sender, "Olá EVM!");
        emit AnotherLog();
    }
}
```

## Teste no Remix

[Evento.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEV2ZW50byB7CiAgICAvLyBEZWNsYXJhY2FvIGRvIGV2ZW50bwogICAgLy8gUG9kZW0gc2VyIGluZGV4YWRvcyBhdGUgMyBwYXJhbWV0cm9zLgogICAgLy8gUGFyYW1ldHJvcyBpbmRleGFkb3MgYWp1ZGFtIGEgZmlsdHJhciBvcyBsb2dzIAogICAgZXZlbnQgTG9nKGFkZHJlc3MgaW5kZXhlZCBzZW5kZXIsIHN0cmluZyBtZXNzYWdlKTsKICAgIGV2ZW50IEFub3RoZXJMb2coKTsKCiAgICBmdW5jdGlvbiB0ZXN0KCkgcHVibGljIHsKICAgICAgICBlbWl0IExvZyhtc2cuc2VuZGVyLCAiT2xhIE11bmRvISIpOwogICAgICAgIGVtaXQgTG9nKG1zZy5zZW5kZXIsICJPbGEgRVZNISIpOwogICAgICAgIGVtaXQgQW5vdGhlckxvZygpOwogICAgfQp9&version=soljson-v0.8.13+commit.abaa5c0e.js)
