# Call

`call` é uma função de baixo nível para interagir com outros contratos.

Este é o método recomendado para ser usado quando você está somente enviando Ether via chamada da função `fallback`.

Contudo não é uma forma recomendada para chamar funções existentes.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Receptor {
    event Received(address chamador, uint amount, string message);

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
- [Call.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFJlY2VwdG9yIHsKICAgIGV2ZW50IFJlY2VpdmVkKGFkZHJlc3MgY2hhbWFkb3IsIHVpbnQgYW1vdW50LCBzdHJpbmcgbWVzc2FnZSk7CgogICAgZmFsbGJhY2soKSBleHRlcm5hbCBwYXlhYmxlIHsKICAgICAgICBlbWl0IFJlY2VpdmVkKG1zZy5zZW5kZXIsIG1zZy52YWx1ZSwgIkZhbGxiYWNrIGZvaSBjaGFtYWRvIik7CiAgICB9CgogICAgZnVuY3Rpb24gZm9vKHN0cmluZyBtZW1vcnkgX21lc3NhZ2UsIHVpbnQgX3gpIHB1YmxpYyBwYXlhYmxlIHJldHVybnMgKHVpbnQpIHsKICAgICAgICBlbWl0IFJlY2VpdmVkKG1zZy5zZW5kZXIsIG1zZy52YWx1ZSwgX21lc3NhZ2UpOwoKICAgICAgICByZXR1cm4gX3ggKyAxOwogICAgfQp9Cgpjb250cmFjdCBDaGFtYWRvciB7CiAgICBldmVudCBSZXNwb25zZShib29sIHN1Y2Nlc3MsIGJ5dGVzIGRhdGEpOwoKICAgIC8vIFZhbW9zIGltYWdpbmFyIHF1ZSBvIGNvbnRyYXRvIENoYW1hZG9yIG5hbyB0ZW5oYSBvIGNvZGlnbyBmb250ZSBwYXJhIG8KICAgIC8vIGNvbnRyYXRvIFJlY2VwdG9yLCBtYXMgbm9zIHNhYmVtb3MgbyBlbmRlcmVjbyBkZSBSZWNlcHRvciBlIGEgZnVuY2FvIHBhcmEgY2hhbWFyLgogICAgZnVuY3Rpb24gdGVzdENhbGxGb28oYWRkcmVzcyBwYXlhYmxlIF9hZGRyKSBwdWJsaWMgcGF5YWJsZSB7CiAgICAgICAgLy8gVm9jZSBwb2RlIGVudmlhciBldGhlciBlIGVzcGVjaWZpY2FyIHVtYSBxdWFudGlkYWRlIGRlIGdhcyBwZXJzb25hbGl6YWRhCiAgICAgICAgKGJvb2wgc3VjY2VzcywgYnl0ZXMgbWVtb3J5IGRhdGEpID0gX2FkZHIuY2FsbHt2YWx1ZTogbXNnLnZhbHVlLCBnYXM6IDUwMDB9KAogICAgICAgICAgICBhYmkuZW5jb2RlV2l0aFNpZ25hdHVyZSgiZm9vKHN0cmluZyx1aW50MjU2KSIsICJjYWxsIGZvbyIsIDEyMykKICAgICAgICApOwoKICAgICAgICBlbWl0IFJlc3BvbnNlKHN1Y2Nlc3MsIGRhdGEpOwogICAgfQoKICAgIC8vIENoYW1hbmRvIHVtYSBmdW5jYW8gcXVlIG5hbyBleGlzdGUgYWNpb25hIGEgZnVuY2FvIGZhbGxiYWNrLgogICAgZnVuY3Rpb24gdGVzdENhbGxEb2VzTm90RXhpc3QoYWRkcmVzcyBfYWRkcikgcHVibGljIHsKICAgICAgICAoYm9vbCBzdWNjZXNzLCBieXRlcyBtZW1vcnkgZGF0YSkgPSBfYWRkci5jYWxsKAogICAgICAgICAgICBhYmkuZW5jb2RlV2l0aFNpZ25hdHVyZSgiZG9lc05vdEV4aXN0KCkiKQogICAgICAgICk7CgogICAgICAgIGVtaXQgUmVzcG9uc2Uoc3VjY2VzcywgZGF0YSk7CiAgICB9Cn0=)