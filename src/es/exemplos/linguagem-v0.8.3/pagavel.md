# Pagable

Las funciones y direcciones declaradas `payable` pueden recibir `ether` en el contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Payable {
    // Una dirección pagable puede recibir Ether
    address payable public owner;

    // El constructor pagable puede recibir Ether
    constructor() payable {
        owner = payable(msg.sender);
    }

    // Función que deposita Ether a este contrato.
    // Llama esta función junto a algunos Ether.
    // El balance de este contrato será automáticamente actualizado.
    function deposit() public payable {}

    // Invoca esta función junto a algunos Ether.
    // La función dará un error ya que esta función no es pagable.
    function notPayable() public {}

    // Función para retirar todos los Ether de este contrato.
    function withdraw() public {
        // Obtiene la cantidad de Ether almacenado en este contrato
        uint amount = address(this).balance;

        // Envía todos los Ether al dueño
        // El dueño puede recibir Ether ya que la dirección del dueño es pagable
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to send Ether");
    }

    // Función para transferir Ether de este contrato a la dirección indicada en el input
    function transfer(address payable _to, uint _amount) public {
        // Note que "to" está declarada como pagable
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }
}
```
