# Fallback

`fallback` é uma função que não recebe nenhum argumento e não retorna nada.

Ela é executada quando

- uma função que não existe é chamada ou quando
- Ether é enviado diretamente para um contrato mas `receive()` não existe ou `msg.data` não está vazio

`fallback` tem um limite de gás de 2300 quando chamado por `transfer` ou `send`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Fallback {
    event Log(uint gas);

    // Função fallback deve ser declarada como externa.
    fallback() external payable {
        // send / transfer (encaminha 2300 de gás para esta função fallback)
        // call (encaminha todo o gás)
        emit Log(gasleft());
    }

    // Função auxiliar para verificar o saldo deste contrato
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract SendToFallback {
    function transferToFallback(address payable _to) public payable {
        _to.transfer(msg.value);
    }

    function callFallback(address payable _to) public payable {
        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Falha ao enviar Ether");
    }
}
```

## Teste no Remix

- [Fallback.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEZhbGxiYWNrIHsKICAgIGV2ZW50IExvZyh1aW50IGdhcyk7CgogICAgLy8gRnVuY2FvIGZhbGxiYWNrIGRldmUgc2VyIGRlY2xhcmFkYSBjb21vIGV4dGVybmEuCiAgICBmYWxsYmFjaygpIGV4dGVybmFsIHBheWFibGUgewogICAgICAgIC8vIHNlbmQgLyB0cmFuc2ZlciAoZW5jYW1pbmhhIDIzMDAgZGUgZ2FzIHBhcmEgZXN0YSBmdW5jYW8gZmFsbGJhY2spCiAgICAgICAgLy8gY2FsbCAoZW5jYW1pbmhhIHRvZG8gbyBnYXMpCiAgICAgICAgZW1pdCBMb2coZ2FzbGVmdCgpKTsKICAgIH0KCiAgICAvLyBGdW5jYW8gYXV4aWxpYXIgcGFyYSB2ZXJpZmljYXIgbyBzYWxkbyBkZXN0ZSBjb250cmF0bwogICAgZnVuY3Rpb24gZ2V0QmFsYW5jZSgpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4gYWRkcmVzcyh0aGlzKS5iYWxhbmNlOwogICAgfQp9Cgpjb250cmFjdCBTZW5kVG9GYWxsYmFjayB7CiAgICBmdW5jdGlvbiB0cmFuc2ZlclRvRmFsbGJhY2soYWRkcmVzcyBwYXlhYmxlIF90bykgcHVibGljIHBheWFibGUgewogICAgICAgIF90by50cmFuc2Zlcihtc2cudmFsdWUpOwogICAgfQoKICAgIGZ1bmN0aW9uIGNhbGxGYWxsYmFjayhhZGRyZXNzIHBheWFibGUgX3RvKSBwdWJsaWMgcGF5YWJsZSB7CiAgICAgICAgKGJvb2wgc2VudCwgKSA9IF90by5jYWxse3ZhbHVlOiBtc2cudmFsdWV9KCIiKTsKICAgICAgICByZXF1aXJlKHNlbnQsICJGYWxoYSBhbyBlbnZpYXIgRXRoZXIiKTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)
