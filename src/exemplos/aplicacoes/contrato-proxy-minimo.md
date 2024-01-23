# Contrato Proxy Mínimo

Se você tem um contrato que será implantado várias vezes, use o contrato de proxy mínimo para implantá-los de forma econômica.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// código original
// https://github.com/optionality/clone-factory/blob/master/contracts/CloneFactory.sol

contract MinimalProxy {
    function clone(address target) external returns (address result) {
        // converte o endereço para 20 bytes
        bytes20 targetBytes = bytes20(target);

        // código real //
        // 3d602d80600a3d3981f3363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3

        // criação do código //
        // copia o código do tempo de execução na memória e retorna esse código
        // 3d602d80600a3d3981f3

        // código em tempo de execução //
        // código para delegatecall para endereço
        // 363d3d373d3d3d363d73 address 5af43d82803e903d91602b57fd5bf3

        assembly {
            /*
            Lê os 32 bytes da memória começando no ponteiro armazenado em 0x40

            No solidity, o slot 0x40 na memória é especial: ele contém o "ponteiro de memória livre"
            que aponta para o fim da memória corrente alocada.
            */
            let clone := mload(0x40)
            // armazena 32 bytes de memória começando pelo "clone"
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
            // armazena 32 bytes de memória iniciando pelo "clone" + 20 bytes
            // 0x14 = 20
            mstore(add(clone, 0x14), targetBytes)

            /*
              |               20 bytes               |                 20 bytes              |
            0x3d602d80600a3d3981f3363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe
                                                                                              ^
                                                                                              pointer
            */
            // armazena 32 bytes de memória iniciando pelo "clone" + 40 bytes
            // 0x28 = 40
            mstore(
                add(clone, 0x28),
                0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000
            )

            /*
              |               20 bytes               |                 20 bytes              |           15 bytes          |
            0x3d602d80600a3d3981f3363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3
            */
            // cria novo contrato
            // envia 0 Ether
            // código começa pelo ponteiro armazenado no "clone"
            // tamanho do código 0x37 (55 bytes)
            result := create(0, clone, 0x37)
        }
    }
}
```

## Teste no Remix

- [MinimalProxy.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCi8vIGNvZGlnbyBvcmlnaW5hbAovLyBodHRwczovL2dpdGh1Yi5jb20vb3B0aW9uYWxpdHkvY2xvbmUtZmFjdG9yeS9ibG9iL21hc3Rlci9jb250cmFjdHMvQ2xvbmVGYWN0b3J5LnNvbAoKY29udHJhY3QgTWluaW1hbFByb3h5IHsKICAgIGZ1bmN0aW9uIGNsb25lKGFkZHJlc3MgdGFyZ2V0KSBleHRlcm5hbCByZXR1cm5zIChhZGRyZXNzIHJlc3VsdCkgewogICAgICAgIC8vIGNvbnZlcnRlIG8gZW5kZXJlY28gcGFyYSAyMCBieXRlcwogICAgICAgIGJ5dGVzMjAgdGFyZ2V0Qnl0ZXMgPSBieXRlczIwKHRhcmdldCk7CgogICAgICAgIC8vIGNvZGlnbyByZWFsIC8vCiAgICAgICAgLy8gM2Q2MDJkODA2MDBhM2QzOTgxZjMzNjNkM2QzNzNkM2QzZDM2M2Q3M2JlYmViZWJlYmViZWJlYmViZWJlYmViZWJlYmViZWJlYmViZWJlYmU1YWY0M2Q4MjgwM2U5MDNkOTE2MDJiNTdmZDViZjMKCiAgICAgICAgLy8gY3JpYWNhbyBkbyBjb2RpZ28gLy8KICAgICAgICAvLyBjb3BpYSBvIGNvZGlnbyBkbyB0ZW1wbyBkZSBleGVjdWNhbyBuYSBtZW1vcmlhIGUgcmV0b3JuYSBlc3NlIGNvZGlnbwogICAgICAgIC8vIDNkNjAyZDgwNjAwYTNkMzk4MWYzCgogICAgICAgIC8vIGNvZGlnbyBlbSB0ZW1wbyBkZSBleGVjdWNhbyAvLwogICAgICAgIC8vIGNvZGlnbyBwYXJhIGRlbGVnYXRlY2FsbCBwYXJhIGVuZGVyZWNvCiAgICAgICAgLy8gMzYzZDNkMzczZDNkM2QzNjNkNzMgYWRkcmVzcyA1YWY0M2Q4MjgwM2U5MDNkOTE2MDJiNTdmZDViZjMKCiAgICAgICAgYXNzZW1ibHkgewogICAgICAgICAgICAvKgogICAgICAgICAgICBMZSBvcyAzMiBieXRlcyBkYSBtZW1vcmlhIGNvbWVjYW5kbyBubyBwb250ZWlybyBhcm1hemVuYWRvIGVtIDB4NDAKCiAgICAgICAgICAgIE5vIHNvbGlkaXR5LCBvIHNsb3QgMHg0MCBuYSBtZW1vcmlhIGUgZXNwZWNpYWw6IGVsZSBjb250ZW0gbyAicG9udGVpcm8gZGUgbWVtb3JpYSBsaXZyZSIKICAgICAgICAgICAgcXVlIGFwb250YSBwYXJhIG8gZmltIGRhIG1lbW9yaWEgY29ycmVudGUgYWxvY2FkYS4KICAgICAgICAgICAgKi8KICAgICAgICAgICAgbGV0IGNsb25lIDo9IG1sb2FkKDB4NDApCiAgICAgICAgICAgIC8vIGFybWF6ZW5hIDMyIGJ5dGVzIGRlIG1lbW9yaWEgY29tZWNhbmRvIHBlbG8gImNsb25lIgogICAgICAgICAgICBtc3RvcmUoCiAgICAgICAgICAgICAgICBjbG9uZSwKICAgICAgICAgICAgICAgIDB4M2Q2MDJkODA2MDBhM2QzOTgxZjMzNjNkM2QzNzNkM2QzZDM2M2Q3MzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAogICAgICAgICAgICApCgogICAgICAgICAgICAvKgogICAgICAgICAgICAgIHwgICAgICAgICAgICAgIDIwIGJ5dGVzICAgICAgICAgICAgICAgIHwKICAgICAgICAgICAgMHgzZDYwMmQ4MDYwMGEzZDM5ODFmMzM2M2QzZDM3M2QzZDNkMzYzZDczMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlcgogICAgICAgICAgICAqLwogICAgICAgICAgICAvLyBhcm1hemVuYSAzMiBieXRlcyBkZSBtZW1vcmlhIGluaWNpYW5kbyBwZWxvICJjbG9uZSIgKyAyMCBieXRlcwogICAgICAgICAgICAvLyAweDE0ID0gMjAKICAgICAgICAgICAgbXN0b3JlKGFkZChjbG9uZSwgMHgxNCksIHRhcmdldEJ5dGVzKQoKICAgICAgICAgICAgLyoKICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgMjAgYnl0ZXMgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAyMCBieXRlcyAgICAgICAgICAgICAgfAogICAgICAgICAgICAweDNkNjAyZDgwNjAwYTNkMzk4MWYzMzYzZDNkMzczZDNkM2QzNjNkNzNiZWJlYmViZWJlYmViZWJlYmViZWJlYmViZWJlYmViZWJlYmViZWJlCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBeCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVyCiAgICAgICAgICAgICovCiAgICAgICAgICAgIC8vIGFybWF6ZW5hIDMyIGJ5dGVzIGRlIG1lbW9yaWEgaW5pY2lhbmRvIHBlbG8gImNsb25lIiArIDQwIGJ5dGVzCiAgICAgICAgICAgIC8vIDB4MjggPSA0MAogICAgICAgICAgICBtc3RvcmUoCiAgICAgICAgICAgICAgICBhZGQoY2xvbmUsIDB4MjgpLAogICAgICAgICAgICAgICAgMHg1YWY0M2Q4MjgwM2U5MDNkOTE2MDJiNTdmZDViZjMwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwCiAgICAgICAgICAgICkKCiAgICAgICAgICAgIC8qCiAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgIDIwIGJ5dGVzICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgMjAgYnl0ZXMgICAgICAgICAgICAgIHwgICAgICAgICAgIDE1IGJ5dGVzICAgICAgICAgIHwKICAgICAgICAgICAgMHgzZDYwMmQ4MDYwMGEzZDM5ODFmMzM2M2QzZDM3M2QzZDNkMzYzZDczYmViZWJlYmViZWJlYmViZWJlYmViZWJlYmViZWJlYmViZWJlYmViZTVhZjQzZDgyODAzZTkwM2Q5MTYwMmI1N2ZkNWJmMwogICAgICAgICAgICAqLwogICAgICAgICAgICAvLyBjcmlhIG5vdm8gY29udHJhdG8KICAgICAgICAgICAgLy8gZW52aWEgMCBFdGhlcgogICAgICAgICAgICAvLyBjb2RpZ28gY29tZWNhIHBlbG8gcG9udGVpcm8gYXJtYXplbmFkbyBubyAiY2xvbmUiCiAgICAgICAgICAgIC8vIHRhbWFuaG8gZG8gY29kaWdvIDB4MzcgKDU1IGJ5dGVzKQogICAgICAgICAgICByZXN1bHQgOj0gY3JlYXRlKDAsIGNsb25lLCAweDM3KQogICAgICAgIH0KICAgIH0KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
