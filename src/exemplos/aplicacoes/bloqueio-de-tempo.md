# Bloqueio de tempo

`TimeLock` é um contrato que publica uma transação a ser executada no futuro. Após um período de espera mínimo, a transação pode ser executada.

`TimeLocks` são comumente usados ​​em DAOs.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TimeLock {
    error NotOwnerError();
    error AlreadyQueuedError(bytes32 txId);
    error TimestampNotInRangeError(uint blockTimestamp, uint timestamp);
    error NotQueuedError(bytes32 txId);
    error TimestampNotPassedError(uint blockTimestmap, uint timestamp);
    error TimestampExpiredError(uint blockTimestamp, uint expiresAt);
    error TxFailedError();

    event Queue(
        bytes32 indexed txId,
        address indexed target,
        uint value,
        string func,
        bytes data,
        uint timestamp
    );
    event Execute(
        bytes32 indexed txId,
        address indexed target,
        uint value,
        string func,
        bytes data,
        uint timestamp
    );
    event Cancel(bytes32 indexed txId);

    uint public constant MIN_DELAY = 10; // segundos
    uint public constant MAX_DELAY = 1000; // segundos
    uint public constant GRACE_PERIOD = 1000; // segundos

    address public owner;
    // tx id => queued
    mapping(bytes32 => bool) public queued;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwnerError();
        }
        _;
    }

    receive() external payable {}

    function getTxId(
        address _target,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        uint _timestamp
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(_target, _value, _func, _data, _timestamp));
    }

    /**
     * @param _target Address of contract or account to call
     * @param _value Amount of ETH to send
     * @param _func Function signature, for example "foo(address,uint256)"
     * @param _data ABI encoded data send.
     * @param _timestamp Timestamp after which the transaction can be executed.
     */
    function queue(
        address _target,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        uint _timestamp
    ) external onlyOwner returns (bytes32 txId) {
        txId = getTxId(_target, _value, _func, _data, _timestamp);
        if (queued[txId]) {
            revert AlreadyQueuedError(txId);
        }
        // ---|------------|---------------|-------
        //  block    block + min     block + max
        if (
            _timestamp < block.timestamp + MIN_DELAY ||
            _timestamp > block.timestamp + MAX_DELAY
        ) {
            revert TimestampNotInRangeError(block.timestamp, _timestamp);
        }

        queued[txId] = true;

        emit Queue(txId, _target, _value, _func, _data, _timestamp);
    }

    function execute(
        address _target,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        uint _timestamp
    ) external payable onlyOwner returns (bytes memory) {
        bytes32 txId = getTxId(_target, _value, _func, _data, _timestamp);
        if (!queued[txId]) {
            revert NotQueuedError(txId);
        }
        // ----|-------------------|-------
        //  timestamp    timestamp + período de carência
        if (block.timestamp < _timestamp) {
            revert TimestampNotPassedError(block.timestamp, _timestamp);
        }
        if (block.timestamp > _timestamp + GRACE_PERIOD) {
            revert TimestampExpiredError(block.timestamp, _timestamp + GRACE_PERIOD);
        }

        queued[txId] = false;

        // preparar dados
        bytes memory data;
        if (bytes(_func).length > 0) {
            // data = func selector + _data
            data = abi.encodePacked(bytes4(keccak256(bytes(_func))), _data);
        } else {
            // chamada de fallback com dados
            data = _data;
        }

        // alvo de chamada
        (bool ok, bytes memory res) = _target.call{value: _value}(data);
        if (!ok) {
            revert TxFailedError();
        }

        emit Execute(txId, _target, _value, _func, _data, _timestamp);

        return res;
    }

    function cancel(bytes32 _txId) external onlyOwner {
        if (!queued[_txId]) {
            revert NotQueuedError(_txId);
        }

        queued[_txId] = false;

        emit Cancel(_txId);
    }
}
```

## Teste no Remix

- [TimeLock.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IFRpbWVMb2NrIHsKICAgIGVycm9yIE5vdE93bmVyRXJyb3IoKTsKICAgIGVycm9yIEFscmVhZHlRdWV1ZWRFcnJvcihieXRlczMyIHR4SWQpOwogICAgZXJyb3IgVGltZXN0YW1wTm90SW5SYW5nZUVycm9yKHVpbnQgYmxvY2tUaW1lc3RhbXAsIHVpbnQgdGltZXN0YW1wKTsKICAgIGVycm9yIE5vdFF1ZXVlZEVycm9yKGJ5dGVzMzIgdHhJZCk7CiAgICBlcnJvciBUaW1lc3RhbXBOb3RQYXNzZWRFcnJvcih1aW50IGJsb2NrVGltZXN0bWFwLCB1aW50IHRpbWVzdGFtcCk7CiAgICBlcnJvciBUaW1lc3RhbXBFeHBpcmVkRXJyb3IodWludCBibG9ja1RpbWVzdGFtcCwgdWludCBleHBpcmVzQXQpOwogICAgZXJyb3IgVHhGYWlsZWRFcnJvcigpOwoKICAgIGV2ZW50IFF1ZXVlKAogICAgICAgIGJ5dGVzMzIgaW5kZXhlZCB0eElkLAogICAgICAgIGFkZHJlc3MgaW5kZXhlZCB0YXJnZXQsCiAgICAgICAgdWludCB2YWx1ZSwKICAgICAgICBzdHJpbmcgZnVuYywKICAgICAgICBieXRlcyBkYXRhLAogICAgICAgIHVpbnQgdGltZXN0YW1wCiAgICApOwogICAgZXZlbnQgRXhlY3V0ZSgKICAgICAgICBieXRlczMyIGluZGV4ZWQgdHhJZCwKICAgICAgICBhZGRyZXNzIGluZGV4ZWQgdGFyZ2V0LAogICAgICAgIHVpbnQgdmFsdWUsCiAgICAgICAgc3RyaW5nIGZ1bmMsCiAgICAgICAgYnl0ZXMgZGF0YSwKICAgICAgICB1aW50IHRpbWVzdGFtcAogICAgKTsKICAgIGV2ZW50IENhbmNlbChieXRlczMyIGluZGV4ZWQgdHhJZCk7CgogICAgdWludCBwdWJsaWMgY29uc3RhbnQgTUlOX0RFTEFZID0gMTA7IC8vIHNlZ3VuZG9zCiAgICB1aW50IHB1YmxpYyBjb25zdGFudCBNQVhfREVMQVkgPSAxMDAwOyAvLyBzZWd1bmRvcwogICAgdWludCBwdWJsaWMgY29uc3RhbnQgR1JBQ0VfUEVSSU9EID0gMTAwMDsgLy8gc2VndW5kb3MKCiAgICBhZGRyZXNzIHB1YmxpYyBvd25lcjsKICAgIC8vIHR4IGlkID0+IHF1ZXVlZAogICAgbWFwcGluZyhieXRlczMyID0+IGJvb2wpIHB1YmxpYyBxdWV1ZWQ7CgogICAgY29uc3RydWN0b3IoKSB7CiAgICAgICAgb3duZXIgPSBtc2cuc2VuZGVyOwogICAgfQoKICAgIG1vZGlmaWVyIG9ubHlPd25lcigpIHsKICAgICAgICBpZiAobXNnLnNlbmRlciAhPSBvd25lcikgewogICAgICAgICAgICByZXZlcnQgTm90T3duZXJFcnJvcigpOwogICAgICAgIH0KICAgICAgICBfOwogICAgfQoKICAgIHJlY2VpdmUoKSBleHRlcm5hbCBwYXlhYmxlIHt9CgogICAgZnVuY3Rpb24gZ2V0VHhJZCgKICAgICAgICBhZGRyZXNzIF90YXJnZXQsCiAgICAgICAgdWludCBfdmFsdWUsCiAgICAgICAgc3RyaW5nIGNhbGxkYXRhIF9mdW5jLAogICAgICAgIGJ5dGVzIGNhbGxkYXRhIF9kYXRhLAogICAgICAgIHVpbnQgX3RpbWVzdGFtcAogICAgKSBwdWJsaWMgcHVyZSByZXR1cm5zIChieXRlczMyKSB7CiAgICAgICAgcmV0dXJuIGtlY2NhazI1NihhYmkuZW5jb2RlKF90YXJnZXQsIF92YWx1ZSwgX2Z1bmMsIF9kYXRhLCBfdGltZXN0YW1wKSk7CiAgICB9CgogICAgLyoqCiAgICAgKiBAcGFyYW0gX3RhcmdldCBBZGRyZXNzIG9mIGNvbnRyYWN0IG9yIGFjY291bnQgdG8gY2FsbAogICAgICogQHBhcmFtIF92YWx1ZSBBbW91bnQgb2YgRVRIIHRvIHNlbmQKICAgICAqIEBwYXJhbSBfZnVuYyBGdW5jdGlvbiBzaWduYXR1cmUsIGZvciBleGFtcGxlICJmb28oYWRkcmVzcyx1aW50MjU2KSIKICAgICAqIEBwYXJhbSBfZGF0YSBBQkkgZW5jb2RlZCBkYXRhIHNlbmQuCiAgICAgKiBAcGFyYW0gX3RpbWVzdGFtcCBUaW1lc3RhbXAgYWZ0ZXIgd2hpY2ggdGhlIHRyYW5zYWN0aW9uIGNhbiBiZSBleGVjdXRlZC4KICAgICAqLwogICAgZnVuY3Rpb24gcXVldWUoCiAgICAgICAgYWRkcmVzcyBfdGFyZ2V0LAogICAgICAgIHVpbnQgX3ZhbHVlLAogICAgICAgIHN0cmluZyBjYWxsZGF0YSBfZnVuYywKICAgICAgICBieXRlcyBjYWxsZGF0YSBfZGF0YSwKICAgICAgICB1aW50IF90aW1lc3RhbXAKICAgICkgZXh0ZXJuYWwgb25seU93bmVyIHJldHVybnMgKGJ5dGVzMzIgdHhJZCkgewogICAgICAgIHR4SWQgPSBnZXRUeElkKF90YXJnZXQsIF92YWx1ZSwgX2Z1bmMsIF9kYXRhLCBfdGltZXN0YW1wKTsKICAgICAgICBpZiAocXVldWVkW3R4SWRdKSB7CiAgICAgICAgICAgIHJldmVydCBBbHJlYWR5UXVldWVkRXJyb3IodHhJZCk7CiAgICAgICAgfQogICAgICAgIC8vIC0tLXwtLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tfC0tLS0tLS0KICAgICAgICAvLyAgYmxvY2sgICAgYmxvY2sgKyBtaW4gICAgIGJsb2NrICsgbWF4CiAgICAgICAgaWYgKAogICAgICAgICAgICBfdGltZXN0YW1wIDwgYmxvY2sudGltZXN0YW1wICsgTUlOX0RFTEFZIHx8CiAgICAgICAgICAgIF90aW1lc3RhbXAgPiBibG9jay50aW1lc3RhbXAgKyBNQVhfREVMQVkKICAgICAgICApIHsKICAgICAgICAgICAgcmV2ZXJ0IFRpbWVzdGFtcE5vdEluUmFuZ2VFcnJvcihibG9jay50aW1lc3RhbXAsIF90aW1lc3RhbXApOwogICAgICAgIH0KCiAgICAgICAgcXVldWVkW3R4SWRdID0gdHJ1ZTsKCiAgICAgICAgZW1pdCBRdWV1ZSh0eElkLCBfdGFyZ2V0LCBfdmFsdWUsIF9mdW5jLCBfZGF0YSwgX3RpbWVzdGFtcCk7CiAgICB9CgogICAgZnVuY3Rpb24gZXhlY3V0ZSgKICAgICAgICBhZGRyZXNzIF90YXJnZXQsCiAgICAgICAgdWludCBfdmFsdWUsCiAgICAgICAgc3RyaW5nIGNhbGxkYXRhIF9mdW5jLAogICAgICAgIGJ5dGVzIGNhbGxkYXRhIF9kYXRhLAogICAgICAgIHVpbnQgX3RpbWVzdGFtcAogICAgKSBleHRlcm5hbCBwYXlhYmxlIG9ubHlPd25lciByZXR1cm5zIChieXRlcyBtZW1vcnkpIHsKICAgICAgICBieXRlczMyIHR4SWQgPSBnZXRUeElkKF90YXJnZXQsIF92YWx1ZSwgX2Z1bmMsIF9kYXRhLCBfdGltZXN0YW1wKTsKICAgICAgICBpZiAoIXF1ZXVlZFt0eElkXSkgewogICAgICAgICAgICByZXZlcnQgTm90UXVldWVkRXJyb3IodHhJZCk7CiAgICAgICAgfQogICAgICAgIC8vIC0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLXwtLS0tLS0tCiAgICAgICAgLy8gIHRpbWVzdGFtcCAgICB0aW1lc3RhbXAgKyBwZXJpb2RvIGRlIGNhcmVuY2lhCiAgICAgICAgaWYgKGJsb2NrLnRpbWVzdGFtcCA8IF90aW1lc3RhbXApIHsKICAgICAgICAgICAgcmV2ZXJ0IFRpbWVzdGFtcE5vdFBhc3NlZEVycm9yKGJsb2NrLnRpbWVzdGFtcCwgX3RpbWVzdGFtcCk7CiAgICAgICAgfQogICAgICAgIGlmIChibG9jay50aW1lc3RhbXAgPiBfdGltZXN0YW1wICsgR1JBQ0VfUEVSSU9EKSB7CiAgICAgICAgICAgIHJldmVydCBUaW1lc3RhbXBFeHBpcmVkRXJyb3IoYmxvY2sudGltZXN0YW1wLCBfdGltZXN0YW1wICsgR1JBQ0VfUEVSSU9EKTsKICAgICAgICB9CgogICAgICAgIHF1ZXVlZFt0eElkXSA9IGZhbHNlOwoKICAgICAgICAvLyBwcmVwYXJhciBkYWRvcwogICAgICAgIGJ5dGVzIG1lbW9yeSBkYXRhOwogICAgICAgIGlmIChieXRlcyhfZnVuYykubGVuZ3RoID4gMCkgewogICAgICAgICAgICAvLyBkYXRhID0gZnVuYyBzZWxlY3RvciArIF9kYXRhCiAgICAgICAgICAgIGRhdGEgPSBhYmkuZW5jb2RlUGFja2VkKGJ5dGVzNChrZWNjYWsyNTYoYnl0ZXMoX2Z1bmMpKSksIF9kYXRhKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAvLyBjaGFtYWRhIGRlIGZhbGxiYWNrIGNvbSBkYWRvcwogICAgICAgICAgICBkYXRhID0gX2RhdGE7CiAgICAgICAgfQoKICAgICAgICAvLyBhbHZvIGRlIGNoYW1hZGEKICAgICAgICAoYm9vbCBvaywgYnl0ZXMgbWVtb3J5IHJlcykgPSBfdGFyZ2V0LmNhbGx7dmFsdWU6IF92YWx1ZX0oZGF0YSk7CiAgICAgICAgaWYgKCFvaykgewogICAgICAgICAgICByZXZlcnQgVHhGYWlsZWRFcnJvcigpOwogICAgICAgIH0KCiAgICAgICAgZW1pdCBFeGVjdXRlKHR4SWQsIF90YXJnZXQsIF92YWx1ZSwgX2Z1bmMsIF9kYXRhLCBfdGltZXN0YW1wKTsKCiAgICAgICAgcmV0dXJuIHJlczsKICAgIH0KCiAgICBmdW5jdGlvbiBjYW5jZWwoYnl0ZXMzMiBfdHhJZCkgZXh0ZXJuYWwgb25seU93bmVyIHsKICAgICAgICBpZiAoIXF1ZXVlZFtfdHhJZF0pIHsKICAgICAgICAgICAgcmV2ZXJ0IE5vdFF1ZXVlZEVycm9yKF90eElkKTsKICAgICAgICB9CgogICAgICAgIHF1ZXVlZFtfdHhJZF0gPSBmYWxzZTsKCiAgICAgICAgZW1pdCBDYW5jZWwoX3R4SWQpOwogICAgfQp9&version=soljson-v0.8.20+commit.a1b79de6.js)
