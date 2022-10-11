# Fallback

`fallback` es una función que no toma ningún argumento y no regresa nada.

Es ejecutada cuando

* Una función que no existe es llamada o
* El Ether es enviado directamente al contrato pero `receive()` no existe o `msg.data` no está vacío

`fallback` tiene un límite de gas de 2300 cuando es llamada por `transfer` o `send`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Fallback {
    event Log(uint gas);

    // La función Fallback tiene que ser declarada como externa.
    fallback() external payable {
        // send / transfer (reenvía 2300 de gas a esta función fallback)
        // call (reenvía todo el gas)
        emit Log(gasleft());
    }

    // Receive es una variante del fallback que se desencadena cuando msg.data está vacío
    receive() external payable {
        emit Log("receive", gasleft());
    }

    // Función auxiliar que obtiene el balance de este contrato
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
        require(sent, "Failed to send Ether");
    }
}
```
