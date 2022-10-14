# Erro

Um erro desfaz todas as alterações feitas no estado durante uma transação.

Você pode lançar um erro chamando `require`, `revert` ou `assert`.

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
    error InsufficientBalance(uint saldo, uint retirarQuantidade);

    function testCustomError(uint _retirarQuantidade) public view {
        uint bal = address(this).balance;
        if (bal < _retirarQuantidade) {
            revert InsufficientBalance({saldo: bal, retirarQuantidade: _retirarQuantidade});
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
        uint saldoAntigo = saldo;
        uint saldoNovo = saldo + _quantidade;

        // saldo + _quantidade não entra em condição de overflow se saldo + _quantidade >= saldo
        require(saldoNovo >= saldoAntigo, "Overflow");

        saldo = saldoNovo;

        assert(saldo >= saldoAntigo);
    }

    function withdraw(uint _quantidade) public {
        uint saldoAntigo = saldo;

        // saldo - _quantidade não entra em condição de underflow se saldo >= _quantidade
        require(saldo >= _quantidade, "Underflow");

        if (saldo < _quantidade) {
            revert("Underflow");
        }

        saldo -= _quantidade;

        assert(saldo <= saldoAntigo);
    }
}
```

## Teste no Remix

[Erro.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEVycm8gewogICAgZnVuY3Rpb24gdGVzdFJlcXVpcmUodWludCBfaSkgcHVibGljIHB1cmUgewogICAgICAgIC8vIFJlcXVpcmUgZGV2ZSBzZXIgdXNhZG8gcGFyYSB2YWxpZGFyIGNvbmRpY29lcyBjb21vOgogICAgICAgIC8vIC0gZW50cmFkYXMKICAgICAgICAvLyAtIGNvbmRpY29lcyBhbnRlcmlvcmVzIGEgZXhlY3VjYW8KICAgICAgICAvLyAtIHJldG9ybmFyIHZhbG9yZXMgZGUgY2hhbWFkYXMgcGFyYSBvdXRyYXMgZnVuY29lcwogICAgICAgIHJlcXVpcmUoX2kgPiAxMCwgIkEgZW50cmFkYSBkZXZlIHNlciBtYWlvciBxdWUgMTAiKTsKICAgIH0KCiAgICBmdW5jdGlvbiB0ZXN0UmV2ZXJ0KHVpbnQgX2kpIHB1YmxpYyBwdXJlIHsKICAgICAgICAvLyBSZXZlcnQgZSB1dGlsIHF1YW5kbyBhIGNvbmRpY2FvIGEgc2VyIHZlcmlmaWNhZGEgZSBjb21wbGV4YS4KICAgICAgICAvLyBFc3NlIGNvZGlnbyBmYXogZXhhdGFtZW50ZSBhIG1lc21hIGNvaXNhIHF1ZSBvIGV4ZW1wbG8gYWNpbWEKICAgICAgICBpZiAoX2kgPD0gMTApIHsKICAgICAgICAgICAgcmV2ZXJ0KCJBIGVudHJhZGEgZGV2ZSBzZXIgbWFpb3IgcXVlIDEwIik7CiAgICAgICAgfQogICAgfQoKICAgIHVpbnQgcHVibGljIG51bTsKCiAgICBmdW5jdGlvbiB0ZXN0QXNzZXJ0KCkgcHVibGljIHZpZXcgewogICAgICAgIC8vIEFzc2VydCBzb21lbnRlIGRldmUgc2VyIHVzYWRhIHBhcmEgdGVzdGFyIGVycm9zIGludGVybm9zLAogICAgICAgIC8vIGUgcGFyYSBjaGVjYXIgaW52YXJpYW50ZXMuCgogICAgICAgIC8vIEFxdWkgbm9zIGFmaXJtYW1vcyBxdWUgbnVtIGUgc2VtcHJlIGlndWFsIGEgMAogICAgICAgIC8vIGphIHF1ZSBlIGltcG9zc2l2ZWwgYXR1YWxpemFyIG8gdmFsb3IgZGUgbnVtCiAgICAgICAgYXNzZXJ0KG51bSA9PSAwKTsKICAgIH0KCiAgICAvLyBlcnJvIHBlcnNvbmFsaXphZG8KICAgIGVycm9yIEluc3VmZmljaWVudEJhbGFuY2UodWludCBzYWxkbywgdWludCByZXRpcmFyUXVhbnRpZGFkZSk7CgogICAgZnVuY3Rpb24gdGVzdEN1c3RvbUVycm9yKHVpbnQgX3JldGlyYXJRdWFudGlkYWRlKSBwdWJsaWMgdmlldyB7CiAgICAgICAgdWludCBiYWwgPSBhZGRyZXNzKHRoaXMpLmJhbGFuY2U7CiAgICAgICAgaWYgKGJhbCA8IF9yZXRpcmFyUXVhbnRpZGFkZSkgewogICAgICAgICAgICByZXZlcnQgSW5zdWZmaWNpZW50QmFsYW5jZSh7c2FsZG86IGJhbCwgcmV0aXJhclF1YW50aWRhZGU6IF9yZXRpcmFyUXVhbnRpZGFkZX0pOwogICAgICAgIH0KICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)

[Conta.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IENvbnRhIHsKICAgIHVpbnQgcHVibGljIHNhbGRvOwogICAgdWludCBwdWJsaWMgY29uc3RhbnQgTUFYX1VJTlQgPSAyKioyNTYgLSAxOwoKICAgIGZ1bmN0aW9uIGRlcG9zaXQodWludCBfcXVhbnRpZGFkZSkgcHVibGljIHsKICAgICAgICB1aW50IHNhbGRvQW50aWdvID0gc2FsZG87CiAgICAgICAgdWludCBzYWxkb05vdm8gPSBzYWxkbyArIF9xdWFudGlkYWRlOwoKICAgICAgICAvLyBzYWxkbyArIF9xdWFudGlkYWRlIG5hbyBlbnRyYSBlbSBjb25kaWNhbyBkZSBvdmVyZmxvdyBzZSBzYWxkbyArIF9xdWFudGlkYWRlID49IHNhbGRvCiAgICAgICAgcmVxdWlyZShzYWxkb05vdm8gPj0gc2FsZG9BbnRpZ28sICJPdmVyZmxvdyIpOwoKICAgICAgICBzYWxkbyA9IHNhbGRvTm92bzsKCiAgICAgICAgYXNzZXJ0KHNhbGRvID49IHNhbGRvQW50aWdvKTsKICAgIH0KCiAgICBmdW5jdGlvbiB3aXRoZHJhdyh1aW50IF9xdWFudGlkYWRlKSBwdWJsaWMgewogICAgICAgIHVpbnQgc2FsZG9BbnRpZ28gPSBzYWxkbzsKCiAgICAgICAgLy8gc2FsZG8gLSBfcXVhbnRpZGFkZSBuYW8gZW50cmEgZW0gY29uZGljYW8gZGUgdW5kZXJmbG93IHNlIHNhbGRvID49IF9xdWFudGlkYWRlCiAgICAgICAgcmVxdWlyZShzYWxkbyA+PSBfcXVhbnRpZGFkZSwgIlVuZGVyZmxvdyIpOwoKICAgICAgICBpZiAoc2FsZG8gPCBfcXVhbnRpZGFkZSkgewogICAgICAgICAgICByZXZlcnQoIlVuZGVyZmxvdyIpOwogICAgICAgIH0KCiAgICAgICAgc2FsZG8gLT0gX3F1YW50aWRhZGU7CgogICAgICAgIGFzc2VydChzYWxkbyA8PSBzYWxkb0FudGlnbyk7CiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)
