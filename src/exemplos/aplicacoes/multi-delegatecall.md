# Multi Delegatecall

Um exemplo de chamada de várias funções com uma única transação, usando `delegatecall`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MultiDelegatecall {
    error DelegatecallFailed();

    function multiDelegatecall(bytes[] memory data)
        external
        payable
        returns (bytes[] memory results)
    {
        results = new bytes[](data.length);

        for (uint i; i < data.length; i++) {
            (bool ok, bytes memory res) = address(this).delegatecall(data[i]);
            if (!ok) {
                revert DelegatecallFailed();
            }
            results[i] = res;
        }
    }
}

// Por que usar a chamada multi delegatecall? Por que não multi call?
// alice -> multi call --- chama ---> test (msg.sender = multi call)
// alice -> test --- delegatecall ---> test (msg.sender = alice)
contract TestMultiDelegatecall is MultiDelegatecall {
    event Log(address caller, string func, uint i);

    function func1(uint x, uint y) external {
        // msg.sender = alice
        emit Log(msg.sender, "func1", x + y);
    }

    function func2() external returns (uint) {
        // msg.sender = alice
        emit Log(msg.sender, "func2", 2);
        return 111;
    }

    mapping(address => uint) public balanceOf;

    // AVISO: código inseguro quando usado em combinação com multi-delegatecall
    // o usuário pode cunhar várias vezes pelo preço de msg.value
    function mint() external payable {
        balanceOf[msg.sender] += msg.value;
    }
}

