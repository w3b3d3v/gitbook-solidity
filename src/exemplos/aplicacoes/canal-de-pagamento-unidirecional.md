# Canal de Pagamento Unidirecional

Os canais de pagamento permitem que os participantes transfiram repetidamente o Ether para fora da cadeia.

Aqui está como esse contrato é usado:

* `Alice` implementa o contrato, depositando algum Ether.
* `Alice` autoriza um pagamento assinando uma mensagem (off chain) e envia a assinatura para `Bob`.
* `Bob` reivindica seu pagamento apresentando a mensagem assinada para o contracto inteligente.
* Se `Bob` não reivindica seu pagamento, `Alice` pega seu Ether de volta depois que o contrato expirar

Esse é chamado um canal de pagamento unidirecional já que o pagamento só pode ir em uma única direção de `Alice` para `Bob`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/utils/cryptography/ECDSA.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/security/ReentrancyGuard.sol";

contract UniDirectionalPaymentChannel is ReentrancyGuard {
    using ECDSA for bytes32;

    address payable public sender;
    address payable public receiver;

    uint private constant DURATION = 7 * 24 * 60 * 60;
    uint public expiresAt;

    constructor(address payable _receiver) payable {
        require(_receiver != address(0), "receiver = zero address");
        sender = payable(msg.sender);
        receiver = _receiver;
        expiresAt = block.timestamp + DURATION;
    }

    function _getHash(uint _amount) private view returns (bytes32) {
         // NOTA: assine com endereço desse contrato para proteção contra
        // ataque de repetição em outros contratos
        return keccak256(abi.encodePacked(address(this), _amount));
    }

    function getHash(uint _amount) external view returns (bytes32) {
        return _getHash(_amount);
    }

    function _getEthSignedHash(uint _amount) private view returns (bytes32) {
        return _getHash(_amount).toEthSignedMessageHash();
    }

    function getEthSignedHash(uint _amount) external view returns (bytes32) {
        return _getEthSignedHash(_amount);
    }

    function _verify(uint _amount, bytes memory _sig) private view returns (bool) {
        return _getEthSignedHash(_amount).recover(_sig) == sender;
    }

    function verify(uint _amount, bytes memory _sig) external view returns (bool) {
        return _verify(_amount, _sig);
    }

    function close(uint _amount, bytes memory _sig) external nonReentrant {
        require(msg.sender == receiver, "!receiver");
        require(_verify(_amount, _sig), "invalid sig");

        (bool sent, ) = receiver.call{value: _amount}("");
        require(sent, "Failed to send Ether");
        selfdestruct(sender);
    }

    function cancel() external {
        require(msg.sender == sender, "!sender");
        require(block.timestamp >= expiresAt, "!expired");
        selfdestruct(sender);
    }
}
```

## Teste no Remix

- [UniDirectionalPaymentChannel.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmltcG9ydCAiZ2l0aHViLmNvbS9PcGVuWmVwcGVsaW4vb3BlbnplcHBlbGluLWNvbnRyYWN0cy9ibG9iL3JlbGVhc2UtdjQuNS9jb250cmFjdHMvdXRpbHMvY3J5cHRvZ3JhcGh5L0VDRFNBLnNvbCI7CmltcG9ydCAiZ2l0aHViLmNvbS9PcGVuWmVwcGVsaW4vb3BlbnplcHBlbGluLWNvbnRyYWN0cy9ibG9iL3JlbGVhc2UtdjQuNS9jb250cmFjdHMvc2VjdXJpdHkvUmVlbnRyYW5jeUd1YXJkLnNvbCI7Cgpjb250cmFjdCBVbmlEaXJlY3Rpb25hbFBheW1lbnRDaGFubmVsIGlzIFJlZW50cmFuY3lHdWFyZCB7CiAgICB1c2luZyBFQ0RTQSBmb3IgYnl0ZXMzMjsKCiAgICBhZGRyZXNzIHBheWFibGUgcHVibGljIHNlbmRlcjsKICAgIGFkZHJlc3MgcGF5YWJsZSBwdWJsaWMgcmVjZWl2ZXI7CgogICAgdWludCBwcml2YXRlIGNvbnN0YW50IERVUkFUSU9OID0gNyAqIDI0ICogNjAgKiA2MDsKICAgIHVpbnQgcHVibGljIGV4cGlyZXNBdDsKCiAgICBjb25zdHJ1Y3RvcihhZGRyZXNzIHBheWFibGUgX3JlY2VpdmVyKSBwYXlhYmxlIHsKICAgICAgICByZXF1aXJlKF9yZWNlaXZlciAhPSBhZGRyZXNzKDApLCAicmVjZWl2ZXIgPSB6ZXJvIGFkZHJlc3MiKTsKICAgICAgICBzZW5kZXIgPSBwYXlhYmxlKG1zZy5zZW5kZXIpOwogICAgICAgIHJlY2VpdmVyID0gX3JlY2VpdmVyOwogICAgICAgIGV4cGlyZXNBdCA9IGJsb2NrLnRpbWVzdGFtcCArIERVUkFUSU9OOwogICAgfQoKICAgIGZ1bmN0aW9uIF9nZXRIYXNoKHVpbnQgX2Ftb3VudCkgcHJpdmF0ZSB2aWV3IHJldHVybnMgKGJ5dGVzMzIpIHsKICAgICAgICAgLy8gTk9UQTogYXNzaW5lIGNvbSBlbmRlcmVjbyBkZXNzZSBjb250cmF0byBwYXJhIHByb3RlY2FvIGNvbnRyYQogICAgICAgIC8vIGF0YXF1ZSBkZSByZXBldGljYW8gZW0gb3V0cm9zIGNvbnRyYXRvcwogICAgICAgIHJldHVybiBrZWNjYWsyNTYoYWJpLmVuY29kZVBhY2tlZChhZGRyZXNzKHRoaXMpLCBfYW1vdW50KSk7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0SGFzaCh1aW50IF9hbW91bnQpIGV4dGVybmFsIHZpZXcgcmV0dXJucyAoYnl0ZXMzMikgewogICAgICAgIHJldHVybiBfZ2V0SGFzaChfYW1vdW50KTsKICAgIH0KCiAgICBmdW5jdGlvbiBfZ2V0RXRoU2lnbmVkSGFzaCh1aW50IF9hbW91bnQpIHByaXZhdGUgdmlldyByZXR1cm5zIChieXRlczMyKSB7CiAgICAgICAgcmV0dXJuIF9nZXRIYXNoKF9hbW91bnQpLnRvRXRoU2lnbmVkTWVzc2FnZUhhc2goKTsKICAgIH0KCiAgICBmdW5jdGlvbiBnZXRFdGhTaWduZWRIYXNoKHVpbnQgX2Ftb3VudCkgZXh0ZXJuYWwgdmlldyByZXR1cm5zIChieXRlczMyKSB7CiAgICAgICAgcmV0dXJuIF9nZXRFdGhTaWduZWRIYXNoKF9hbW91bnQpOwogICAgfQoKICAgIGZ1bmN0aW9uIF92ZXJpZnkodWludCBfYW1vdW50LCBieXRlcyBtZW1vcnkgX3NpZykgcHJpdmF0ZSB2aWV3IHJldHVybnMgKGJvb2wpIHsKICAgICAgICByZXR1cm4gX2dldEV0aFNpZ25lZEhhc2goX2Ftb3VudCkucmVjb3Zlcihfc2lnKSA9PSBzZW5kZXI7CiAgICB9CgogICAgZnVuY3Rpb24gdmVyaWZ5KHVpbnQgX2Ftb3VudCwgYnl0ZXMgbWVtb3J5IF9zaWcpIGV4dGVybmFsIHZpZXcgcmV0dXJucyAoYm9vbCkgewogICAgICAgIHJldHVybiBfdmVyaWZ5KF9hbW91bnQsIF9zaWcpOwogICAgfQoKICAgIGZ1bmN0aW9uIGNsb3NlKHVpbnQgX2Ftb3VudCwgYnl0ZXMgbWVtb3J5IF9zaWcpIGV4dGVybmFsIG5vblJlZW50cmFudCB7CiAgICAgICAgcmVxdWlyZShtc2cuc2VuZGVyID09IHJlY2VpdmVyLCAiIXJlY2VpdmVyIik7CiAgICAgICAgcmVxdWlyZShfdmVyaWZ5KF9hbW91bnQsIF9zaWcpLCAiaW52YWxpZCBzaWciKTsKCiAgICAgICAgKGJvb2wgc2VudCwgKSA9IHJlY2VpdmVyLmNhbGx7dmFsdWU6IF9hbW91bnR9KCIiKTsKICAgICAgICByZXF1aXJlKHNlbnQsICJGYWlsZWQgdG8gc2VuZCBFdGhlciIpOwogICAgICAgIHNlbGZkZXN0cnVjdChzZW5kZXIpOwogICAgfQoKICAgIGZ1bmN0aW9uIGNhbmNlbCgpIGV4dGVybmFsIHsKICAgICAgICByZXF1aXJlKG1zZy5zZW5kZXIgPT0gc2VuZGVyLCAiIXNlbmRlciIpOwogICAgICAgIHJlcXVpcmUoYmxvY2sudGltZXN0YW1wID49IGV4cGlyZXNBdCwgIiFleHBpcmVkIik7CiAgICAgICAgc2VsZmRlc3RydWN0KHNlbmRlcik7CiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)