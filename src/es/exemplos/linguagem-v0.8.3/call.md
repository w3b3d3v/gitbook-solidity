# Call

`call` es una función de bajo nivel para interactuar con otros contratos.

Este es el método recomendado a usar cuando solo estás enviado Ether a través de la llamada de la función `fallback`.

Ahora bien, esta no es la manera recomendada de llamar a las funciones existentes.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Receiver {
    event Received(address caller, uint amount, string message);

    fallback() external payable {
        emit Received(msg.sender, msg.value, "Fallback was called");
    }

    function foo(string memory _message, uint _x) public payable returns (uint) {
        emit Received(msg.sender, msg.value, _message);

        return _x + 1;
    }
}

contract Caller {
    event Response(bool success, bytes data);

    // Imaginemos que el contrato invocado Caller no tiene código fuente para
    // cl contrato Receiver, pero si sabemos la dirección del contrato Receiver y la función para llamar.
    function testCallFoo(address payable _addr) public payable {
        // Puedes enviar Ether y personalizar la cantidad de gas
        (bool success, bytes memory data) = _addr.call{value: msg.value, gas: 5000}(
            abi.encodeWithSignature("foo(string,uint256)", "call foo", 123)
        );

        emit Response(success, data);
    }

    // Invocar a una función que no existe desencadena la función fallback.
    function testCallDoesNotExist(address _addr) public {
        (bool success, bytes memory data) = _addr.call(
            abi.encodeWithSignature("doesNotExist()")
        );

        emit Response(success, data);
    }
}
```
