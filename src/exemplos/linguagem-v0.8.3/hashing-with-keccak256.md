# Hashing with Keccak256

`keccak256` computa o hash Keccak-256 de entrada.

Alguns casos de uso:

* Criando um único ID determinístico de uma entrada
* Esquema Commit-Reveal
* Assinatura criptografada compacta (assinando o hash ao invés de uma entrada maior)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

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
