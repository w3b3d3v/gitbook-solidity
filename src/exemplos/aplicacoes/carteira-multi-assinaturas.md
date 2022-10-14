# Carteira Multi-Sig

Vamos criar uma carteira multi-sig. Aqui estão as especificações.

Os proprietários da carteira podem

- submeter uma transação
- aprovar e revogar aprovação de transações pendentes
- qualquer um pode executar uma transação depois que os proprietários tenham aprovado.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract MultiSigWallet {
    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTransaction(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public numConfirmationsRequired;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
    }

    // mapping de tx index => owner => bool
    mapping(uint => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Não é  o dono");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx não existe");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx já executado");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx já confirmado");
        _;
    }

    constructor(address[] memory _owners, uint _numConfirmationsRequired) {
        require(_owners.length > 0, "precisa do dono");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "número inválido de confirmações necessárias"
        );

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "dono inválido");
            require(!isOwner[owner], "dono n]ap é único");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submitTransaction(
        address _to,
        uint _value,
        bytes memory _data
    ) public onlyOwner {
        uint txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0
            })
        );

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    function confirmTransaction(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "não pode executar tx"
        );

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "tx falhou");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function revokeConfirmation(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx não confirmado");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(uint _txIndex)
        public
        view
        returns (
            address to,
            uint value,
            bytes memory data,
            bool executed,
            uint numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }
}
```

Aqui está um contrato para testar o envio de transações da carteira multi-sig

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract TestContract {
    uint public i;

    function callMe(uint j) public {
        i += j;
    }

    function getData() public pure returns (bytes memory) {
        return abi.encodeWithSignature("callMe(uint256)", 123);
    }
}
```

## Teste no Remix

