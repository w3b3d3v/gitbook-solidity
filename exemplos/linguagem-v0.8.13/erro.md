# Erro

Um erro desfaz todas as alterações feitas no estado durante uma transação.

Você pode lançar um erro chamando `require`, `revert` or `assert`.

- `require` é usado para validar entradas e condições antes da execução.
- `revert` é semelhante a `require`. Veja o código abaixo para detalhes.
- `assert` é usado para checar se existe código que nunca deve ser falso. Afirmação falha provavelmente significa que existe um bug.

Use erro personalizado para economizar gás.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Erro {
    function testRequire(uint _i) public pure {
        // Require deve ser usado para validar condições como:
        // - entradas
        // - condições anteriores à execução
        // - retornar valores de chamadas para outras funções
        require(_i > 10, "A entrada deve ser maior que 10");
    }

    function testRevert(uint _i) public pure {
        // Revert é útil quando a condição a ser verificada é complexa.
        // Esse código faz exatamente a mesma coisa que o exemplo acima
        if (_i <= 10) {
            revert("A entrada deve ser maior que 10");
        }
    }

    uint public num;

    function testAssert() public view {
        // Assert somente deve ser usada para testar erros internos,
        // e para checar invariantes.

        // Aqui nós afirmamos que num é sempre igual a 0
        // já que é impossível atualizar o valor de num
        assert(num == 0);
    }

    // erro personalizado
    error InsufficientBalance(uint saldo, uint withdrawAmount);

    function testCustomError(uint _withdrawAmount) public view {
        uint bal = address(this).saldo;
        if (bal < _withdrawAmount) {
            revert InsufficientBalance({saldo: bal, withdrawAmount: _withdrawAmount});
        }
    }
}
```

Aqui está outro exemplo

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Conta {
    uint public saldo;
    uint public constant MAX_UINT = 2**256 - 1;

    function deposit(uint _quantidade) public {
        uint oldBalance = saldo;
        uint newBalance = saldo + _quantidade;

        // saldo + _quantidade não entra em condição de overflow se saldo + _quantidade >= saldo
        require(newBalance >= oldBalance, "Overflow");

        saldo = newBalance;

        assert(saldo >= oldBalance);
    }

    function withdraw(uint _quantidade) public {
        uint oldBalance = saldo;

        // saldo - _quantidade não entra em condição de underflow se saldo >= _quantidade
        require(saldo >= _quantidade, "Underflow");

        if (saldo < _quantidade) {
            revert("Underflow");
        }

        saldo -= _quantidade;

        assert(saldo <= oldBalance);
    }
}
```

## Teste no Remix

