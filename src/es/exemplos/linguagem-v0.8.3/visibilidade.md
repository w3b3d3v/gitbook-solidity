# Visibilidad

Las funciones y variables de estado tienen que declarar si son accesibles por otros contratos.

Funciones pueden ser declaradas como:

* `public` - cualquier contrato o cuenta puede llamar / invocar
* `private` - solo puede ser llamada dentro del contrato que define la función
* `internal`- solo puede ser llamada dentro del contrato que hereda una función `internal`
* `external` - solo otros contratos y cuentas pueden llamar / invocar

Variables de estado pueden ser declaradas como `public`, `private`, o `internal` pero no `external`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Base {
    // Una función privada solo puede ser llamada
    // - dentro de este contrato
    // Contratos que heredan este contrato no pueden invocar esta función.
    function privateFunc() private pure returns (string memory) {
        return "private function called";
    }

    function testPrivateFunc() public pure returns (string memory) {
        return privateFunc();
    }

    // Funciones internas pueden ser llamadas
    // - dentro de este contrato
    // - dentro de los contratos que heredan este contrato
    function internalFunc() internal pure returns (string memory) {
        return "internal function called";
    }

    function testInternalFunc() public pure virtual returns (string memory) {
        return internalFunc();
    }

    // Funciones públicas pueden ser llamadas
    // - dentro de este contrato
    // - dentro de contratos que heredan este contrato
    // - por otros contratos y cuentas
    function publicFunc() public pure returns (string memory) {
        return "public function called";
    }

    // Funciones externas solo pueden ser llamadas
    // - por otros contratos y cuentas
    function externalFunc() external pure returns (string memory) {
        return "external function called";
    }

    // La siguiente función no compilará ya que estamos intentando invocar
    // a una función externa.
    // function testExternalFunc() public pure returns (string memory) {
    //     return externalFunc();
    // }

    // Variables de estado
    string private privateVar = "my private variable";
    string internal internalVar = "my internal variable";
    string public publicVar = "my public variable";
    // Variables de estado no pueden ser externas, por lo tanto el siguiente código no compilará.
    // string external externalVar = "my external variable";
}

contract Child is Base {
    // Contratos heredados no tienen acceso a las funciones privadas
    // ni a variables de estado.
    // function testPrivateFunc() public pure returns (string memory) {
    //     return privateFunc();
    // }

    // Funciones internas pueden ser llamada dentro de contratos hijos.
    function testInternalFunc() public pure override returns (string memory) {
        return internalFunc();
    }
}
```
