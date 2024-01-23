# Árvore de Merkle

A árvore de Merkle permite você provar criptograficamente que um elemento está contido num conjunto sem revelar o conjunto inteiro.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MerkleProof {
    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf,
        uint index
    ) public pure returns (bool) {
        bytes32 hash = leaf;

        for (uint i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (index % 2 == 0) {
                hash = keccak256(abi.encodePacked(hash, proofElement));
            } else {
                hash = keccak256(abi.encodePacked(proofElement, hash));
            }

            index = index / 2;
        }

        return hash == root;
    }
}

contract TestMerkleProof is MerkleProof {
    bytes32[] public hashes;

    constructor() {
        string[4] memory transactions = [
            "alice -> bob",
            "bob -> dave",
            "carol -> alice",
            "dave -> bob"
        ];

        for (uint i = 0; i < transactions.length; i++) {
            hashes.push(keccak256(abi.encodePacked(transactions[i])));
        }

        uint n = transactions.length;
        uint offset = 0;

        while (n > 0) {
            for (uint i = 0; i < n - 1; i += 2) {
                hashes.push(
                    keccak256(
                        abi.encodePacked(hashes[offset + i], hashes[offset + i + 1])
                    )
                );
            }
            offset += n;
            n = n / 2;
        }
    }

    function getRoot() public view returns (bytes32) {
        return hashes[hashes.length - 1];
    }

    /* verifica
    3rd leaf
    0xdca3326ad7e8121bf9cf9c12333e6b2271abe823ec9edfe42f813b1e768fa57b

    root
    0xcc086fcc038189b4641db2cc4f1de3bb132aefbd65d510d817591550937818c7

    index
    2

    prova
    0x8da9e1c820f9dbd1589fd6585872bc1063588625729e7ab0797cfc63a00bd950
    0x995788ffc103b987ad50f5e5707fd094419eb12d9552cc423bd0cd86a3861433
    */
}
```

## Teste no Remix

- [MerkleProof.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IE1lcmtsZVByb29mIHsKICAgIGZ1bmN0aW9uIHZlcmlmeSgKICAgICAgICBieXRlczMyW10gbWVtb3J5IHByb29mLAogICAgICAgIGJ5dGVzMzIgcm9vdCwKICAgICAgICBieXRlczMyIGxlYWYsCiAgICAgICAgdWludCBpbmRleAogICAgKSBwdWJsaWMgcHVyZSByZXR1cm5zIChib29sKSB7CiAgICAgICAgYnl0ZXMzMiBoYXNoID0gbGVhZjsKCiAgICAgICAgZm9yICh1aW50IGkgPSAwOyBpIDwgcHJvb2YubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgYnl0ZXMzMiBwcm9vZkVsZW1lbnQgPSBwcm9vZltpXTsKCiAgICAgICAgICAgIGlmIChpbmRleCAlIDIgPT0gMCkgewogICAgICAgICAgICAgICAgaGFzaCA9IGtlY2NhazI1NihhYmkuZW5jb2RlUGFja2VkKGhhc2gsIHByb29mRWxlbWVudCkpOwogICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgaGFzaCA9IGtlY2NhazI1NihhYmkuZW5jb2RlUGFja2VkKHByb29mRWxlbWVudCwgaGFzaCkpOwogICAgICAgICAgICB9CgogICAgICAgICAgICBpbmRleCA9IGluZGV4IC8gMjsKICAgICAgICB9CgogICAgICAgIHJldHVybiBoYXNoID09IHJvb3Q7CiAgICB9Cn0KCmNvbnRyYWN0IFRlc3RNZXJrbGVQcm9vZiBpcyBNZXJrbGVQcm9vZiB7CiAgICBieXRlczMyW10gcHVibGljIGhhc2hlczsKCiAgICBjb25zdHJ1Y3RvcigpIHsKICAgICAgICBzdHJpbmdbNF0gbWVtb3J5IHRyYW5zYWN0aW9ucyA9IFsKICAgICAgICAgICAiYWxpY2UgLT4gYm9iIiwKICAgICAgICAgICAiYm9iIC0+IGRhdmUiLAogICAgICAgICAgICJjYXJvbCAtPiBhbGljZSIsCiAgICAgICAgICAgImRhdmUgLT4gYm9iIgogICAgICAgIF07CgogICAgICAgIGZvciAodWludCBpID0gMDsgaSA8IHRyYW5zYWN0aW9ucy5sZW5ndGg7IGkrKykgewogICAgICAgICAgICBoYXNoZXMucHVzaChrZWNjYWsyNTYoYWJpLmVuY29kZVBhY2tlZCh0cmFuc2FjdGlvbnNbaV0pKSk7CiAgICAgICAgfQoKICAgICAgICB1aW50IG4gPSB0cmFuc2FjdGlvbnMubGVuZ3RoOwogICAgICAgIHVpbnQgb2Zmc2V0ID0gMDsKCiAgICAgICAgd2hpbGUgKG4gPiAwKSB7CiAgICAgICAgICAgIGZvciAodWludCBpID0gMDsgaSA8IG4gLSAxOyBpICs9IDIpIHsKICAgICAgICAgICAgICAgIGhhc2hlcy5wdXNoKAogICAgICAgICAgICAgICAgICAgIGtlY2NhazI1NigKICAgICAgICAgICAgICAgICAgICAgICAgYWJpLmVuY29kZVBhY2tlZChoYXNoZXNbb2Zmc2V0ICsgaV0sIGhhc2hlc1tvZmZzZXQgKyBpICsgMV0pCiAgICAgICAgICAgICAgICAgICAgKQogICAgICAgICAgICAgICAgKTsKICAgICAgICAgICAgfQogICAgICAgICAgICBvZmZzZXQgKz0gbjsKICAgICAgICAgICAgbiA9IG4gLyAyOwogICAgICAgIH0KICAgIH0KCiAgICBmdW5jdGlvbiBnZXRSb290KCkgcHVibGljIHZpZXcgcmV0dXJucyAoYnl0ZXMzMikgewogICAgICAgIHJldHVybiBoYXNoZXNbaGFzaGVzLmxlbmd0aCAtIDFdOwogICAgfQoKICAgIC8qIHZlcmlmaWNhCiAgICAzcmQgbGVhZgogICAgMHhkY2EzMzI2YWQ3ZTgxMjFiZjljZjljMTIzMzNlNmIyMjcxYWJlODIzZWM5ZWRmZTQyZjgxM2IxZTc2OGZhNTdiCgogICAgcm9vdAogICAgMHhjYzA4NmZjYzAzODE4OWI0NjQxZGIyY2M0ZjFkZTNiYjEzMmFlZmJkNjVkNTEwZDgxNzU5MTU1MDkzNzgxOGM3CgogICAgaW5kZXgKICAgIDIKCiAgICBwcm92YQogICAgMHg4ZGE5ZTFjODIwZjlkYmQxNTg5ZmQ2NTg1ODcyYmMxMDYzNTg4NjI1NzI5ZTdhYjA3OTdjZmM2M2EwMGJkOTUwCiAgICAweDk5NTc4OGZmYzEwM2I5ODdhZDUwZjVlNTcwN2ZkMDk0NDE5ZWIxMmQ5NTUyY2M0MjNiZDBjZDg2YTM4NjE0MzMKICAgICovCn0=&version=soljson-v0.8.20+commit.a1b79de6.js)
