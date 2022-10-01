# Visibilidade

Funções e variáveis de estado têm que declarar se elas podem ser acessadas por outros contratos.

Funções podem ser declaradas como:

* `public` -  qualquer contrato ou conta pode chamar
* `private` - só pode ser chamada dentro do contrato que define a função
* `internal`- só pode ser chamada dentro do contrato que herda uma função internal
* `external` - só outros contatos e contas podem chamá-la

Variáveis de estado podem ser declaradas como `public`, `private`, or `internal` mas não `external`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Base {
    // Função privada só pode ser chamada
    // - dentro deste contrato
    // Contratos que herdam esse contrato não podem chamar essa função.
    function privateFunc() private pure returns (string memory) {
        return "private function called";
    }

    function testPrivateFunc() public pure returns (string memory) {
        return privateFunc();
    }

    // Função interna pode ser chamada
    // - dentro desse contrato
    // - dentro dos contratos que herdam esse contrato
    function internalFunc() internal pure returns (string memory) {
        return "internal function called";
    }

    function testInternalFunc() public pure virtual returns (string memory) {
        return internalFunc();
    }

    // Funções públicas podem ser chamadas
    // - dentro desse contrato
    // - dentro de contratos que herdam esse contrato
    // - por outros contratos e contas
    function publicFunc() public pure returns (string memory) {
        return "public function called";
    }

    // Funções externas só podem ser chamadas
    // - por outros contratos e contas
    function externalFunc() external pure returns (string memory) {
        return "external function called";
    }

    // Esta função não compilará já que estamos tentando chamar
    // uma função externa aqui.
    // function testExternalFunc() public pure returns (string memory) {
    //     return externalFunc();
    // }

    // Variáveis de estado
    string private privateVar = "my private variable";
    string internal internalVar = "my internal variable";
    string public publicVar = "my public variable";
    // Variáveis de estado não podem ser externas, então esse código não compilará.
    // string external externalVar = "my external variable";
}

contract Child is Base {
    // Contratos herdados não têm acesso a funções privadas
    // e variáveis de estado.
    // function testPrivateFunc() public pure returns (string memory) {
    //     return privateFunc();
    // }

    // Função interna pode ser chamada dentro de contratos de classe filho.
    function testInternalFunc() public pure override returns (string memory) {
        return internalFunc();
    }
}
```
