# Call

`call` é uma função de baixo nível para interagir com outros contratos.

Este é o método recomendado para ser usado quando você está somente enviando Ether via chamada da função `fallback`.

Contudo, não é uma forma recomendada para chamar funções existentes.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Receptor {
    event Received(address caller, uint amount, string message);

    fallback() external payable {
        emit Received(msg.sender, msg.value, "Fallback foi chamado");
    }

    function foo(string memory _message, uint _x) public payable returns (uint) {
        emit Received(msg.sender, msg.value, _message);

        return _x + 1;
    }
}

contract Chamador {
    event Response(bool success, bytes data);

    // Vamos imaginar que o contrato Chamador não tenha o código fonte para o
    // contrato Receptor, mas nós sabemos o endereço de Receptor e a função para chamar.
    function testCallFoo(address payable _addr) public payable {
        // Você pode enviar ether e especificar uma quantidade de gás personalizada
        (bool success, bytes memory data) = _addr.call{value: msg.value, gas: 5000}(
            abi.encodeWithSignature("foo(string,uint256)", "call foo", 123)
        );

        emit Response(success, data);
    }

    // Chamando uma função que não existe aciona a função fallback.
    function testCallDoesNotExist(address _addr) public {
        (bool success, bytes memory data) = _addr.call(
            abi.encodeWithSignature("doesNotExist()")
        );

        emit Response(success, data);
    }
}
```

## Teste no Remix

- [Call.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IFJlY2VwdG9yIHsKICAgIGV2ZW50IFJlY2VpdmVkKGFkZHJlc3MgY2FsbGVyLCB1aW50IGFtb3VudCwgc3RyaW5nIG1lc3NhZ2UpOwoKICAgIGZhbGxiYWNrKCkgZXh0ZXJuYWwgcGF5YWJsZSB7CiAgICAgICAgZW1pdCBSZWNlaXZlZChtc2cuc2VuZGVyLCBtc2cudmFsdWUsICJGYWxsYmFjayBmb2kgY2hhbWFkbyIpOwogICAgfQoKICAgIGZ1bmN0aW9uIGZvbyhzdHJpbmcgbWVtb3J5IF9tZXNzYWdlLCB1aW50IF94KSBwdWJsaWMgcGF5YWJsZSByZXR1cm5zICh1aW50KSB7CiAgICAgICAgZW1pdCBSZWNlaXZlZChtc2cuc2VuZGVyLCBtc2cudmFsdWUsIF9tZXNzYWdlKTsKCiAgICAgICAgcmV0dXJuIF94ICsgMTsKICAgIH0KfQoKY29udHJhY3QgQ2hhbWFkb3IgewogICAgZXZlbnQgUmVzcG9uc2UoYm9vbCBzdWNjZXNzLCBieXRlcyBkYXRhKTsKCiAgICAvLyBWYW1vcyBpbWFnaW5hciBxdWUgbyBjb250cmF0byBDaGFtYWRvciBuYW8gdGVuaGEgbyBjb2RpZ28gZm9udGUgcGFyYSBvCiAgICAvLyBjb250cmF0byBSZWNlcHRvciwgbWFzIG5vcyBzYWJlbW9zIG8gZW5kZXJlY28gZGUgUmVjZXB0b3IgZSBhIGZ1bmNhbyBwYXJhIGNoYW1hci4KICAgIGZ1bmN0aW9uIHRlc3RDYWxsRm9vKGFkZHJlc3MgcGF5YWJsZSBfYWRkcikgcHVibGljIHBheWFibGUgewogICAgICAgIC8vIFZvY2UgcG9kZSBlbnZpYXIgZXRoZXIgZSBlc3BlY2lmaWNhciB1bWEgcXVhbnRpZGFkZSBkZSBnYXMgcGVyc29uYWxpemFkYQogICAgICAgIChib29sIHN1Y2Nlc3MsIGJ5dGVzIG1lbW9yeSBkYXRhKSA9IF9hZGRyLmNhbGx7dmFsdWU6IG1zZy52YWx1ZSwgZ2FzOiA1MDAwfSgKICAgICAgICAgICAgYWJpLmVuY29kZVdpdGhTaWduYXR1cmUoImZvbyhzdHJpbmcsdWludDI1NikiLCAiY2FsbCBmb28iLCAxMjMpCiAgICAgICAgKTsKCiAgICAgICAgZW1pdCBSZXNwb25zZShzdWNjZXNzLCBkYXRhKTsKICAgIH0KCiAgICAvLyBDaGFtYW5kbyB1bWEgZnVuY2FvIHF1ZSBuYW8gZXhpc3RlIGFjaW9uYSBhIGZ1bmNhbyBmYWxsYmFjay4KICAgIGZ1bmN0aW9uIHRlc3RDYWxsRG9lc05vdEV4aXN0KGFkZHJlc3MgX2FkZHIpIHB1YmxpYyB7CiAgICAgICAgKGJvb2wgc3VjY2VzcywgYnl0ZXMgbWVtb3J5IGRhdGEpID0gX2FkZHIuY2FsbCgKICAgICAgICAgICAgYWJpLmVuY29kZVdpdGhTaWduYXR1cmUoImRvZXNOb3RFeGlzdCgpIikKICAgICAgICApOwoKICAgICAgICBlbWl0IFJlc3BvbnNlKHN1Y2Nlc3MsIGRhdGEpOwogICAgfQp9&version=soljson-v0.8.20+commit.a1b79de6.js)
