# Manipulação do Bloco Timestamp

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

`block.timestamp` podem ser manipulados por mineradores com as seguintes limitações

- não pode ser carimbado com um tempo anterior ao de seu bloco pai
- não pode estar muito longe no futuro

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
Roulette é um jogo onde você pode ganhar todo Ether num contrato
se você conseguir submeter uma transação num tempo específico.
Um jogador precisa enviar 10 Ether e vence se o block.timestamp % 15 == 0.
*/

/*
1. Implante o Roulette com 10 Ether
2. Eve roda um poderoso minerador que pode manipular o bloco timestamp.
3. Eve configura o block.timestamp para um número no futuro que é divisível por
   15 e encontra o bloco hash alvo.
4. O bloco de Eve é incluído na chain com sucesso, Eve ganha o jogo
   Roulette.
*/

contract Roulette {
    uint public pastBlockTime;

    constructor() payable {}

    function spin() external payable {
        require(msg.value == 10 ether); // must send 10 ether to play
        require(block.timestamp != pastBlockTime); // only 1 transaction per block

        pastBlockTime = block.timestamp;

        if (block.timestamp % 15 == 0) {
            (bool sent, ) = msg.sender.call{value: address(this).balance}("");
            require(sent, "Failed to send Ether");
        }
    }
}
```

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

- Não use `block.timestamp` para uma fonte de entropia e número aleatório

## Teste no Remix

- [BlockTimestamp.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qClJvdWxldHRlIGUgdW0gam9nbyBvbmRlIHZvY2UgcG9kZSBnYW5oYXIgdG9kbyBFdGhlciBudW0gY29udHJhdG8Kc2Ugdm9jZSBjb25zZWd1aXIgc3VibWV0ZXIgdW1hIHRyYW5zYWNhbyBudW0gdGVtcG8gZXNwZWNpZmljby4KVW0gam9nYWRvciBwcmVjaXNhIGVudmlhciAxMCBFdGhlciBlIHZlbmNlIHNlIG8gYmxvY2sudGltZXN0YW1wICUgMTUgPT0gMC4KKi8KCi8qCjEuIEltcGxhbnRlIG8gUm91bGV0dGUgY29tIDEwIEV0aGVyCjIuIEV2ZSByb2RhIHVtIHBvZGVyb3NvIG1pbmVyYWRvciBxdWUgcG9kZSBtYW5pcHVsYXIgbyBibG9jbyB0aW1lc3RhbXAuCjMuIEV2ZSBjb25maWd1cmEgbyBibG9jay50aW1lc3RhbXAgcGFyYSB1bSBudW1lcm8gbm8gZnV0dXJvIHF1ZSBlIGRpdmlzaXZlbCBwb3IKICAgMTUgZSBlbmNvbnRyYSBvIGJsb2NvIGhhc2ggYWx2by4KNC4gTyBibG9jbyBkZSBFdmUgZSBpbmNsdWlkbyBuYSBjaGFpbiBjb20gc3VjZXNzbywgRXZlIGdhbmhhIG8gam9nbwogICBSb3VsZXR0ZS4KKi8KCmNvbnRyYWN0IFJvdWxldHRlIHsKICAgIHVpbnQgcHVibGljIHBhc3RCbG9ja1RpbWU7CgogICAgY29uc3RydWN0b3IoKSBwYXlhYmxlIHt9CgogICAgZnVuY3Rpb24gc3BpbigpIGV4dGVybmFsIHBheWFibGUgewogICAgICAgIHJlcXVpcmUobXNnLnZhbHVlID09IDEwIGV0aGVyKTsgLy8gbXVzdCBzZW5kIDEwIGV0aGVyIHRvIHBsYXkKICAgICAgICByZXF1aXJlKGJsb2NrLnRpbWVzdGFtcCAhPSBwYXN0QmxvY2tUaW1lKTsgLy8gb25seSAxIHRyYW5zYWN0aW9uIHBlciBibG9jawoKICAgICAgICBwYXN0QmxvY2tUaW1lID0gYmxvY2sudGltZXN0YW1wOwoKICAgICAgICBpZiAoYmxvY2sudGltZXN0YW1wICUgMTUgPT0gMCkgewogICAgICAgICAgICAoYm9vbCBzZW50LCApID0gbXNnLnNlbmRlci5jYWxse3ZhbHVlOiBhZGRyZXNzKHRoaXMpLmJhbGFuY2V9KCIiKTsKICAgICAgICAgICAgcmVxdWlyZShzZW50LCAiRmFpbGVkIHRvIHNlbmQgRXRoZXIiKTsKICAgICAgICB9CiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)
