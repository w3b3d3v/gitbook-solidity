# Modificador de función

Modificadores son códigos que pueden ser ejecutados antes y / o después de invocar una función.

Los modificadores pueden ser usados para:

* Restricción de acceso
* Validación de entradas
* Protección contra hack de reentrada (reentrancy hack)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract FunctionModifier {
    // Usaremos estas variables para demostrar como usar los
    // modificadores.
    address public owner;
    uint public x = 10;
    bool public locked;

    constructor() {
        // Establece al emisor de la transacción como dueño del contrato.
        owner = msg.sender;
    }

    // Modificador que verifica que quien llama es el dueño 
    // del contrato.
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore es un carácter especial usado solamente dentro
        // de un modificador de función que le dice a Solidity que
        // ejecute el resto del código.
        _;
    }

    // Modificadores pueden recibir entradas. Este modificador verifica si
    // la dirección recibida no es la dirección cero.
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Not valid address");
        _;
    }

    function changeOwner(address _newOwner) public onlyOwner validAddress(_newOwner) {
        owner = _newOwner;
    }

    // Modificadores pueden ser invocados antes y / o después de uma función.
    // Este modificador previene que una función sea invocada mientras
    // esté siendo ejecutada.
    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }

    function decrement(uint i) public noReentrancy {
        x -= i;

        if (i > 1) {
            decrement(i - 1);
        }
    }
}
```
