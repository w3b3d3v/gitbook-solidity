# Enum

Solidity soporta enumerables, estos son útiles para modelos con opciones y mantiene un seguimiento del estado.

Enums pueden ser declarados afuera del contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Enum {
    // Enum representando el status de envío
    enum Status {
        Pending,
        Shipped,
        Accepted,
        Rejected,
        Canceled
    }

    // El valor por defecto es el primer elemento listado en
    // la definición del tipo, en este caso "Pending"
    Status public status;

    // Devuelve uint
    // Pending  - 0
    // Shipped  - 1
    // Accepted - 2
    // Rejected - 3
    // Canceled - 4
    function get() public view returns (Status) {
        return status;
    }

    // Actualiza el status pasando uint como entrada
    function set(Status _status) public {
        status = _status;
    }

    // Puede actualizar a un enum específico así
    function cancel() public {
        status = Status.Canceled;
    }

    // delete reinicia el enum a su primer valor, 0
    function reset() public {
        delete status;
    }
}
```

#### Declarando e Importando Enum <a href="#declaring-and-importing-enum" id="declaring-and-importing-enum"></a>

Archivo donde el enum está declarado

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
// Está guardado como 'EnumDeclaration.sol'

enum Status {
    Pending,
    Shipped,
    Accepted,
    Rejected,
    Canceled
}
```

Archivo que importa el enum de arriba

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./EnumDeclaration.sol";

contract Enum {
    Status public status;
}
```
