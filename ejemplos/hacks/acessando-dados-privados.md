# Acessando Dados Privados

#### Vulnerabilidade <a href="#vulnerability" id="vulnerability"></a>

Todos os dados num contrato inteligente podem ser lidos.

Vamos ver como podemos ler dados privados. Você vai aprender como Solidity armazena variáveis de estado.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/*
Nota: não pode usar web3 on JVM, então use contrato implementado no ropsten
Nota: browser Web3 é antigo então use Web3 do truffle console

Contrato implantado no Ropsten
0x3505a02BCDFbb225988161a95528bfDb279faD6b
*/

/*
# Armazenagem
- 2 ** 256 slots
- 32 bytes para cada slot
- dados são armazenados sequencialmente por ordem de declaração
- armazenagem é otimizada para economizar espaço. Se as variáveis vizinhas cabem 
  em 32 bytes, então elas são empacotadas no mesmo slot, começando da direita
*/

contract Vault {
    // slot 0
    uint public count = 123;
    // slot 1
    address public owner = msg.sender;
    bool public isTrue = true;
    uint16 public u16 = 31;
    // slot 2
    bytes32 private password;

    // constantes não usam armazenagem
    uint public constant someConst = 123;

    // slot 3, 4, 5 (one for each array element)
    bytes32[3] public data;

    struct User {
        uint id;
        bytes32 password;
    }

    // slot 6 - comprimento da matriz
    //começando de slot hash(6) - elementos da matriz
    // slot onde o elemento da matriz é armazenado = keccak256(slot)) + (index * elementSize)
    // onde slot = 6 e elementSize = 2 (1 (uint) +  1 (bytes32))
    User[] private users;

    // slot 7 - vazio
    // entradas são armazenadas no hash(key, slot)
    // onde slot = 7, key = map key
    mapping(uint => User) private idToUser;

    constructor(bytes32 _password) {
        password = _password;
    }

    function addUser(bytes32 _password) public {
        User memory user = User({id: users.length, password: _password});

        users.push(user);
        idToUser[user.id] = user;
    }

    function getArrayLocation(
        uint slot,
        uint index,
        uint elementSize
    ) public pure returns (uint) {
        return uint(keccak256(abi.encodePacked(slot))) + (index * elementSize);
    }

    function getMapLocation(uint slot, uint key) public pure returns (uint) {
        return uint(keccak256(abi.encodePacked(key, slot)));
    }
}

/*
slot 0 - count
web3.eth.getStorageAt("0x3505a02BCDFbb225988161a95528bfDb279faD6b", 0, console.log)
slot 1 - u16, isTrue, owner
web3.eth.getStorageAt("0x3505a02BCDFbb225988161a95528bfDb279faD6b", 1, console.log)
slot 2 - password
web3.eth.getStorageAt("0x3505a02BCDFbb225988161a95528bfDb279faD6b", 2, console.log)

slot 6 - array length
getArrayLocation(6, 0, 2)
web3.utils.numberToHex("111414077815863400510004064629973595961579173665589224203503662149373724986687")
Nota: Podemos usar também web3 para obter a localização dos dados
web3.utils.soliditySha3({ type: "uint", value: 6 })
1o. usuário
web3.eth.getStorageAt("0x3505a02BCDFbb225988161a95528bfDb279faD6b", "0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f", console.log)
web3.eth.getStorageAt("0x3505a02BCDFbb225988161a95528bfDb279faD6b", "0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d40", console.log)
Nota: use web3.toAscii para converter bytes32 para alfabeto
2o. usuário
web3.eth.getStorageAt("0x3505a02BCDFbb225988161a95528bfDb279faD6b", "0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d41", console.log)
web3.eth.getStorageAt("0x3505a02BCDFbb225988161a95528bfDb279faD6b", "0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d42", console.log)

slot 7 - empty
getMapLocation(7, 1)
web3.utils.numberToHex("81222191986226809103279119994707868322855741819905904417953092666699096963112")
Nota: Nós podemos usar web3 para obter a localização dos dados
web3.utils.soliditySha3({ type: "uint", value: 1 }, {type: "uint", value: 7})
user 1
web3.eth.getStorageAt("0x3505a02BCDFbb225988161a95528bfDb279faD6b", "0xb39221ace053465ec3453ce2b36430bd138b997ecea25c1043da0c366812b828", console.log)
web3.eth.getStorageAt("0x3505a02BCDFbb225988161a95528bfDb279faD6b", "0xb39221ace053465ec3453ce2b36430bd138b997ecea25c1043da0c366812b829", console.log)
*/
```

#### Técnicas preventivas <a href="#preventative-techniques" id="preventative-techniques"></a>

* Não armazene informações confidenciais no blockchain.
