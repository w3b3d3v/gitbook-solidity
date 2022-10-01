# Visibilidade

Funções e variáveis de estado têm que declarar se elas podem ser acessadas por outros contratos.

Funções podem ser declaradas como:

- `public` - qualquer contrato ou conta pode chamar
- `private` - só pode ser chamada dentro do contrato que define a função
- `internal`- só pode ser chamada dentro do contrato que herda uma função internal
- `external` - só outros contatos e contas podem chamá-la

Variáveis de estado podem ser declaradas como `public`, `private`, or `internal` mas não `external`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

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

## Experimente no Remix
- [Visibilidade.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEJhc2UgewogICAgLy8gRnVuY2FvIHByaXZhZGEgc28gcG9kZSBzZXIgY2hhbWFkYQogICAgLy8gLSBkZW50cm8gZGVzdGUgY29udHJhdG8KICAgIC8vIENvbnRyYXRvcyBxdWUgaGVyZGFtIGVzc2UgY29udHJhdG8gbmFvIHBvZGVtIGNoYW1hciBlc3NhIGZ1bmNhby4KICAgIGZ1bmN0aW9uIHByaXZhdGVGdW5jKCkgcHJpdmF0ZSBwdXJlIHJldHVybnMgKHN0cmluZyBtZW1vcnkpIHsKICAgICAgICByZXR1cm4gInByaXZhdGUgZnVuY3Rpb24gY2FsbGVkIjsKICAgIH0KCiAgICBmdW5jdGlvbiB0ZXN0UHJpdmF0ZUZ1bmMoKSBwdWJsaWMgcHVyZSByZXR1cm5zIChzdHJpbmcgbWVtb3J5KSB7CiAgICAgICAgcmV0dXJuIHByaXZhdGVGdW5jKCk7CiAgICB9CgogICAgLy8gRnVuY2FvIGludGVybmEgcG9kZSBzZXIgY2hhbWFkYQogICAgLy8gLSBkZW50cm8gZGVzc2UgY29udHJhdG8KICAgIC8vIC0gZGVudHJvIGRvcyBjb250cmF0b3MgcXVlIGhlcmRhbSBlc3NlIGNvbnRyYXRvCiAgICBmdW5jdGlvbiBpbnRlcm5hbEZ1bmMoKSBpbnRlcm5hbCBwdXJlIHJldHVybnMgKHN0cmluZyBtZW1vcnkpIHsKICAgICAgICByZXR1cm4gImludGVybmFsIGZ1bmN0aW9uIGNhbGxlZCI7CiAgICB9CgogICAgZnVuY3Rpb24gdGVzdEludGVybmFsRnVuYygpIHB1YmxpYyBwdXJlIHZpcnR1YWwgcmV0dXJucyAoc3RyaW5nIG1lbW9yeSkgewogICAgICAgIHJldHVybiBpbnRlcm5hbEZ1bmMoKTsKICAgIH0KCiAgICAvLyBGdW5jb2VzIHB1YmxpY2FzIHBvZGVtIHNlciBjaGFtYWRhcwogICAgLy8gLSBkZW50cm8gZGVzc2UgY29udHJhdG8KICAgIC8vIC0gZGVudHJvIGRlIGNvbnRyYXRvcyBxdWUgaGVyZGFtIGVzc2UgY29udHJhdG8KICAgIC8vIC0gcG9yIG91dHJvcyBjb250cmF0b3MgZSBjb250YXMKICAgIGZ1bmN0aW9uIHB1YmxpY0Z1bmMoKSBwdWJsaWMgcHVyZSByZXR1cm5zIChzdHJpbmcgbWVtb3J5KSB7CiAgICAgICAgcmV0dXJuICJwdWJsaWMgZnVuY3Rpb24gY2FsbGVkIjsKICAgIH0KCiAgICAvLyBGdW5jb2VzIGV4dGVybmFzIHNvIHBvZGVtIHNlciBjaGFtYWRhcwogICAgLy8gLSBwb3Igb3V0cm9zIGNvbnRyYXRvcyBlIGNvbnRhcwogICAgZnVuY3Rpb24gZXh0ZXJuYWxGdW5jKCkgZXh0ZXJuYWwgcHVyZSByZXR1cm5zIChzdHJpbmcgbWVtb3J5KSB7CiAgICAgICAgcmV0dXJuICJleHRlcm5hbCBmdW5jdGlvbiBjYWxsZWQiOwogICAgfQoKICAgIC8vIEVzdGEgZnVuY2FvIG5hbyBjb21waWxhcmEgamEgcXVlIGVzdGFtb3MgdGVudGFuZG8gY2hhbWFyCiAgICAvLyB1bWEgZnVuY2FvIGV4dGVybmEgYXF1aS4KICAgIC8vIGZ1bmN0aW9uIHRlc3RFeHRlcm5hbEZ1bmMoKSBwdWJsaWMgcHVyZSByZXR1cm5zIChzdHJpbmcgbWVtb3J5KSB7CiAgICAvLyAgICAgcmV0dXJuIGV4dGVybmFsRnVuYygpOwogICAgLy8gfQoKICAgIC8vIFZhcmlhdmVpcyBkZSBlc3RhZG8KICAgIHN0cmluZyBwcml2YXRlIHByaXZhdGVWYXIgPSAibXkgcHJpdmF0ZSB2YXJpYWJsZSI7CiAgICBzdHJpbmcgaW50ZXJuYWwgaW50ZXJuYWxWYXIgPSAibXkgaW50ZXJuYWwgdmFyaWFibGUiOwogICAgc3RyaW5nIHB1YmxpYyBwdWJsaWNWYXIgPSAibXkgcHVibGljIHZhcmlhYmxlIjsKICAgIC8vIFZhcmlhdmVpcyBkZSBlc3RhZG8gbmFvIHBvZGVtIHNlciBleHRlcm5hcywgZW50YW8gZXNzZSBjb2RpZ28gbmFvIGNvbXBpbGFyYS4KICAgIC8vIHN0cmluZyBleHRlcm5hbCBleHRlcm5hbFZhciA9ICJteSBleHRlcm5hbCB2YXJpYWJsZSI7Cn0KCmNvbnRyYWN0IENoaWxkIGlzIEJhc2UgewogICAgLy8gQ29udHJhdG9zIGhlcmRhZG9zIG5hbyB0ZW0gYWNlc3NvIGEgZnVuY29lcyBwcml2YWRhcwogICAgLy8gZSB2YXJpYXZlaXMgZGUgZXN0YWRvLgogICAgLy8gZnVuY3Rpb24gdGVzdFByaXZhdGVGdW5jKCkgcHVibGljIHB1cmUgcmV0dXJucyAoc3RyaW5nIG1lbW9yeSkgewogICAgLy8gICAgIHJldHVybiBwcml2YXRlRnVuYygpOwogICAgLy8gfQoKICAgIC8vIEZ1bmNhbyBpbnRlcm5hIHBvZGUgc2VyIGNoYW1hZGEgZGVudHJvIGRlIGNvbnRyYXRvcyBkZSBjbGFzc2UgZmlsaG8uCiAgICBmdW5jdGlvbiB0ZXN0SW50ZXJuYWxGdW5jKCkgcHVibGljIHB1cmUgb3ZlcnJpZGUgcmV0dXJucyAoc3RyaW5nIG1lbW9yeSkgewogICAgICAgIHJldHVybiBpbnRlcm5hbEZ1bmMoKTsKICAgIH0KfQ==)