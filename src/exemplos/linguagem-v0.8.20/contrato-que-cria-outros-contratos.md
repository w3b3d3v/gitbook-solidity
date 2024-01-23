# Contrato que cria outros Contratos

Os contratos podem ser criados por outros contratos usando a palavra-chave `new`. A partir da versão 0.8.0, a palavra-chave `new` suporta o recurso `create2` por meio da especificação de opções `salt`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Car {
    address public owner;
    string public model;
    address public carAddr;

    constructor(address _owner, string memory _model) payable {
        owner = _owner;
        model = _model;
        carAddr = address(this);
    }
}

contract CarFactory {
    Car[] public cars;

    function create(address _owner, string memory _model) public {
        Car car = new Car(_owner, _model);
        cars.push(car);
    }

    function createAndSendEther(address _owner, string memory _model) public payable {
        Car car = (new Car){value: msg.value}(_owner, _model);
        cars.push(car);
    }

    function create2(
        address _owner,
        string memory _model,
        bytes32 _salt
    ) public {
        Car car = (new Car){salt: _salt}(_owner, _model);
        cars.push(car);
    }

    function create2AndSendEther(
        address _owner,
        string memory _model,
        bytes32 _salt
    ) public payable {
        Car car = (new Car){value: msg.value, salt: _salt}(_owner, _model);
        cars.push(car);
    }

    function getCar(uint _index)
        public
        view
        returns (
            address owner,
            string memory model,
            address carAddr,
            uint balance
        )
    {
        Car car = cars[_index];

        return (car.owner(), car.model(), car.carAddr(), address(car).balance);
    }
}
```

## Teste no Remix
- [NewContract.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCmNvbnRyYWN0IENhciB7CiAgICBhZGRyZXNzIHB1YmxpYyBvd25lcjsKICAgIHN0cmluZyBwdWJsaWMgbW9kZWw7CiAgICBhZGRyZXNzIHB1YmxpYyBjYXJBZGRyOwoKICAgIGNvbnN0cnVjdG9yKGFkZHJlc3MgX293bmVyLCBzdHJpbmcgbWVtb3J5IF9tb2RlbCkgcGF5YWJsZSB7CiAgICAgICAgb3duZXIgPSBfb3duZXI7CiAgICAgICAgbW9kZWwgPSBfbW9kZWw7CiAgICAgICAgY2FyQWRkciA9IGFkZHJlc3ModGhpcyk7CiAgICB9Cn0KCmNvbnRyYWN0IENhckZhY3RvcnkgewogICAgQ2FyW10gcHVibGljIGNhcnM7CgogICAgZnVuY3Rpb24gY3JlYXRlKGFkZHJlc3MgX293bmVyLCBzdHJpbmcgbWVtb3J5IF9tb2RlbCkgcHVibGljIHsKICAgICAgICBDYXIgY2FyID0gbmV3IENhcihfb3duZXIsIF9tb2RlbCk7CiAgICAgICAgY2Fycy5wdXNoKGNhcik7CiAgICB9CgogICAgZnVuY3Rpb24gY3JlYXRlQW5kU2VuZEV0aGVyKGFkZHJlc3MgX293bmVyLCBzdHJpbmcgbWVtb3J5IF9tb2RlbCkgcHVibGljIHBheWFibGUgewogICAgICAgIENhciBjYXIgPSAobmV3IENhcil7dmFsdWU6IG1zZy52YWx1ZX0oX293bmVyLCBfbW9kZWwpOwogICAgICAgIGNhcnMucHVzaChjYXIpOwogICAgfQoKICAgIGZ1bmN0aW9uIGNyZWF0ZTIoCiAgICAgICAgYWRkcmVzcyBfb3duZXIsCiAgICAgICAgc3RyaW5nIG1lbW9yeSBfbW9kZWwsCiAgICAgICAgYnl0ZXMzMiBfc2FsdAogICAgKSBwdWJsaWMgewogICAgICAgIENhciBjYXIgPSAobmV3IENhcil7c2FsdDogX3NhbHR9KF9vd25lciwgX21vZGVsKTsKICAgICAgICBjYXJzLnB1c2goY2FyKTsKICAgIH0KCiAgICBmdW5jdGlvbiBjcmVhdGUyQW5kU2VuZEV0aGVyKAogICAgICAgIGFkZHJlc3MgX293bmVyLAogICAgICAgIHN0cmluZyBtZW1vcnkgX21vZGVsLAogICAgICAgIGJ5dGVzMzIgX3NhbHQKICAgICkgcHVibGljIHBheWFibGUgewogICAgICAgIENhciBjYXIgPSAobmV3IENhcil7dmFsdWU6IG1zZy52YWx1ZSwgc2FsdDogX3NhbHR9KF9vd25lciwgX21vZGVsKTsKICAgICAgICBjYXJzLnB1c2goY2FyKTsKICAgIH0KCiAgICBmdW5jdGlvbiBnZXRDYXIodWludCBfaW5kZXgpCiAgICAgICAgcHVibGljCiAgICAgICAgdmlldwogICAgICAgIHJldHVybnMgKAogICAgICAgICAgICBhZGRyZXNzIG93bmVyLAogICAgICAgICAgICBzdHJpbmcgbWVtb3J5IG1vZGVsLAogICAgICAgICAgICBhZGRyZXNzIGNhckFkZHIsCiAgICAgICAgICAgIHVpbnQgYmFsYW5jZQogICAgICAgICkKICAgIHsKICAgICAgICBDYXIgY2FyID0gY2Fyc1tfaW5kZXhdOwoKICAgICAgICByZXR1cm4gKGNhci5vd25lcigpLCBjYXIubW9kZWwoKSwgY2FyLmNhckFkZHIoKSwgYWRkcmVzcyhjYXIpLmJhbGFuY2UpOwogICAgfQp9&version=soljson-v0.8.20+commit.a1b79de6.js)