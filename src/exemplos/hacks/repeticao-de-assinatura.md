# Repetição de Assinatura

Assinar mensagens off-chain e ter um contrato que exija essa assinatura antes de executar uma função é uma técnica útil.

Por exemplo, esta técnica é usada para:

- reduzir o número de transações na cadeia
- transação sem gás, chamada `meta transaction`

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

A mesma assinatura pode ser usada várias vezes para executar uma função. Isso pode ser prejudicial se a intenção do signatário for aprovar uma transação uma vez.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/utils/cryptography/ECDSA.sol";

contract MultiSigWallet {
    using ECDSA for bytes32;

    address[2] public owners;

    constructor(address[2] memory _owners) payable {
        owners = _owners;
    }

    function deposit() external payable {}

    function transfer(
        address _to,
        uint _amount,
        bytes[2] memory _sigs
    ) external {
        bytes32 txHash = getTxHash(_to, _amount);
        require(_checkSigs(_sigs, txHash), "invalid sig");

        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function getTxHash(address _to, uint _amount) public view returns (bytes32) {
        return keccak256(abi.encodePacked(_to, _amount));
    }

    function _checkSigs(bytes[2] memory _sigs, bytes32 _txHash)
        private
        view
        returns (bool)
    {
        bytes32 ethSignedHash = _txHash.toEthSignedMessageHash();

        for (uint i = 0; i < _sigs.length; i++) {
            address signer = ethSignedHash.recover(_sigs[i]);
            bool valid = signer == owners[i];

            if (!valid) {
                return false;
            }
        }

        return true;
    }
}
```

</h4><a href="#preventative-techniques" id="preventative-techniques">Técnicas preventivas</a></h4>

Assine mensagens com `nonce` e endereço do contrato.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/utils/cryptography/ECDSA.sol";

contract MultiSigWallet {
    using ECDSA for bytes32;

    address[2] public owners;
    mapping(bytes32 => bool) public executed;

    constructor(address[2] memory _owners) payable {
        owners = _owners;
    }

    function deposit() external payable {}

    function transfer(
        address _to,
        uint _amount,
        uint _nonce,
        bytes[2] memory _sigs
    ) external {
        bytes32 txHash = getTxHash(_to, _amount, _nonce);
        require(!executed[txHash], "tx executed");
        require(_checkSigs(_sigs, txHash), "invalid sig");

        executed[txHash] = true;

        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function getTxHash(
        address _to,
        uint _amount,
        uint _nonce
    ) public view returns (bytes32) {
        return keccak256(abi.encodePacked(address(this), _to, _amount, _nonce));
    }

    function _checkSigs(bytes[2] memory _sigs, bytes32 _txHash)
        private
        view
        returns (bool)
    {
        bytes32 ethSignedHash = _txHash.toEthSignedMessageHash();

        for (uint i = 0; i < _sigs.length; i++) {
            address signer = ethSignedHash.recover(_sigs[i]);
            bool valid = signer == owners[i];

            if (!valid) {
                return false;
            }
        }

        return true;
    }
}

/*
// proprietários
0xe19aea93F6C1dBef6A3776848bE099A7c3253ac8
0xfa854FE5339843b3e9Bfd8554B38BD042A42e340

// para
0xe10422cc61030C8B3dBCD36c7e7e8EC3B527E0Ac
// quantia
100
// nonce
0
// tx hash
0x12a095462ebfca27dc4d99feef885bfe58344fb6bb42c3c52a7c0d6836d11448

// assinaturas
0x120f8ed8f2fa55498f2ef0a22f26e39b9b51ed29cc93fe0ef3ed1756f58fad0c6eb5a1d6f3671f8d5163639fdc40bb8720de6d8f2523077ad6d1138a60923b801c
0xa240a487de1eb5bb971e920cb0677a47ddc6421e38f7b048f8aa88266b2c884a10455a52dc76a203a1a9a953418469f9eec2c59e87201bbc8db0e4d9796935cb1b
*/
```

## Teste no Remix

- [PreventSigReplay.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmltcG9ydCAiZ2l0aHViLmNvbS9PcGVuWmVwcGVsaW4vb3BlbnplcHBlbGluLWNvbnRyYWN0cy9ibG9iL3JlbGVhc2UtdjQuNS9jb250cmFjdHMvdXRpbHMvY3J5cHRvZ3JhcGh5L0VDRFNBLnNvbCI7Cgpjb250cmFjdCBNdWx0aVNpZ1dhbGxldCB7CiAgICB1c2luZyBFQ0RTQSBmb3IgYnl0ZXMzMjsKCiAgICBhZGRyZXNzWzJdIHB1YmxpYyBvd25lcnM7CgogICAgY29uc3RydWN0b3IoYWRkcmVzc1syXSBtZW1vcnkgX293bmVycykgcGF5YWJsZSB7CiAgICAgICAgb3duZXJzID0gX293bmVyczsKICAgIH0KCiAgICBmdW5jdGlvbiBkZXBvc2l0KCkgZXh0ZXJuYWwgcGF5YWJsZSB7fQoKICAgIGZ1bmN0aW9uIHRyYW5zZmVyKAogICAgICAgIGFkZHJlc3MgX3RvLAogICAgICAgIHVpbnQgX2Ftb3VudCwKICAgICAgICBieXRlc1syXSBtZW1vcnkgX3NpZ3MKICAgICkgZXh0ZXJuYWwgewogICAgICAgIGJ5dGVzMzIgdHhIYXNoID0gZ2V0VHhIYXNoKF90bywgX2Ftb3VudCk7CiAgICAgICAgcmVxdWlyZShfY2hlY2tTaWdzKF9zaWdzLCB0eEhhc2gpLCAiaW52YWxpZCBzaWciKTsKCiAgICAgICAgKGJvb2wgc2VudCwgKSA9IF90by5jYWxse3ZhbHVlOiBfYW1vdW50fSgiIik7CiAgICAgICAgcmVxdWlyZShzZW50LCAiRmFpbGVkIHRvIHNlbmQgRXRoZXIiKTsKICAgIH0KCiAgICBmdW5jdGlvbiBnZXRUeEhhc2goYWRkcmVzcyBfdG8sIHVpbnQgX2Ftb3VudCkgcHVibGljIHZpZXcgcmV0dXJucyAoYnl0ZXMzMikgewogICAgICAgIHJldHVybiBrZWNjYWsyNTYoYWJpLmVuY29kZVBhY2tlZChfdG8sIF9hbW91bnQpKTsKICAgIH0KCiAgICBmdW5jdGlvbiBfY2hlY2tTaWdzKGJ5dGVzWzJdIG1lbW9yeSBfc2lncywgYnl0ZXMzMiBfdHhIYXNoKQogICAgICAgIHByaXZhdGUKICAgICAgICB2aWV3CiAgICAgICAgcmV0dXJucyAoYm9vbCkKICAgIHsKICAgICAgICBieXRlczMyIGV0aFNpZ25lZEhhc2ggPSBfdHhIYXNoLnRvRXRoU2lnbmVkTWVzc2FnZUhhc2goKTsKCiAgICAgICAgZm9yICh1aW50IGkgPSAwOyBpIDwgX3NpZ3MubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgYWRkcmVzcyBzaWduZXIgPSBldGhTaWduZWRIYXNoLnJlY292ZXIoX3NpZ3NbaV0pOwogICAgICAgICAgICBib29sIHZhbGlkID0gc2lnbmVyID09IG93bmVyc1tpXTsKCiAgICAgICAgICAgIGlmICghdmFsaWQpIHsKICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgcmV0dXJuIHRydWU7CiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)
- [SigReplay.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmltcG9ydCAiZ2l0aHViLmNvbS9PcGVuWmVwcGVsaW4vb3BlbnplcHBlbGluLWNvbnRyYWN0cy9ibG9iL3JlbGVhc2UtdjQuNS9jb250cmFjdHMvdXRpbHMvY3J5cHRvZ3JhcGh5L0VDRFNBLnNvbCI7Cgpjb250cmFjdCBNdWx0aVNpZ1dhbGxldCB7CiAgICB1c2luZyBFQ0RTQSBmb3IgYnl0ZXMzMjsKCiAgICBhZGRyZXNzWzJdIHB1YmxpYyBvd25lcnM7CiAgICBtYXBwaW5nKGJ5dGVzMzIgPT4gYm9vbCkgcHVibGljIGV4ZWN1dGVkOwoKICAgIGNvbnN0cnVjdG9yKGFkZHJlc3NbMl0gbWVtb3J5IF9vd25lcnMpIHBheWFibGUgewogICAgICAgIG93bmVycyA9IF9vd25lcnM7CiAgICB9CgogICAgZnVuY3Rpb24gZGVwb3NpdCgpIGV4dGVybmFsIHBheWFibGUge30KCiAgICBmdW5jdGlvbiB0cmFuc2ZlcigKICAgICAgICBhZGRyZXNzIF90bywKICAgICAgICB1aW50IF9hbW91bnQsCiAgICAgICAgdWludCBfbm9uY2UsCiAgICAgICAgYnl0ZXNbMl0gbWVtb3J5IF9zaWdzCiAgICApIGV4dGVybmFsIHsKICAgICAgICBieXRlczMyIHR4SGFzaCA9IGdldFR4SGFzaChfdG8sIF9hbW91bnQsIF9ub25jZSk7CiAgICAgICAgcmVxdWlyZSghZXhlY3V0ZWRbdHhIYXNoXSwgInR4IGV4ZWN1dGVkIik7CiAgICAgICAgcmVxdWlyZShfY2hlY2tTaWdzKF9zaWdzLCB0eEhhc2gpLCAiaW52YWxpZCBzaWciKTsKCiAgICAgICAgZXhlY3V0ZWRbdHhIYXNoXSA9IHRydWU7CgogICAgICAgIChib29sIHNlbnQsICkgPSBfdG8uY2FsbHt2YWx1ZTogX2Ftb3VudH0oIiIpOwogICAgICAgIHJlcXVpcmUoc2VudCwgIkZhaWxlZCB0byBzZW5kIEV0aGVyIik7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0VHhIYXNoKAogICAgICAgIGFkZHJlc3MgX3RvLAogICAgICAgIHVpbnQgX2Ftb3VudCwKICAgICAgICB1aW50IF9ub25jZQogICAgKSBwdWJsaWMgdmlldyByZXR1cm5zIChieXRlczMyKSB7CiAgICAgICAgcmV0dXJuIGtlY2NhazI1NihhYmkuZW5jb2RlUGFja2VkKGFkZHJlc3ModGhpcyksIF90bywgX2Ftb3VudCwgX25vbmNlKSk7CiAgICB9CgogICAgZnVuY3Rpb24gX2NoZWNrU2lncyhieXRlc1syXSBtZW1vcnkgX3NpZ3MsIGJ5dGVzMzIgX3R4SGFzaCkKICAgICAgICBwcml2YXRlCiAgICAgICAgdmlldwogICAgICAgIHJldHVybnMgKGJvb2wpCiAgICB7CiAgICAgICAgYnl0ZXMzMiBldGhTaWduZWRIYXNoID0gX3R4SGFzaC50b0V0aFNpZ25lZE1lc3NhZ2VIYXNoKCk7CgogICAgICAgIGZvciAodWludCBpID0gMDsgaSA8IF9zaWdzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICAgIGFkZHJlc3Mgc2lnbmVyID0gZXRoU2lnbmVkSGFzaC5yZWNvdmVyKF9zaWdzW2ldKTsKICAgICAgICAgICAgYm9vbCB2YWxpZCA9IHNpZ25lciA9PSBvd25lcnNbaV07CgogICAgICAgICAgICBpZiAoIXZhbGlkKSB7CiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgICAgIH0KICAgICAgICB9CgogICAgICAgIHJldHVybiB0cnVlOwogICAgfQp9CgovKgovLyBwcm9wcmlldGFyaW9zCjB4ZTE5YWVhOTNGNkMxZEJlZjZBMzc3Njg0OGJFMDk5QTdjMzI1M2FjOAoweGZhODU0RkU1MzM5ODQzYjNlOUJmZDg1NTRCMzhCRDA0MkE0MmUzNDAKCi8vIHBhcmEKMHhlMTA0MjJjYzYxMDMwQzhCM2RCQ0QzNmM3ZTdlOEVDM0I1MjdFMEFjCi8vIHF1YW50aWEKMTAwCi8vIG5vbmNlCjAKLy8gdHggaGFzaAoweDEyYTA5NTQ2MmViZmNhMjdkYzRkOTlmZWVmODg1YmZlNTgzNDRmYjZiYjQyYzNjNTJhN2MwZDY4MzZkMTE0NDgKCi8vIGFzc2luYXR1cmFzCjB4MTIwZjhlZDhmMmZhNTU0OThmMmVmMGEyMmYyNmUzOWI5YjUxZWQyOWNjOTNmZTBlZjNlZDE3NTZmNThmYWQwYzZlYjVhMWQ2ZjM2NzFmOGQ1MTYzNjM5ZmRjNDBiYjg3MjBkZTZkOGYyNTIzMDc3YWQ2ZDExMzhhNjA5MjNiODAxYwoweGEyNDBhNDg3ZGUxZWI1YmI5NzFlOTIwY2IwNjc3YTQ3ZGRjNjQyMWUzOGY3YjA0OGY4YWE4ODI2NmIyYzg4NGExMDQ1NWE1MmRjNzZhMjAzYTFhOWE5NTM0MTg0NjlmOWVlYzJjNTllODcyMDFiYmM4ZGIwZTRkOTc5NjkzNWNiMWIKKi8=&version=soljson-v0.8.13+commit.abaa5c0e.js)