[Erro.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEVycm8gewogICAgZnVuY3Rpb24gdGVzdFJlcXVpcmUodWludCBfaSkgcHVibGljIHB1cmUgewogICAgICAgIC8vIFJlcXVpcmUgZGV2ZSBzZXIgdXNhZG8gcGFyYSB2YWxpZGFyIGNvbmRpY29lcyBjb21vOgogICAgICAgIC8vIC0gZW50cmFkYXMKICAgICAgICAvLyAtIGNvbmRpY29lcyBhbnRlcmlvcmVzIGEgZXhlY3VjYW8KICAgICAgICAvLyAtIHJldG9ybmFyIHZhbG9yZXMgZGUgY2hhbWFkYXMgcGFyYSBvdXRyYXMgZnVuY29lcwogICAgICAgIHJlcXVpcmUoX2kgPiAxMCwgXCJBIGVudHJhZGEgZGV2ZSBzZXIgbWFpb3IgcXVlIDEwXCIpOwogICAgfQoKICAgIGZ1bmN0aW9uIHRlc3RSZXZlcnQodWludCBfaSkgcHVibGljIHB1cmUgewogICAgICAgIC8vIFJldmVydCBlIHV0aWwgcXVhbmRvIGEgY29uZGljYW8gYSBzZXIgdmVyaWZpY2FkYSBlIGNvbXBsZXhhLgogICAgICAgIC8vIEVzc2UgY29kaWdvIGZheiBleGF0YW1lbnRlIGEgbWVzbWEgY29pc2EgcXVlIG8gZXhlbXBsbyBhY2ltYQogICAgICAgIGlmIChfaSA8PSAxMCkgewogICAgICAgICAgICByZXZlcnQoXCJBIGVudHJhZGEgZGV2ZSBzZXIgbWFpb3IgcXVlIDEwXCIpOwogICAgICAgIH0KICAgIH0KCiAgICB1aW50IHB1YmxpYyBudW07CgogICAgZnVuY3Rpb24gdGVzdEFzc2VydCgpIHB1YmxpYyB2aWV3IHsKICAgICAgICAvLyBBc3NlcnQgc29tZW50ZSBkZXZlIHNlciB1c2FkYSBwYXJhIHRlc3RhciBlcnJvcyBpbnRlcm5vcywKICAgICAgICAvLyBlIHBhcmEgY2hlY2FyIGludmFyaWFudGVzLgoKICAgICAgICAvLyBBcXVpIG5vcyBhZmlybWFtb3MgcXVlIG51bSBlIHNlbXByZSBpZ3VhbCBhIDAKICAgICAgICAvLyBqYSBxdWUgZSBpbXBvc3NpdmVsIGF0dWFsaXphciBvIHZhbG9yIGRlIG51bQogICAgICAgIGFzc2VydChudW0gPT0gMCk7CiAgICB9CgogICAgLy8gZXJybyBwZXJzb25hbGl6YWRvCiAgICBlcnJvciBJbnN1ZmZpY2llbnRCYWxhbmNlKHVpbnQgc2FsZG8sIHVpbnQgd2l0aGRyYXdBbW91bnQpOwoKICAgIGZ1bmN0aW9uIHRlc3RDdXN0b21FcnJvcih1aW50IF93aXRoZHJhd0Ftb3VudCkgcHVibGljIHZpZXcgewogICAgICAgIHVpbnQgYmFsID0gYWRkcmVzcyh0aGlzKS5zYWxkbzsKICAgICAgICBpZiAoYmFsIDwgX3dpdGhkcmF3QW1vdW50KSB7CiAgICAgICAgICAgIHJldmVydCBJbnN1ZmZpY2llbnRCYWxhbmNlKHtzYWxkbzogYmFsLCB3aXRoZHJhd0Ftb3VudDogX3dpdGhkcmF3QW1vdW50fSk7CiAgICAgICAgfQogICAgfQp9)

[Conta.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IENvbnRhIHsKICAgIHVpbnQgcHVibGljIHNhbGRvOwogICAgdWludCBwdWJsaWMgY29uc3RhbnQgTUFYX1VJTlQgPSAyKioyNTYgLSAxOwoKICAgIGZ1bmN0aW9uIGRlcG9zaXQodWludCBfcXVhbnRpZGFkZSkgcHVibGljIHsKICAgICAgICB1aW50IG9sZEJhbGFuY2UgPSBzYWxkbzsKICAgICAgICB1aW50IG5ld0JhbGFuY2UgPSBzYWxkbyArIF9xdWFudGlkYWRlOwoKICAgICAgICAvLyBzYWxkbyArIF9xdWFudGlkYWRlIG5hbyBlbnRyYSBlbSBjb25kaWNhbyBkZSBvdmVyZmxvdyBzZSBzYWxkbyArIF9xdWFudGlkYWRlID49IHNhbGRvCiAgICAgICAgcmVxdWlyZShuZXdCYWxhbmNlID49IG9sZEJhbGFuY2UsIFwiT3ZlcmZsb3dcIik7CgogICAgICAgIHNhbGRvID0gbmV3QmFsYW5jZTsKCiAgICAgICAgYXNzZXJ0KHNhbGRvID49IG9sZEJhbGFuY2UpOwogICAgfQoKICAgIGZ1bmN0aW9uIHdpdGhkcmF3KHVpbnQgX3F1YW50aWRhZGUpIHB1YmxpYyB7CiAgICAgICAgdWludCBvbGRCYWxhbmNlID0gc2FsZG87CgogICAgICAgIC8vIHNhbGRvIC0gX3F1YW50aWRhZGUgbmFvIGVudHJhIGVtIGNvbmRpY2FvIGRlIHVuZGVyZmxvdyBzZSBzYWxkbyA+PSBfcXVhbnRpZGFkZQogICAgICAgIHJlcXVpcmUoc2FsZG8gPj0gX3F1YW50aWRhZGUsIFwiVW5kZXJmbG93XCIpOwoKICAgICAgICBpZiAoc2FsZG8gPCBfcXVhbnRpZGFkZSkgewogICAgICAgICAgICByZXZlcnQoXCJVbmRlcmZsb3dcIik7CiAgICAgICAgfQoKICAgICAgICBzYWxkbyAtPSBfcXVhbnRpZGFkZTsKCiAgICAgICAgYXNzZXJ0KHNhbGRvIDw9IG9sZEJhbGFuY2UpOwogICAgfQp9)
