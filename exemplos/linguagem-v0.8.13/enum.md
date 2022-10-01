# Enum

Solidity suporta enumeráveis e eles são úteis para escolha do modelo e mantêm o controle do estado.

Enums podem ser declarados fora do contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Enum {
    // Enum representando status de envio
    enum Status {
        Pendente,
        Enviado,
        Aceitaram,
        Rejeitado,
        Cancelado
    }

    // Valor padrão é o primeiro elemento listado na
    // definição do tipo, nesse caso "Pendente"
    Status public status;

    // Retorna uint
    // Pendente  - 0
    // Enviado  - 1
    // Aceito - 2
    // Recusado - 3
    // Cancelado - 4
    function get() public view returns (Status) {
        return status;
    }

    // Atualiza status passando uint como parametro
    function set(Status _status) public {
        status = _status;
    }

    // Você pode atualizar para um enum específico
    function cancel() public {
        status = Status.Canceled;
    }

    // delete reinicia o enum para seu primeiro valor, 0
    function reset() public {
        delete status;
    }
}
```

#### Declarando e Importando Enum <a href="#declaring-and-importing-enum" id="declaring-and-importing-enum"></a>

Arquivo no qual o enum é declarado

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
// É salvo como 'EnumDeclaration.sol'

enum Status {
    Pendente,
    Enviado,
    Aceitaram,
    Rejeitado,
    Cancelado
}
```

Arquivo que importa o enum acima

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./EnumDeclaration.sol";

contract Enum {
    Status public status;
}
```

## Experimente no Remix

- [Imutavel.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4zOwoKY29udHJhY3QgRW51bSB7CiAgICAvLyBFbnVtIHJlcHJlc2VudGFuZG8gc3RhdHVzIGRlIGVudmlvCiAgICBlbnVtIFN0YXR1cyB7CiAgICAgICAgUGVuZGVudGUsCiAgICAgICAgRW52aWFkbywKICAgICAgICBBY2VpdGFyYW0sCiAgICAgICAgUmVqZWl0YWRvLAogICAgICAgIENhbmNlbGFkbwogICAgfQoKICAgIC8vIFZhbG9yIHBhZHJhbyBlIG8gcHJpbWVpcm8gZWxlbWVudG8gbGlzdGFkbyBuYQogICAgLy8gZGVmaW5pY2FvIGRvIHRpcG8sIG5lc3NlIGNhc28gXCJQZW5kZW50ZVwiCiAgICBTdGF0dXMgcHVibGljIHN0YXR1czsKCiAgICAvLyBSZXRvcm5hIHVpbnQKICAgIC8vIFBlbmRlbnRlICAtIDAKICAgIC8vIEVudmlhZG8gIC0gMQogICAgLy8gQWNlaXRvIC0gMgogICAgLy8gUmVjdXNhZG8gLSAzCiAgICAvLyBDYW5jZWxhZG8gLSA0CiAgICBmdW5jdGlvbiBnZXQoKSBwdWJsaWMgdmlldyByZXR1cm5zIChTdGF0dXMpIHsKICAgICAgICByZXR1cm4gc3RhdHVzOwogICAgfQoKICAgIC8vIEF0dWFsaXphIHN0YXR1cyBwYXNzYW5kbyB1aW50IGNvbW8gcGFyYW1ldHJvCiAgICBmdW5jdGlvbiBzZXQoU3RhdHVzIF9zdGF0dXMpIHB1YmxpYyB7CiAgICAgICAgc3RhdHVzID0gX3N0YXR1czsKICAgIH0KCiAgICAvLyBWb2NlIHBvZGUgYXR1YWxpemFyIHBhcmEgdW0gZW51bSBlc3BlY2lmaWNvCiAgICBmdW5jdGlvbiBjYW5jZWwoKSBwdWJsaWMgewogICAgICAgIHN0YXR1cyA9IFN0YXR1cy5DYW5jZWxlZDsKICAgIH0KCiAgICAvLyBkZWxldGUgcmVpbmljaWEgbyBlbnVtIHBhcmEgc2V1IHByaW1laXJvIHZhbG9yLCAwCiAgICBmdW5jdGlvbiByZXNldCgpIHB1YmxpYyB7CiAgICAgICAgZGVsZXRlIHN0YXR1czsKICAgIH0KfQ==)
- [EnumDeclaration.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4zOwovLyBFIHNhbHZvIGNvbW8gXCdFbnVtRGVjbGFyYXRpb24uc29sXCcKCmVudW0gU3RhdHVzIHsKICAgIFBlbmRlbnRlLAogICAgRW52aWFkbywKICAgIEFjZWl0YXJhbSwKICAgIFJlamVpdGFkbywKICAgIENhbmNlbGFkbwp9)
- [EnumImport.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4zOwoKaW1wb3J0IFwiLi9FbnVtRGVjbGFyYXRpb24uc29sXCI7Cgpjb250cmFjdCBFbnVtIHsKICAgIFN0YXR1cyBwdWJsaWMgc3RhdHVzOwp9)
