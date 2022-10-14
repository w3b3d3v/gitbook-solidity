# Carteira Ether

Um exemplo de uma carteira básica.

- Qualquer pessoa pode enviar ETH.
- Somente o proprietário pode retirar.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract EtherWallet {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {}

    function withdraw(uint _amount) external {
        require(msg.sender == owner, "Quem está chamando não é o dono");
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
```

## Teste no Remix

- [EtherWallet.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IEV0aGVyV2FsbGV0IHsKICAgIGFkZHJlc3MgcGF5YWJsZSBwdWJsaWMgb3duZXI7CgogICAgY29uc3RydWN0b3IoKSB7CiAgICAgICAgb3duZXIgPSBwYXlhYmxlKG1zZy5zZW5kZXIpOwogICAgfQoKICAgIHJlY2VpdmUoKSBleHRlcm5hbCBwYXlhYmxlIHt9CgogICAgZnVuY3Rpb24gd2l0aGRyYXcodWludCBfYW1vdW50KSBleHRlcm5hbCB7CiAgICAgICAgcmVxdWlyZShtc2cuc2VuZGVyID09IG93bmVyLCAiUXVlbSBlc3RhIGNoYW1hbmRvIG5hbyBlIG8gZG9ubyIpOwogICAgICAgIHBheWFibGUobXNnLnNlbmRlcikudHJhbnNmZXIoX2Ftb3VudCk7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0QmFsYW5jZSgpIGV4dGVybmFsIHZpZXcgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiBhZGRyZXNzKHRoaXMpLmJhbGFuY2U7CiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)