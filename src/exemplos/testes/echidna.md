# Echidna

Exemplos de fuzzing com [Echidna](https://github.com/crytic/echidna).

1. Salve o contrato de solidity como `TestEchidna.sol`
2. Na pasta onde seu contrato está armazenado execute o seguinte comando.

```bash
docker run -it --rm -v $PWD:/code trailofbits/eth-security-toolbox
```

3. Veja os comentários abaixo e execute `echidna-test` comandos.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
echidna-test TestEchidna.sol --contract TestCounter
*/
contract Counter {
    uint public count;

    function inc() external {
        count += 1;
    }

    function dec() external {
        count -= 1;
    }
}

contract TestCounter is Counter {
    function echidna_test_true() public view returns (bool) {
        return true;
    }

    function echidna_test_false() public view returns (bool) {
        return false;
    }

    function echidna_test_count() public view returns (bool) {
      // Aqui estamos testando que Counter.count deve sempre ser <= 5.
      // O teste falhará. Echidna é inteligente o suficiente para chamar Counter.inc() mais
      // do que 5 vezes.
        return count <= 5;
    }
}

/*
echidna-test TestEchidna.sol --contract TestAssert --check-asserts
*/
contract TestAssert {
    // Asserts não detectadas em 0.8.
    // Muda para 0.7 para testar asserções

    function test_assert(uint _i) external {
        assert(_i < 10);
    }

    // Exemplo mais complexo
    function abs(uint x, uint y) private pure returns (uint) {
        if (x >= y) {
            return x - y;
        }
        return y - x;
    }

    function test_abs(uint x, uint y) external {
        uint z = abs(x, y);
        if (x >= y) {
            assert(z <= x);
        } else {
            assert(z <= y);
        }
    }
}
```

## Tempo de teste e remetente

Echidna pode fuzz timestamp. O intervalo do timestamp é definido na configuração. O padrão é 7 dias.

callers de contrato também podem ser definidos na configuração. As contas padrão são

- `0x10000`
- `0x20000`
- `0x00a329C0648769a73afAC7F9381e08fb43DBEA70`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

/*
docker run -it --rm -v $PWD:/code trailofbits/eth-security-toolbox
echidna-test EchidnaTestTimeAndCaller.sol --contract EchidnaTestTimeAndCaller
*/
contract EchidnaTestTimeAndCaller {
    bool private pass = true;
    uint private createdAt = block.timestamp;

    /*
      teste falhará se Echidna puder chamar setFail()
      teste vai passar caso contrário
    */
    function echidna_test_pass() public view returns (bool) {
        return pass;
    }

    function setFail() external {
        /*
          Echidna pode chamar esta função se delay <= max block delay
          Caso contrário, o Echidna não poderá chamar esta função.
          O atraso máximo do bloco pode ser estendido especificando-o em um arquivo de configuração.
        */
        uint delay = 7 days;
        require(block.timestamp >= createdAt + delay);
        pass = false;
    }

    // Remetentes padrão
    // Altere os endereços para ver o teste falhar
    address[3] private senders = [
        address(0x10000),
        address(0x20000),
        address(0x00a329C0648769a73afAC7F9381e08fb43DBEA70)
    ];

    address private sender = msg.sender;

    //Passe _sender como entrada e exija msg.sender == _sender
    //para ver _sender para exemplo de contador

    function setSender(address _sender) external {
        require(_sender == msg.sender);
        sender = msg.sender;
    }

    // Verifique os remetentes padrão. O remetente deve ser uma das 3 contas padrão.
    function echidna_test_sender() public view returns (bool) {
        for (uint i; i < 3; i++) {
            if (sender == senders[i]) {
                return true;
            }
        }
        return false;
    }
}
```
## Teste no Remix

- [EchidnaTestTimeAndCaller.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qCmVjaGlkbmEtdGVzdCBUZXN0RWNoaWRuYS5zb2wgLS1jb250cmFjdCBUZXN0Q291bnRlcgoqLwpjb250cmFjdCBDb3VudGVyIHsKICAgIHVpbnQgcHVibGljIGNvdW50OwoKICAgIGZ1bmN0aW9uIGluYygpIGV4dGVybmFsIHsKICAgICAgICBjb3VudCArPSAxOwogICAgfQoKICAgIGZ1bmN0aW9uIGRlYygpIGV4dGVybmFsIHsKICAgICAgICBjb3VudCAtPSAxOwogICAgfQp9Cgpjb250cmFjdCBUZXN0Q291bnRlciBpcyBDb3VudGVyIHsKICAgIGZ1bmN0aW9uIGVjaGlkbmFfdGVzdF90cnVlKCkgcHVibGljIHZpZXcgcmV0dXJucyAoYm9vbCkgewogICAgICAgIHJldHVybiB0cnVlOwogICAgfQoKICAgIGZ1bmN0aW9uIGVjaGlkbmFfdGVzdF9mYWxzZSgpIHB1YmxpYyB2aWV3IHJldHVybnMgKGJvb2wpIHsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICB9CgogICAgZnVuY3Rpb24gZWNoaWRuYV90ZXN0X2NvdW50KCkgcHVibGljIHZpZXcgcmV0dXJucyAoYm9vbCkgewogICAgICAvLyBBcXVpIGVzdGFtb3MgdGVzdGFuZG8gcXVlIENvdW50ZXIuY291bnQgZGV2ZSBzZW1wcmUgc2VyIDw9IDUuCiAgICAgIC8vIE8gdGVzdGUgZmFsaGFyYS4gRWNoaWRuYSBlIGludGVsaWdlbnRlIG8gc3VmaWNpZW50ZSBwYXJhIGNoYW1hciBDb3VudGVyLmluYygpIG1haXMKICAgICAgLy8gZG8gcXVlIDUgdmV6ZXMuCiAgICAgICAgcmV0dXJuIGNvdW50IDw9IDU7CiAgICB9Cn0KCi8qCmVjaGlkbmEtdGVzdCBUZXN0RWNoaWRuYS5zb2wgLS1jb250cmFjdCBUZXN0QXNzZXJ0IC0tY2hlY2stYXNzZXJ0cwoqLwpjb250cmFjdCBUZXN0QXNzZXJ0IHsKICAgIC8vIEFzc2VydHMgbmFvIGRldGVjdGFkYXMgZW0gMC44LgogICAgLy8gTXVkYSBwYXJhIDAuNyBwYXJhIHRlc3RhciBhc3NlcmNvZXMKCiAgICBmdW5jdGlvbiB0ZXN0X2Fzc2VydCh1aW50IF9pKSBleHRlcm5hbCB7CiAgICAgICAgYXNzZXJ0KF9pIDwgMTApOwogICAgfQoKICAgIC8vIEV4ZW1wbG8gbWFpcyBjb21wbGV4bwogICAgZnVuY3Rpb24gYWJzKHVpbnQgeCwgdWludCB5KSBwcml2YXRlIHB1cmUgcmV0dXJucyAodWludCkgewogICAgICAgIGlmICh4ID49IHkpIHsKICAgICAgICAgICAgcmV0dXJuIHggLSB5OwogICAgICAgIH0KICAgICAgICByZXR1cm4geSAtIHg7CiAgICB9CgogICAgZnVuY3Rpb24gdGVzdF9hYnModWludCB4LCB1aW50IHkpIGV4dGVybmFsIHsKICAgICAgICB1aW50IHogPSBhYnMoeCwgeSk7CiAgICAgICAgaWYgKHggPj0geSkgewogICAgICAgICAgICBhc3NlcnQoeiA8PSB4KTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICBhc3NlcnQoeiA8PSB5KTsKICAgICAgICB9CiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)
- [TestEchidna.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuODsKCi8qCmRvY2tlciBydW4gLWl0IC0tcm0gLXYgJFBXRDovY29kZSB0cmFpbG9mYml0cy9ldGgtc2VjdXJpdHktdG9vbGJveAplY2hpZG5hLXRlc3QgRWNoaWRuYVRlc3RUaW1lQW5kQ2FsbGVyLnNvbCAtLWNvbnRyYWN0IEVjaGlkbmFUZXN0VGltZUFuZENhbGxlcgoqLwpjb250cmFjdCBFY2hpZG5hVGVzdFRpbWVBbmRDYWxsZXIgewogICAgYm9vbCBwcml2YXRlIHBhc3MgPSB0cnVlOwogICAgdWludCBwcml2YXRlIGNyZWF0ZWRBdCA9IGJsb2NrLnRpbWVzdGFtcDsKCiAgICAvKgogICAgICB0ZXN0ZSBmYWxoYXJhIHNlIEVjaGlkbmEgcHVkZXIgY2hhbWFyIHNldEZhaWwoKQogICAgICB0ZXN0ZSB2YWkgcGFzc2FyIGNhc28gY29udHJhcmlvCiAgICAqLwogICAgZnVuY3Rpb24gZWNoaWRuYV90ZXN0X3Bhc3MoKSBwdWJsaWMgdmlldyByZXR1cm5zIChib29sKSB7CiAgICAgICAgcmV0dXJuIHBhc3M7CiAgICB9CgogICAgZnVuY3Rpb24gc2V0RmFpbCgpIGV4dGVybmFsIHsKICAgICAgICAvKgogICAgICAgICAgRWNoaWRuYSBwb2RlIGNoYW1hciBlc3RhIGZ1bmNhbyBzZSBkZWxheSA8PSBtYXggYmxvY2sgZGVsYXkKICAgICAgICAgIENhc28gY29udHJhcmlvLCBvIEVjaGlkbmEgbmFvIHBvZGVyYSBjaGFtYXIgZXN0YSBmdW5jYW8uCiAgICAgICAgICBPIGF0cmFzbyBtYXhpbW8gZG8gYmxvY28gcG9kZSBzZXIgZXN0ZW5kaWRvIGVzcGVjaWZpY2FuZG8tbyBlbSB1bSBhcnF1aXZvIGRlIGNvbmZpZ3VyYWNhby4KICAgICAgICAqLwogICAgICAgIHVpbnQgZGVsYXkgPSA3IGRheXM7CiAgICAgICAgcmVxdWlyZShibG9jay50aW1lc3RhbXAgPj0gY3JlYXRlZEF0ICsgZGVsYXkpOwogICAgICAgIHBhc3MgPSBmYWxzZTsKICAgIH0KCiAgICAvLyBSZW1ldGVudGVzIHBhZHJhbwogICAgLy8gQWx0ZXJlIG9zIGVuZGVyZWNvcyBwYXJhIHZlciBvIHRlc3RlIGZhbGhhcgogICAgYWRkcmVzc1szXSBwcml2YXRlIHNlbmRlcnMgPSBbCiAgICAgICAgYWRkcmVzcygweDEwMDAwKSwKICAgICAgICBhZGRyZXNzKDB4MjAwMDApLAogICAgICAgIGFkZHJlc3MoMHgwMGEzMjlDMDY0ODc2OWE3M2FmQUM3RjkzODFlMDhmYjQzREJFQTcwKQogICAgXTsKCiAgICBhZGRyZXNzIHByaXZhdGUgc2VuZGVyID0gbXNnLnNlbmRlcjsKCiAgICAvL1Bhc3NlIF9zZW5kZXIgY29tbyBlbnRyYWRhIGUgZXhpamEgbXNnLnNlbmRlciA9PSBfc2VuZGVyCiAgICAvLyBwYXJhIHZlciBfc2VuZGVyIHBhcmEgZXhlbXBsbyBkZSBjb250YWRvcgoKICAgIGZ1bmN0aW9uIHNldFNlbmRlcihhZGRyZXNzIF9zZW5kZXIpIGV4dGVybmFsIHsKICAgICAgICByZXF1aXJlKF9zZW5kZXIgPT0gbXNnLnNlbmRlcik7CiAgICAgICAgc2VuZGVyID0gbXNnLnNlbmRlcjsKICAgIH0KCiAgICAvLyBWZXJpZmlxdWUgb3MgcmVtZXRlbnRlcyBwYWRyYW8uIE8gcmVtZXRlbnRlIGRldmUgc2VyIHVtYSBkYXMgMyBjb250YXMgcGFkcmFvLgogICAgZnVuY3Rpb24gZWNoaWRuYV90ZXN0X3NlbmRlcigpIHB1YmxpYyB2aWV3IHJldHVybnMgKGJvb2wpIHsKICAgICAgICBmb3IgKHVpbnQgaTsgaSA8IDM7IGkrKykgewogICAgICAgICAgICBpZiAoc2VuZGVyID09IHNlbmRlcnNbaV0pIHsKICAgICAgICAgICAgICAgIHJldHVybiB0cnVlOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIHJldHVybiBmYWxzZTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)