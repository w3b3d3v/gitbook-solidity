# Hashing with Keccak256

`keccak256` computa el hash Keccak-256 del input.

Algunos casos de uso son:

* Crear un único ID determinístico desde un input
* El esquema Commit-Reveal
* La firma criptográfica compacta (firmando el hash en vez de un input muy largo)

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

    // Ejemplo de la colisión del hash
    // La colisión del hash puede ocurrir cuando pasas más de un tipo de dato dinámico
    // al abi.encodePacked. En ese caso, en cambio, debes usar abi.encode.
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

    // La palabra mágica es "Solidity"
    function guess(string memory _word) public view returns (bool) {
        return keccak256(abi.encodePacked(_word)) == answer;
    }
}
```
