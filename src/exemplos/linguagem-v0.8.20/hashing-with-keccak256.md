# Hashing com Keccak256

`keccak256` calcula o hash Keccak-256 de entrada.

Alguns casos de uso:

- Criando um único ID determinístico de uma entrada
- Esquema Commit-Reveal
- Assinatura criptografada compacta (assinando o hash ao invés de uma entrada maior)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HashFunction {
    function hash(
        string memory _text,
        uint _num,
        address _addr
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_text, _num, _addr));
    }

    // Exemplo de colisão hash
    // Colisão Hash pode ocorrer quando você passa mais de um tipo de dados dinâmicos
    // para abi.encodePacked. Nesse caso, você deve usar abi.encode.
    function collision(string memory _text, string memory _anotherText)
        public
        pure
        returns (bytes32)
    {
        // encodePacked(AAA, BBB) -> AAABBB
        // encodePacked(AA, ABBB) -> AAABBB
        return keccak256(abi.encodePacked(_text, _anotherText));
    }
}

contract GuessTheMagicWord {
    bytes32 public answer =
        0x60298f78cc0b47170ba79c10aa3851d7648bd96f2f8e46a19dbc777c36fb0c00;

    // Palavra mágica é "Solidity"
    function guess(string memory _word) public view returns (bool) {
        return keccak256(abi.encodePacked(_word)) == answer;
    }
}
```

## Teste no Remix

- [Keccak256.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IEhhc2hGdW5jdGlvbiB7CiAgICBmdW5jdGlvbiBoYXNoKAogICAgICAgIHN0cmluZyBtZW1vcnkgX3RleHQsCiAgICAgICAgdWludCBfbnVtLAogICAgICAgIGFkZHJlc3MgX2FkZHIKICAgICkgcHVibGljIHB1cmUgcmV0dXJucyAoYnl0ZXMzMikgewogICAgICAgIHJldHVybiBrZWNjYWsyNTYoYWJpLmVuY29kZVBhY2tlZChfdGV4dCwgX251bSwgX2FkZHIpKTsKICAgIH0KCiAgICAvLyBFeGVtcGxvIGRlIGNvbGlzYW8gaGFzaAogICAgLy8gQ29saXNhbyBIYXNoIHBvZGUgb2NvcnJlciBxdWFuZG8gdm9jZSBwYXNzYSBtYWlzIGRlIHVtIHRpcG8gZGUgZGFkb3MgZGluYW1pY29zCiAgICAvLyBwYXJhIGFiaS5lbmNvZGVQYWNrZWQuIE5lc3NlIGNhc28sIHZvY2UgZGV2ZSB1c2FyIGFiaS5lbmNvZGUuCiAgICBmdW5jdGlvbiBjb2xsaXNpb24oc3RyaW5nIG1lbW9yeSBfdGV4dCwgc3RyaW5nIG1lbW9yeSBfYW5vdGhlclRleHQpCiAgICAgICAgcHVibGljCiAgICAgICAgcHVyZQogICAgICAgIHJldHVybnMgKGJ5dGVzMzIpCiAgICB7CiAgICAgICAgLy8gZW5jb2RlUGFja2VkKEFBQSwgQkJCKSAtPiBBQUFCQkIKICAgICAgICAvLyBlbmNvZGVQYWNrZWQoQUEsIEFCQkIpIC0+IEFBQUJCQgogICAgICAgIHJldHVybiBrZWNjYWsyNTYoYWJpLmVuY29kZVBhY2tlZChfdGV4dCwgX2Fub3RoZXJUZXh0KSk7CiAgICB9Cn0KCmNvbnRyYWN0IEd1ZXNzVGhlTWFnaWNXb3JkIHsKICAgIGJ5dGVzMzIgcHVibGljIGFuc3dlciA9CiAgICAgICAgMHg2MDI5OGY3OGNjMGI0NzE3MGJhNzljMTBhYTM4NTFkNzY0OGJkOTZmMmY4ZTQ2YTE5ZGJjNzc3YzM2ZmIwYzAwOwoKICAgIC8vIFBhbGF2cmEgbWFnaWNhIGUgIlNvbGlkaXR5IgogICAgZnVuY3Rpb24gZ3Vlc3Moc3RyaW5nIG1lbW9yeSBfd29yZCkgcHVibGljIHZpZXcgcmV0dXJucyAoYm9vbCkgewogICAgICAgIHJldHVybiBrZWNjYWsyNTYoYWJpLmVuY29kZVBhY2tlZChfd29yZCkpID09IGFuc3dlcjsKICAgIH0KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
