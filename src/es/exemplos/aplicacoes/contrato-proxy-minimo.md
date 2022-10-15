# Contrato Proxy Mínimo

Si tienes un contrato que será desplegado múltiples veces, usa el contrato proxy mínimo para que los despliegues sean más baratos.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// código original
// https://github.com/optionality/clone-factory/blob/master/contracts/CloneFactory.sol

contract MinimalProxy {
    function clone(address target) external returns (address result) {
        // Transforma la dirección a 20 bytes
        bytes20 targetBytes = bytes20(target);

        // código actual //
        // 3d602d80600a3d3981f3363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3

        // código de creación //
        // copia el código en tiempo de ejecución hacia la memoria y lo devuelve
        // 3d602d80600a3d3981f3

        // código en tiempo de ejecución //
        // código para delegatecall hacia la dirección
        // 363d3d373d3d3d363d73 address 5af43d82803e903d91602b57fd5bf3

        assembly {
            /*
            Se leen los 32 bytes de memoria, comenzando con el puntero guardado en 0x40

            En solidity, el slot 0x40 en la memoria es especial: contiene el "puntero de memoria libre"
            Que apunta al final de la memoria actualmente asignada. 
            */
            let clone := mload(0x40)
            // almacena 32 bytes de memoria comenzando en "clone"
            mstore(
                clone,
                0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000
            )

            /*
              |              20 bytes                |
            0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000
                                                      ^
                                                      pointer
            */
            // almacena 32 bytes de memoria comenzando en "clone" + 20 bytes
            // 0x14 = 20
            mstore(add(clone, 0x14), targetBytes)

            /*
              |               20 bytes               |                 20 bytes              |
            0x3d602d80600a3d3981f3363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe
                                                                                              ^
                                                                                              pointer
            */
            // almacena 32 bytes de memoria comenzando en "clone" + 40 bytes
            // 0x28 = 40
            mstore(
                add(clone, 0x28),
                0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000
            )

            /*
              |               20 bytes               |                 20 bytes              |           15 bytes          |
            0x3d602d80600a3d3981f3363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3
            */
            // crear un contrato nuevo
            // enviar 0 Ether
            // el código comienza en el puntero almacenado en "clone"
            // el tamaño del código es 0x37 (55 bytes)
            result := create(0, clone, 0x37)
         }
    }
}
```