- [MultiSigWallet.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IE11bHRpU2lnV2FsbGV0IHsKICAgIGV2ZW50IERlcG9zaXQoYWRkcmVzcyBpbmRleGVkIHNlbmRlciwgdWludCBhbW91bnQsIHVpbnQgYmFsYW5jZSk7CiAgICBldmVudCBTdWJtaXRUcmFuc2FjdGlvbigKICAgICAgICBhZGRyZXNzIGluZGV4ZWQgb3duZXIsCiAgICAgICAgdWludCBpbmRleGVkIHR4SW5kZXgsCiAgICAgICAgYWRkcmVzcyBpbmRleGVkIHRvLAogICAgICAgIHVpbnQgdmFsdWUsCiAgICAgICAgYnl0ZXMgZGF0YQogICAgKTsKICAgIGV2ZW50IENvbmZpcm1UcmFuc2FjdGlvbihhZGRyZXNzIGluZGV4ZWQgb3duZXIsIHVpbnQgaW5kZXhlZCB0eEluZGV4KTsKICAgIGV2ZW50IFJldm9rZUNvbmZpcm1hdGlvbihhZGRyZXNzIGluZGV4ZWQgb3duZXIsIHVpbnQgaW5kZXhlZCB0eEluZGV4KTsKICAgIGV2ZW50IEV4ZWN1dGVUcmFuc2FjdGlvbihhZGRyZXNzIGluZGV4ZWQgb3duZXIsIHVpbnQgaW5kZXhlZCB0eEluZGV4KTsKCiAgICBhZGRyZXNzW10gcHVibGljIG93bmVyczsKICAgIG1hcHBpbmcoYWRkcmVzcyA9PiBib29sKSBwdWJsaWMgaXNPd25lcjsKICAgIHVpbnQgcHVibGljIG51bUNvbmZpcm1hdGlvbnNSZXF1aXJlZDsKCiAgICBzdHJ1Y3QgVHJhbnNhY3Rpb24gewogICAgICAgIGFkZHJlc3MgdG87CiAgICAgICAgdWludCB2YWx1ZTsKICAgICAgICBieXRlcyBkYXRhOwogICAgICAgIGJvb2wgZXhlY3V0ZWQ7CiAgICAgICAgdWludCBudW1Db25maXJtYXRpb25zOwogICAgfQoKICAgIC8vIG1hcHBpbmcgZGUgdHggaW5kZXggPT4gb3duZXIgPT4gYm9vbAogICAgbWFwcGluZyh1aW50ID0+IG1hcHBpbmcoYWRkcmVzcyA9PiBib29sKSkgcHVibGljIGlzQ29uZmlybWVkOwoKICAgIFRyYW5zYWN0aW9uW10gcHVibGljIHRyYW5zYWN0aW9uczsKCiAgICBtb2RpZmllciBvbmx5T3duZXIoKSB7CiAgICAgICAgcmVxdWlyZShpc093bmVyW21zZy5zZW5kZXJdLCAiTmFvIGUgIG8gZG9ubyIpOwogICAgICAgIF87CiAgICB9CgogICAgbW9kaWZpZXIgdHhFeGlzdHModWludCBfdHhJbmRleCkgewogICAgICAgIHJlcXVpcmUoX3R4SW5kZXggPCB0cmFuc2FjdGlvbnMubGVuZ3RoLCAidHggbmFvIGV4aXN0ZSIpOwogICAgICAgIF87CiAgICB9CgogICAgbW9kaWZpZXIgbm90RXhlY3V0ZWQodWludCBfdHhJbmRleCkgewogICAgICAgIHJlcXVpcmUoIXRyYW5zYWN0aW9uc1tfdHhJbmRleF0uZXhlY3V0ZWQsICJ0eCBqYSBleGVjdXRhZG8iKTsKICAgICAgICBfOwogICAgfQoKICAgIG1vZGlmaWVyIG5vdENvbmZpcm1lZCh1aW50IF90eEluZGV4KSB7CiAgICAgICAgcmVxdWlyZSghaXNDb25maXJtZWRbX3R4SW5kZXhdW21zZy5zZW5kZXJdLCAidHggamEgY29uZmlybWFkbyIpOwogICAgICAgIF87CiAgICB9CgogICAgY29uc3RydWN0b3IoYWRkcmVzc1tdIG1lbW9yeSBfb3duZXJzLCB1aW50IF9udW1Db25maXJtYXRpb25zUmVxdWlyZWQpIHsKICAgICAgICByZXF1aXJlKF9vd25lcnMubGVuZ3RoID4gMCwgInByZWNpc2EgZG8gZG9ubyIpOwogICAgICAgIHJlcXVpcmUoCiAgICAgICAgICAgIF9udW1Db25maXJtYXRpb25zUmVxdWlyZWQgPiAwICYmCiAgICAgICAgICAgICAgICBfbnVtQ29uZmlybWF0aW9uc1JlcXVpcmVkIDw9IF9vd25lcnMubGVuZ3RoLAogICAgICAgICAgICAibnVtZXJvIGludmFsaWRvIGRlIGNvbmZpcm1hY29lcyBuZWNlc3NhcmlhcyIKICAgICAgICApOwoKICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBfb3duZXJzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICAgIGFkZHJlc3Mgb3duZXIgPSBfb3duZXJzW2ldOwoKICAgICAgICAgICAgcmVxdWlyZShvd25lciAhPSBhZGRyZXNzKDApLCAiZG9ubyBpbnZhbGlkbyIpOwogICAgICAgICAgICByZXF1aXJlKCFpc093bmVyW293bmVyXSwgImRvbm8gbl1hcCBlIHVuaWNvIik7CgogICAgICAgICAgICBpc093bmVyW293bmVyXSA9IHRydWU7CiAgICAgICAgICAgIG93bmVycy5wdXNoKG93bmVyKTsKICAgICAgICB9CgogICAgICAgIG51bUNvbmZpcm1hdGlvbnNSZXF1aXJlZCA9IF9udW1Db25maXJtYXRpb25zUmVxdWlyZWQ7CiAgICB9CgogICAgcmVjZWl2ZSgpIGV4dGVybmFsIHBheWFibGUgewogICAgICAgIGVtaXQgRGVwb3NpdChtc2cuc2VuZGVyLCBtc2cudmFsdWUsIGFkZHJlc3ModGhpcykuYmFsYW5jZSk7CiAgICB9CgogICAgZnVuY3Rpb24gc3VibWl0VHJhbnNhY3Rpb24oCiAgICAgICAgYWRkcmVzcyBfdG8sCiAgICAgICAgdWludCBfdmFsdWUsCiAgICAgICAgYnl0ZXMgbWVtb3J5IF9kYXRhCiAgICApIHB1YmxpYyBvbmx5T3duZXIgewogICAgICAgIHVpbnQgdHhJbmRleCA9IHRyYW5zYWN0aW9ucy5sZW5ndGg7CgogICAgICAgIHRyYW5zYWN0aW9ucy5wdXNoKAogICAgICAgICAgICBUcmFuc2FjdGlvbih7CiAgICAgICAgICAgICAgICB0bzogX3RvLAogICAgICAgICAgICAgICAgdmFsdWU6IF92YWx1ZSwKICAgICAgICAgICAgICAgIGRhdGE6IF9kYXRhLAogICAgICAgICAgICAgICAgZXhlY3V0ZWQ6IGZhbHNlLAogICAgICAgICAgICAgICAgbnVtQ29uZmlybWF0aW9uczogMAogICAgICAgICAgICB9KQogICAgICAgICk7CgogICAgICAgIGVtaXQgU3VibWl0VHJhbnNhY3Rpb24obXNnLnNlbmRlciwgdHhJbmRleCwgX3RvLCBfdmFsdWUsIF9kYXRhKTsKICAgIH0KCiAgICBmdW5jdGlvbiBjb25maXJtVHJhbnNhY3Rpb24odWludCBfdHhJbmRleCkKICAgICAgICBwdWJsaWMKICAgICAgICBvbmx5T3duZXIKICAgICAgICB0eEV4aXN0cyhfdHhJbmRleCkKICAgICAgICBub3RFeGVjdXRlZChfdHhJbmRleCkKICAgICAgICBub3RDb25maXJtZWQoX3R4SW5kZXgpCiAgICB7CiAgICAgICAgVHJhbnNhY3Rpb24gc3RvcmFnZSB0cmFuc2FjdGlvbiA9IHRyYW5zYWN0aW9uc1tfdHhJbmRleF07CiAgICAgICAgdHJhbnNhY3Rpb24ubnVtQ29uZmlybWF0aW9ucyArPSAxOwogICAgICAgIGlzQ29uZmlybWVkW190eEluZGV4XVttc2cuc2VuZGVyXSA9IHRydWU7CgogICAgICAgIGVtaXQgQ29uZmlybVRyYW5zYWN0aW9uKG1zZy5zZW5kZXIsIF90eEluZGV4KTsKICAgIH0KCiAgICBmdW5jdGlvbiBleGVjdXRlVHJhbnNhY3Rpb24odWludCBfdHhJbmRleCkKICAgICAgICBwdWJsaWMKICAgICAgICBvbmx5T3duZXIKICAgICAgICB0eEV4aXN0cyhfdHhJbmRleCkKICAgICAgICBub3RFeGVjdXRlZChfdHhJbmRleCkKICAgIHsKICAgICAgICBUcmFuc2FjdGlvbiBzdG9yYWdlIHRyYW5zYWN0aW9uID0gdHJhbnNhY3Rpb25zW190eEluZGV4XTsKCiAgICAgICAgcmVxdWlyZSgKICAgICAgICAgICAgdHJhbnNhY3Rpb24ubnVtQ29uZmlybWF0aW9ucyA+PSBudW1Db25maXJtYXRpb25zUmVxdWlyZWQsCiAgICAgICAgICAgICJuYW8gcG9kZSBleGVjdXRhciB0eCIKICAgICAgICApOwoKICAgICAgICB0cmFuc2FjdGlvbi5leGVjdXRlZCA9IHRydWU7CgogICAgICAgIChib29sIHN1Y2Nlc3MsICkgPSB0cmFuc2FjdGlvbi50by5jYWxse3ZhbHVlOiB0cmFuc2FjdGlvbi52YWx1ZX0oCiAgICAgICAgICAgIHRyYW5zYWN0aW9uLmRhdGEKICAgICAgICApOwogICAgICAgIHJlcXVpcmUoc3VjY2VzcywgInR4IGZhbGhvdSIpOwoKICAgICAgICBlbWl0IEV4ZWN1dGVUcmFuc2FjdGlvbihtc2cuc2VuZGVyLCBfdHhJbmRleCk7CiAgICB9CgogICAgZnVuY3Rpb24gcmV2b2tlQ29uZmlybWF0aW9uKHVpbnQgX3R4SW5kZXgpCiAgICAgICAgcHVibGljCiAgICAgICAgb25seU93bmVyCiAgICAgICAgdHhFeGlzdHMoX3R4SW5kZXgpCiAgICAgICAgbm90RXhlY3V0ZWQoX3R4SW5kZXgpCiAgICB7CiAgICAgICAgVHJhbnNhY3Rpb24gc3RvcmFnZSB0cmFuc2FjdGlvbiA9IHRyYW5zYWN0aW9uc1tfdHhJbmRleF07CgogICAgICAgIHJlcXVpcmUoaXNDb25maXJtZWRbX3R4SW5kZXhdW21zZy5zZW5kZXJdLCAidHggbmFvIGNvbmZpcm1hZG8iKTsKCiAgICAgICAgdHJhbnNhY3Rpb24ubnVtQ29uZmlybWF0aW9ucyAtPSAxOwogICAgICAgIGlzQ29uZmlybWVkW190eEluZGV4XVttc2cuc2VuZGVyXSA9IGZhbHNlOwoKICAgICAgICBlbWl0IFJldm9rZUNvbmZpcm1hdGlvbihtc2cuc2VuZGVyLCBfdHhJbmRleCk7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0T3duZXJzKCkgcHVibGljIHZpZXcgcmV0dXJucyAoYWRkcmVzc1tdIG1lbW9yeSkgewogICAgICAgIHJldHVybiBvd25lcnM7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0VHJhbnNhY3Rpb25Db3VudCgpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4gdHJhbnNhY3Rpb25zLmxlbmd0aDsKICAgIH0KCiAgICBmdW5jdGlvbiBnZXRUcmFuc2FjdGlvbih1aW50IF90eEluZGV4KQogICAgICAgIHB1YmxpYwogICAgICAgIHZpZXcKICAgICAgICByZXR1cm5zICgKICAgICAgICAgICAgYWRkcmVzcyB0bywKICAgICAgICAgICAgdWludCB2YWx1ZSwKICAgICAgICAgICAgYnl0ZXMgbWVtb3J5IGRhdGEsCiAgICAgICAgICAgIGJvb2wgZXhlY3V0ZWQsCiAgICAgICAgICAgIHVpbnQgbnVtQ29uZmlybWF0aW9ucwogICAgICAgICkKICAgIHsKICAgICAgICBUcmFuc2FjdGlvbiBzdG9yYWdlIHRyYW5zYWN0aW9uID0gdHJhbnNhY3Rpb25zW190eEluZGV4XTsKCiAgICAgICAgcmV0dXJuICgKICAgICAgICAgICAgdHJhbnNhY3Rpb24udG8sCiAgICAgICAgICAgIHRyYW5zYWN0aW9uLnZhbHVlLAogICAgICAgICAgICB0cmFuc2FjdGlvbi5kYXRhLAogICAgICAgICAgICB0cmFuc2FjdGlvbi5leGVjdXRlZCwKICAgICAgICAgICAgdHJhbnNhY3Rpb24ubnVtQ29uZmlybWF0aW9ucwogICAgICAgICk7CiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)
- [TestContract.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmNvbnRyYWN0IFRlc3RDb250cmFjdCB7CiAgICB1aW50IHB1YmxpYyBpOwoKICAgIGZ1bmN0aW9uIGNhbGxNZSh1aW50IGopIHB1YmxpYyB7CiAgICAgICAgaSArPSBqOwogICAgfQoKICAgIGZ1bmN0aW9uIGdldERhdGEoKSBwdWJsaWMgcHVyZSByZXR1cm5zIChieXRlcyBtZW1vcnkpIHsKICAgICAgICByZXR1cm4gYWJpLmVuY29kZVdpdGhTaWduYXR1cmUoImNhbGxNZSh1aW50MjU2KSIsIDEyMyk7CiAgICB9Cn0=&version=soljson-v0.8.13+commit.abaa5c0e.js)