contract Helper {
    function getFunc1Data(uint x, uint y) external pure returns (bytes memory) {
        return abi.encodeWithSelector(TestMultiDelegatecall.func1.selector, x, y);
    }

    function getFunc2Data() external pure returns (bytes memory) {
        return abi.encodeWithSelector(TestMultiDelegatecall.func2.selector);
    }

    function getMintData() external pure returns (bytes memory) {
        return abi.encodeWithSelector(TestMultiDelegatecall.mint.selector);
    }
}
```

## Teste no Remix

- [MultiDelegatecall.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IE11bHRpRGVsZWdhdGVjYWxsIHsKICAgIGVycm9yIERlbGVnYXRlY2FsbEZhaWxlZCgpOwoKICAgIGZ1bmN0aW9uIG11bHRpRGVsZWdhdGVjYWxsKGJ5dGVzW10gbWVtb3J5IGRhdGEpCiAgICAgICAgZXh0ZXJuYWwKICAgICAgICBwYXlhYmxlCiAgICAgICAgcmV0dXJucyAoYnl0ZXNbXSBtZW1vcnkgcmVzdWx0cykKICAgIHsKICAgICAgICByZXN1bHRzID0gbmV3IGJ5dGVzW10oZGF0YS5sZW5ndGgpOwoKICAgICAgICBmb3IgKHVpbnQgaTsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgKGJvb2wgb2ssIGJ5dGVzIG1lbW9yeSByZXMpID0gYWRkcmVzcyh0aGlzKS5kZWxlZ2F0ZWNhbGwoZGF0YVtpXSk7CiAgICAgICAgICAgIGlmICghb2spIHsKICAgICAgICAgICAgICAgIHJldmVydCBEZWxlZ2F0ZWNhbGxGYWlsZWQoKTsKICAgICAgICAgICAgfQogICAgICAgICAgICByZXN1bHRzW2ldID0gcmVzOwogICAgICAgIH0KICAgIH0KfQoKLy8gUG9yIHF1ZSB1c2FyIGEgY2hhbWFkYSBtdWx0aSBkZWxlZ2F0ZWNhbGw/IFBvciBxdWUgbmFvIG11bHRpIGNhbGw/Ci8vIGFsaWNlIC0+IG11bHRpIGNhbGwgLS0tIGNoYW1hIC0tLT4gdGVzdCAobXNnLnNlbmRlciA9IG11bHRpIGNhbGwpCi8vIGFsaWNlIC0+IHRlc3QgLS0tIGRlbGVnYXRlY2FsbCAtLS0+IHRlc3QgKG1zZy5zZW5kZXIgPSBhbGljZSkKY29udHJhY3QgVGVzdE11bHRpRGVsZWdhdGVjYWxsIGlzIE11bHRpRGVsZWdhdGVjYWxsIHsKICAgIGV2ZW50IExvZyhhZGRyZXNzIGNhbGxlciwgc3RyaW5nIGZ1bmMsIHVpbnQgaSk7CgogICAgZnVuY3Rpb24gZnVuYzEodWludCB4LCB1aW50IHkpIGV4dGVybmFsIHsKICAgICAgICAvLyBtc2cuc2VuZGVyID0gYWxpY2UKICAgICAgICBlbWl0IExvZyhtc2cuc2VuZGVyLCAiZnVuYzEiLCB4ICsgeSk7CiAgICB9CgogICAgZnVuY3Rpb24gZnVuYzIoKSBleHRlcm5hbCByZXR1cm5zICh1aW50KSB7CiAgICAgICAgLy8gbXNnLnNlbmRlciA9IGFsaWNlCiAgICAgICAgZW1pdCBMb2cobXNnLnNlbmRlciwgImZ1bmMyIiwgMik7CiAgICAgICAgcmV0dXJuIDExMTsKICAgIH0KCiAgICBtYXBwaW5nKGFkZHJlc3MgPT4gdWludCkgcHVibGljIGJhbGFuY2VPZjsKCiAgICAvLyBBVklTTzogY29kaWdvIGluc2VndXJvIHF1YW5kbyB1c2FkbyBlbSBjb21iaW5hY2FvIGNvbSBtdWx0aS1kZWxlZ2F0ZWNhbGwKICAgIC8vIG8gdXN1YXJpbyBwb2RlIGN1bmhhciB2YXJpYXMgdmV6ZXMgcGVsbyBwcmVjbyBkZSBtc2cudmFsdWUKICAgIGZ1bmN0aW9uIG1pbnQoKSBleHRlcm5hbCBwYXlhYmxlIHsKICAgICAgICBiYWxhbmNlT2ZbbXNnLnNlbmRlcl0gKz0gbXNnLnZhbHVlOwogICAgfQp9Cgpjb250cmFjdCBIZWxwZXIgewogICAgZnVuY3Rpb24gZ2V0RnVuYzFEYXRhKHVpbnQgeCwgdWludCB5KSBleHRlcm5hbCBwdXJlIHJldHVybnMgKGJ5dGVzIG1lbW9yeSkgewogICAgICAgIHJldHVybiBhYmkuZW5jb2RlV2l0aFNlbGVjdG9yKFRlc3RNdWx0aURlbGVnYXRlY2FsbC5mdW5jMS5zZWxlY3RvciwgeCwgeSk7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0RnVuYzJEYXRhKCkgZXh0ZXJuYWwgcHVyZSByZXR1cm5zIChieXRlcyBtZW1vcnkpIHsKICAgICAgICByZXR1cm4gYWJpLmVuY29kZVdpdGhTZWxlY3RvcihUZXN0TXVsdGlEZWxlZ2F0ZWNhbGwuZnVuYzIuc2VsZWN0b3IpOwogICAgfQoKICAgIGZ1bmN0aW9uIGdldE1pbnREYXRhKCkgZXh0ZXJuYWwgcHVyZSByZXR1cm5zIChieXRlcyBtZW1vcnkpIHsKICAgICAgICByZXR1cm4gYWJpLmVuY29kZVdpdGhTZWxlY3RvcihUZXN0TXVsdGlEZWxlZ2F0ZWNhbGwubWludC5zZWxlY3Rvcik7CiAgICB9Cn0=&version=soljson-v0.8.20+commit.a1b79de6.js)
