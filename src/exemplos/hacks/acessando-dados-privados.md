# Acessando Dados Privados

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

Todos os dados num contrato inteligente podem ser lidos.

Vamos ver como podemos ler dados privados. No processo, você aprenderá como o Solidity armazena variáveis ​​de estado.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
Nota: não pode usar web3 on JVM, então use contrato implementado no Goerli
Nota: browser Web3 é antigo então use Web3 do truffle console

Contract deployed on Goerli
0x534E4Ce0ffF779513793cfd70308AF195827BD31
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
1º. usuário
web3.eth.getStorageAt("0x3505a02BCDFbb225988161a95528bfDb279faD6b", "0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f", console.log)
web3.eth.getStorageAt("0x3505a02BCDFbb225988161a95528bfDb279faD6b", "0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d40", console.log)
Nota: use web3.toAscii para converter bytes32 para alfabeto
2º. usuário
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

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

- Não armazene informações confidenciais no blockchain.

## Teste no Remix

- [Vault.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qCk5vdGE6IG5hbyBwb2RlIHVzYXIgd2ViMyBvbiBKVk0sIGVudGFvIHVzZSBjb250cmF0byBpbXBsZW1lbnRhZG8gbm8gR29lcmxpCk5vdGE6IGJyb3dzZXIgV2ViMyBlIGFudGlnbyBlbnRhbyB1c2UgV2ViMyBkbyB0cnVmZmxlIGNvbnNvbGUKCkNvbnRyYWN0IGRlcGxveWVkIG9uIEdvZXJsaQoweDUzNEU0Q2UwZmZGNzc5NTEzNzkzY2ZkNzAzMDhBRjE5NTgyN0JEMzEKKi8KCi8qCiMgQXJtYXplbmFnZW0KLSAyICoqIDI1NiBzbG90cwotIDMyIGJ5dGVzIHBhcmEgY2FkYSBzbG90Ci0gZGFkb3Mgc2FvIGFybWF6ZW5hZG9zIHNlcXVlbmNpYWxtZW50ZSBwb3Igb3JkZW0gZGUgZGVjbGFyYWNhbwotIGFybWF6ZW5hZ2VtIGUgb3RpbWl6YWRhIHBhcmEgZWNvbm9taXphciBlc3BhY28uIFNlIGFzIHZhcmlhdmVpcyB2aXppbmhhcyBjYWJlbSAKICBlbSAzMiBieXRlcywgZW50YW8gZWxhcyBzYW8gZW1wYWNvdGFkYXMgbm8gbWVzbW8gc2xvdCwgY29tZWNhbmRvIGRhIGRpcmVpdGEKKi8KCmNvbnRyYWN0IFZhdWx0IHsKICAgIC8vIHNsb3QgMAogICAgdWludCBwdWJsaWMgY291bnQgPSAxMjM7CiAgICAvLyBzbG90IDEKICAgIGFkZHJlc3MgcHVibGljIG93bmVyID0gbXNnLnNlbmRlcjsKICAgIGJvb2wgcHVibGljIGlzVHJ1ZSA9IHRydWU7CiAgICB1aW50MTYgcHVibGljIHUxNiA9IDMxOwogICAgLy8gc2xvdCAyCiAgICBieXRlczMyIHByaXZhdGUgcGFzc3dvcmQ7CgogICAgLy8gY29uc3RhbnRlcyBuYW8gdXNhbSBhcm1hemVuYWdlbQogICAgdWludCBwdWJsaWMgY29uc3RhbnQgc29tZUNvbnN0ID0gMTIzOwoKICAgIC8vIHNsb3QgMywgNCwgNSAob25lIGZvciBlYWNoIGFycmF5IGVsZW1lbnQpCiAgICBieXRlczMyWzNdIHB1YmxpYyBkYXRhOwoKICAgIHN0cnVjdCBVc2VyIHsKICAgICAgICB1aW50IGlkOwogICAgICAgIGJ5dGVzMzIgcGFzc3dvcmQ7CiAgICB9CgogICAgLy8gc2xvdCA2IC0gY29tcHJpbWVudG8gZGEgbWF0cml6CiAgICAvL2NvbWVjYW5kbyBkZSBzbG90IGhhc2goNikgLSBlbGVtZW50b3MgZGEgbWF0cml6CiAgICAvLyBzbG90IG9uZGUgbyBlbGVtZW50byBkYSBtYXRyaXogZSBhcm1hemVuYWRvID0ga2VjY2FrMjU2KHNsb3QpKSArIChpbmRleCAqIGVsZW1lbnRTaXplKQogICAgLy8gb25kZSBzbG90ID0gNiBlIGVsZW1lbnRTaXplID0gMiAoMSAodWludCkgKyAgMSAoYnl0ZXMzMikpCiAgICBVc2VyW10gcHJpdmF0ZSB1c2VyczsKCiAgICAvLyBzbG90IDcgLSB2YXppbwogICAgLy8gZW50cmFkYXMgc2FvIGFybWF6ZW5hZGFzIG5vIGhhc2goa2V5LCBzbG90KQogICAgLy8gb25kZSBzbG90ID0gNywga2V5ID0gbWFwIGtleQogICAgbWFwcGluZyh1aW50ID0+IFVzZXIpIHByaXZhdGUgaWRUb1VzZXI7CgogICAgY29uc3RydWN0b3IoYnl0ZXMzMiBfcGFzc3dvcmQpIHsKICAgICAgICBwYXNzd29yZCA9IF9wYXNzd29yZDsKICAgIH0KCiAgICBmdW5jdGlvbiBhZGRVc2VyKGJ5dGVzMzIgX3Bhc3N3b3JkKSBwdWJsaWMgewogICAgICAgIFVzZXIgbWVtb3J5IHVzZXIgPSBVc2VyKHtpZDogdXNlcnMubGVuZ3RoLCBwYXNzd29yZDogX3Bhc3N3b3JkfSk7CgogICAgICAgIHVzZXJzLnB1c2godXNlcik7CiAgICAgICAgaWRUb1VzZXJbdXNlci5pZF0gPSB1c2VyOwogICAgfQoKICAgIGZ1bmN0aW9uIGdldEFycmF5TG9jYXRpb24oCiAgICAgICAgdWludCBzbG90LAogICAgICAgIHVpbnQgaW5kZXgsCiAgICAgICAgdWludCBlbGVtZW50U2l6ZQogICAgKSBwdWJsaWMgcHVyZSByZXR1cm5zICh1aW50KSB7CiAgICAgICAgcmV0dXJuIHVpbnQoa2VjY2FrMjU2KGFiaS5lbmNvZGVQYWNrZWQoc2xvdCkpKSArIChpbmRleCAqIGVsZW1lbnRTaXplKTsKICAgIH0KCiAgICBmdW5jdGlvbiBnZXRNYXBMb2NhdGlvbih1aW50IHNsb3QsIHVpbnQga2V5KSBwdWJsaWMgcHVyZSByZXR1cm5zICh1aW50KSB7CiAgICAgICAgcmV0dXJuIHVpbnQoa2VjY2FrMjU2KGFiaS5lbmNvZGVQYWNrZWQoa2V5LCBzbG90KSkpOwogICAgfQp9CgovKgpzbG90IDAgLSBjb3VudAp3ZWIzLmV0aC5nZXRTdG9yYWdlQXQoIjB4MzUwNWEwMkJDREZiYjIyNTk4ODE2MWE5NTUyOGJmRGIyNzlmYUQ2YiIsIDAsIGNvbnNvbGUubG9nKQpzbG90IDEgLSB1MTYsIGlzVHJ1ZSwgb3duZXIKd2ViMy5ldGguZ2V0U3RvcmFnZUF0KCIweDM1MDVhMDJCQ0RGYmIyMjU5ODgxNjFhOTU1MjhiZkRiMjc5ZmFENmIiLCAxLCBjb25zb2xlLmxvZykKc2xvdCAyIC0gcGFzc3dvcmQKd2ViMy5ldGguZ2V0U3RvcmFnZUF0KCIweDM1MDVhMDJCQ0RGYmIyMjU5ODgxNjFhOTU1MjhiZkRiMjc5ZmFENmIiLCAyLCBjb25zb2xlLmxvZykKCnNsb3QgNiAtIGFycmF5IGxlbmd0aApnZXRBcnJheUxvY2F0aW9uKDYsIDAsIDIpCndlYjMudXRpbHMubnVtYmVyVG9IZXgoIjExMTQxNDA3NzgxNTg2MzQwMDUxMDAwNDA2NDYyOTk3MzU5NTk2MTU3OTE3MzY2NTU4OTIyNDIwMzUwMzY2MjE0OTM3MzcyNDk4NjY4NyIpCk5vdGE6IFBvZGVtb3MgdXNhciB0YW1iZW0gd2ViMyBwYXJhIG9idGVyIGEgbG9jYWxpemFjYW8gZG9zIGRhZG9zCndlYjMudXRpbHMuc29saWRpdHlTaGEzKHsgdHlwZTogInVpbnQiLCB2YWx1ZTogNiB9KQoxui4gdXN1YXJpbwp3ZWIzLmV0aC5nZXRTdG9yYWdlQXQoIjB4MzUwNWEwMkJDREZiYjIyNTk4ODE2MWE5NTUyOGJmRGIyNzlmYUQ2YiIsICIweGY2NTIyMjIzMTNlMjg0NTk1MjhkOTIwYjY1MTE1YzE2YzA0ZjNlZmM4MmFhZWRjOTdiZTU5ZjNmMzc3YzBkM2YiLCBjb25zb2xlLmxvZykKd2ViMy5ldGguZ2V0U3RvcmFnZUF0KCIweDM1MDVhMDJCQ0RGYmIyMjU5ODgxNjFhOTU1MjhiZkRiMjc5ZmFENmIiLCAiMHhmNjUyMjIyMzEzZTI4NDU5NTI4ZDkyMGI2NTExNWMxNmMwNGYzZWZjODJhYWVkYzk3YmU1OWYzZjM3N2MwZDQwIiwgY29uc29sZS5sb2cpCk5vdGE6IHVzZSB3ZWIzLnRvQXNjaWkgcGFyYSBjb252ZXJ0ZXIgYnl0ZXMzMiBwYXJhIGFsZmFiZXRvCjK6LiB1c3VhcmlvCndlYjMuZXRoLmdldFN0b3JhZ2VBdCgiMHgzNTA1YTAyQkNERmJiMjI1OTg4MTYxYTk1NTI4YmZEYjI3OWZhRDZiIiwgIjB4ZjY1MjIyMjMxM2UyODQ1OTUyOGQ5MjBiNjUxMTVjMTZjMDRmM2VmYzgyYWFlZGM5N2JlNTlmM2YzNzdjMGQ0MSIsIGNvbnNvbGUubG9nKQp3ZWIzLmV0aC5nZXRTdG9yYWdlQXQoIjB4MzUwNWEwMkJDREZiYjIyNTk4ODE2MWE5NTUyOGJmRGIyNzlmYUQ2YiIsICIweGY2NTIyMjIzMTNlMjg0NTk1MjhkOTIwYjY1MTE1YzE2YzA0ZjNlZmM4MmFhZWRjOTdiZTU5ZjNmMzc3YzBkNDIiLCBjb25zb2xlLmxvZykKCnNsb3QgNyAtIGVtcHR5CmdldE1hcExvY2F0aW9uKDcsIDEpCndlYjMudXRpbHMubnVtYmVyVG9IZXgoIjgxMjIyMTkxOTg2MjI2ODA5MTAzMjc5MTE5OTk0NzA3ODY4MzIyODU1NzQxODE5OTA1OTA0NDE3OTUzMDkyNjY2Njk5MDk2OTYzMTEyIikKTm90YTogTm9zIHBvZGVtb3MgdXNhciB3ZWIzIHBhcmEgb2J0ZXIgYSBsb2NhbGl6YWNhbyBkb3MgZGFkb3MKd2ViMy51dGlscy5zb2xpZGl0eVNoYTMoeyB0eXBlOiAidWludCIsIHZhbHVlOiAxIH0sIHt0eXBlOiAidWludCIsIHZhbHVlOiA3fSkKdXNlciAxCndlYjMuZXRoLmdldFN0b3JhZ2VBdCgiMHgzNTA1YTAyQkNERmJiMjI1OTg4MTYxYTk1NTI4YmZEYjI3OWZhRDZiIiwgIjB4YjM5MjIxYWNlMDUzNDY1ZWMzNDUzY2UyYjM2NDMwYmQxMzhiOTk3ZWNlYTI1YzEwNDNkYTBjMzY2ODEyYjgyOCIsIGNvbnNvbGUubG9nKQp3ZWIzLmV0aC5nZXRTdG9yYWdlQXQoIjB4MzUwNWEwMkJDREZiYjIyNTk4ODE2MWE5NTUyOGJmRGIyNzlmYUQ2YiIsICIweGIzOTIyMWFjZTA1MzQ2NWVjMzQ1M2NlMmIzNjQzMGJkMTM4Yjk5N2VjZWEyNWMxMDQzZGEwYzM2NjgxMmI4MjkiLCBjb25zb2xlLmxvZykKKi8=&version=soljson-v0.8.13+commit.abaa5c0e.js)
