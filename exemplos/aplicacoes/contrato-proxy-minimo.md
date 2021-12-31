# Contrato Proxy Mínimo

Se você tem um contrato que será implantado múltiplas vezes, use o contrato proxy mínimo para implantá-los com baixo custo.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

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
