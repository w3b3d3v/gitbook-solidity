# Call

`call` é uma função de baixo nível para interagir com outros contratos.

Este é o método recomendado para ser usado quando você está somente enviando Ether via chamada da função `fallback`.

Contudo não é uma forma recomendada para chamar funções existentes.

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

    // Vamos imaginar que o contrato B não tenha o código fonte para 
    // contrato A, mas nós sabemos o endereço de A e a função para chamar.
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
