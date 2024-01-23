# Gravar em qualquer slot

O armazenamento de solidity é como um array de comprimento 2<sup>256</sup>. Cada slot no array pode armazenar 32 bytes.

As variáveis ​​de estado definem quais slots serão usados ​​para armazenar dados.

No entanto, usando assembly, você pode gravar em qualquer slot.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library StorageSlot {
    // Envolver o endereço numa estrutura para que possa ser passado como um ponteiro de armazenamento
    struct AddressSlot {
        address value;
    }

    function getAddressSlot(
        bytes32 slot
    ) internal pure returns (AddressSlot storage pointer) {
        assembly {
            // Obtém o ponteiro para AddressSlot armazenado na slot
            pointer.slot := slot
        }
    }
}

contract TestSlot {
    bytes32 public constant TEST_SLOT = keccak256("TEST_SLOT");

    function write(address _addr) external {
        StorageSlot.AddressSlot storage data = StorageSlot.getAddressSlot(TEST_SLOT);
        data.value = _addr;
    }

    function get() external view returns (address) {
        StorageSlot.AddressSlot storage data = StorageSlot.getAddressSlot(TEST_SLOT);
        return data.value;
    }
}
```

## Teste no Remix

- [Slot.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmxpYnJhcnkgU3RvcmFnZVNsb3QgewogICAgLy8gRW52b2x2ZXIgbyBlbmRlcmVjbyBudW1hIGVzdHJ1dHVyYSBwYXJhIHF1ZSBwb3NzYSBzZXIgcGFzc2FkbyBjb21vIHVtIHBvbnRlaXJvIGRlIGFybWF6ZW5hbWVudG8KICAgIHN0cnVjdCBBZGRyZXNzU2xvdCB7CiAgICAgICAgYWRkcmVzcyB2YWx1ZTsKICAgIH0KCiAgICBmdW5jdGlvbiBnZXRBZGRyZXNzU2xvdCgKICAgICAgICBieXRlczMyIHNsb3QKICAgICkgaW50ZXJuYWwgcHVyZSByZXR1cm5zIChBZGRyZXNzU2xvdCBzdG9yYWdlIHBvaW50ZXIpIHsKICAgICAgICBhc3NlbWJseSB7CiAgICAgICAgICAgIC8vIE9idGVtIG8gcG9udGVpcm8gcGFyYSBBZGRyZXNzU2xvdCBhcm1hemVuYWRvIG5hIHNsb3QKICAgICAgICAgICAgcG9pbnRlci5zbG90IDo9IHNsb3QKICAgICAgICB9CiAgICB9Cn0KCmNvbnRyYWN0IFRlc3RTbG90IHsKICAgIGJ5dGVzMzIgcHVibGljIGNvbnN0YW50IFRFU1RfU0xPVCA9IGtlY2NhazI1NigiVEVTVF9TTE9UIik7CgogICAgZnVuY3Rpb24gd3JpdGUoYWRkcmVzcyBfYWRkcikgZXh0ZXJuYWwgewogICAgICAgIFN0b3JhZ2VTbG90LkFkZHJlc3NTbG90IHN0b3JhZ2UgZGF0YSA9IFN0b3JhZ2VTbG90LmdldEFkZHJlc3NTbG90KFRFU1RfU0xPVCk7CiAgICAgICAgZGF0YS52YWx1ZSA9IF9hZGRyOwogICAgfQoKICAgIGZ1bmN0aW9uIGdldCgpIGV4dGVybmFsIHZpZXcgcmV0dXJucyAoYWRkcmVzcykgewogICAgICAgIFN0b3JhZ2VTbG90LkFkZHJlc3NTbG90IHN0b3JhZ2UgZGF0YSA9IFN0b3JhZ2VTbG90LmdldEFkZHJlc3NTbG90KFRFU1RfU0xPVCk7CiAgICAgICAgcmV0dXJuIGRhdGEudmFsdWU7CiAgICB9Cn0=&version=soljson-v0.8.20+commit.a1b79de6.js)
