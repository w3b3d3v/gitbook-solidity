# Enviando Ether (transferencia, envío, llamada)

#### Como enviar Ether? <a href="#how-to-send-ether" id="how-to-send-ether"></a>

Puedes enviar Ether a otros contratos haciendo

* `transfer` (2300 gás, da error)
* `send` (2300 gás, devuelve un bool)
* `call` (reenvía todo el gas o establece gas, devuelve un bool)

#### Como recibir Ether? <a href="#how-to-receive-ether" id="how-to-receive-ether"></a>

Un contrato que recibe Ether debe tener, al menos, una de las siguientes funciones

* `receive() external payable`
* `fallback() external payable`

`receive()` es llamado si `msg.data` está vacío, si no `fallback()`es llamado / invocado.

#### Cuál método debes usar? <a href="#which-method-should-you-use" id="which-method-should-you-use"></a>

`call` en combinación con la protección de reentrada (re-entrancy guard), es el método recomendado a usar a partir de diciembre del 2019.

Protégete contra la reentrada&#x20;

* Haciendo todos los cambios de estado antes de llamar a otros contratos
* Usando el modificador de la protección de reentrada

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract ReceiveEther {
    /*
    Cuál función es invocada, fallback() o receive()?

           enviar Ether
               |
         msg.data está vacío?
              / \
            si  no
            /     \
receive() existe?  fallback()
         /   \
        si   no
        /      \
    receive()   fallback()
    */

    // Función para recibir Ether. Msg.data tiene que estar vacío
    receive() external payable {}

    // Función de fallback es invocada cuando msg.data no está vacío
    fallback() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract SendEther {
    function sendViaTransfer(address payable _to) public payable {
        // Esta función no es recomendada para enviar Ether.
        _to.transfer(msg.value);
    }

    function sendViaSend(address payable _to) public payable {
        // Send regresa un valor boolean, indicando si fue exitoso o falló.
        // Esta función no es recomendada para enviar Ether.
        bool sent = _to.send(msg.value);
        require(sent, "Failed to send Ether");
    }

    function sendViaCall(address payable _to) public payable {
        // Call regresa un valor boolean, indicando si fue exitoso o falló.
        // Este es el método de uso actual recomendado.
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}
```
