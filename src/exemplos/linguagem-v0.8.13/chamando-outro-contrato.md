# Chamando outro Contrato

Um contrato pode chamar outros contratos de 2 formas.

A maneira mais fácil é apenas chamá-lo, como `A.foo(x, y, z)`.

Outra maneira de chamar outros contratos é usar o `call`.

Esse método não é recomendado.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Callee {
    uint public x;
    uint public value;

    function setX(uint _x) public returns (uint) {
        x = _x;
        return x;
    }

    function setXandSendEther(uint _x) public payable returns (uint, uint) {
        x = _x;
        value = msg.value;

        return (x, value);
    }
}

contract Caller {
    function setX(Callee _callee, uint _x) public {
        uint x = _callee.setX(_x);
    }

    function setXFromAddress(address _addr, uint _x) public {
        Callee callee = Callee(_addr);
        callee.setX(_x);
    }

    function setXandSendEther(Callee _callee, uint _x) public payable {
        (uint x, uint value) = _callee.setXandSendEther{value: msg.value}(_x);
    }
}
```

## Teste no Remix

- [CallingContract.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IENhbGxlZSB7CiAgICB1aW50IHB1YmxpYyB4OwogICAgdWludCBwdWJsaWMgdmFsdWU7CgogICAgZnVuY3Rpb24gc2V0WCh1aW50IF94KSBwdWJsaWMgcmV0dXJucyAodWludCkgewogICAgICAgIHggPSBfeDsKICAgICAgICByZXR1cm4geDsKICAgIH0KCiAgICBmdW5jdGlvbiBzZXRYYW5kU2VuZEV0aGVyKHVpbnQgX3gpIHB1YmxpYyBwYXlhYmxlIHJldHVybnMgKHVpbnQsIHVpbnQpIHsKICAgICAgICB4ID0gX3g7CiAgICAgICAgdmFsdWUgPSBtc2cudmFsdWU7CgogICAgICAgIHJldHVybiAoeCwgdmFsdWUpOwogICAgfQp9Cgpjb250cmFjdCBDYWxsZXIgewogICAgZnVuY3Rpb24gc2V0WChDYWxsZWUgX2NhbGxlZSwgdWludCBfeCkgcHVibGljIHsKICAgICAgICB1aW50IHggPSBfY2FsbGVlLnNldFgoX3gpOwogICAgfQoKICAgIGZ1bmN0aW9uIHNldFhGcm9tQWRkcmVzcyhhZGRyZXNzIF9hZGRyLCB1aW50IF94KSBwdWJsaWMgewogICAgICAgIENhbGxlZSBjYWxsZWUgPSBDYWxsZWUoX2FkZHIpOwogICAgICAgIGNhbGxlZS5zZXRYKF94KTsKICAgIH0KCiAgICBmdW5jdGlvbiBzZXRYYW5kU2VuZEV0aGVyKENhbGxlZSBfY2FsbGVlLCB1aW50IF94KSBwdWJsaWMgcGF5YWJsZSB7CiAgICAgICAgKHVpbnQgeCwgdWludCB2YWx1ZSkgPSBfY2FsbGVlLnNldFhhbmRTZW5kRXRoZXJ7dmFsdWU6IG1zZy52YWx1ZX0oX3gpOwogICAgfQp9&version=soljson-v0.8.13+commit.abaa5c0e.js)
