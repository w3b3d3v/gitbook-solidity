---
description: >-
  EIP son estándares de implementación con el consenso de la comunidad y los mineros para
  implementar cambios de comportamiento en la Máquina Virtual Ethereum. Ya el ERC
  se refiere a estándares para Smart Contracts.
---

# ERC20 & EIP-20

La propuesta [EIP-20](https://eips.ethereum.org/EIPS/eip-20) fue creada por Vitalik Buterin y Vogelsteller en noviembre de 2015 como una forma de traer estándares de desarrollo para implementar tokens fungibles.

Se sabe que el primer token en formato ERC-20 que se creó basado en este “estándar de desarrollo” fue el [FirstBlood Token](https://etherscan.io/address/0xAf30D2a7E90d7DC361c8C4585e9BB7D2F6f15bc7#code) implementado en el bloque [**2320114**](https://etherscan.io/block/2320114)**.**

#### **En este artículo verá referencias a los estándares sugeridos por los desarrolladores de Ethereum y** [**OpenZeppelin**](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20)**.**

## **Tokens ERC-20**

Tienen 6 funciones _**obligatorias**_ , otras _**opcionales** y activan 2_ **eventos obligatorios**_**.**_

### **Funciones Obligatorias:**

#### totalSupply: Retorna la cantidad de tokens disponibles.

```
function totalSupply() public view returns (uint256)
```

#### balanceOF: Retorna el saldo de una dirección estipulada como \_owner.

```
function balanceOf(address _owner) public view returns (uint256 balance)
```

#### transfer: Transfiere una cantidad \_value de tokens hacia la cuenta \_to.

```
function transfer(address _to, uint256 _value) public returns (bool success)
```

#### transferFrom: Permite que direcciones autorizadas hagan transferencias "en su nombre" (Función usada por las DEX para hacer compra y venta).&#x20;

```
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
```

#### approve: Otorga autorización para que una dirección \_spender pueda retirar un valor máximo, el cual es mostrado en \_value. &#x20;

```
function approve(address _spender, uint256 _value) public returns (bool success)
```

#### Retorna el valor que el \_spender está autorizado a sacar.

```
function allowance(address _owner, address _spender) public view returns (uint256 remaining)
```

### **Funciones Opcionales:**

**name: Retorna el nombre del Token**

```
function name() public view returns (string)
```

#### symbol: Retorna el símbolo del Token.

```
function symbol() public view returns (string)
```

#### decimals: Retorna la cantidad de casas decimales que el Token posee.&#x20;

```
function decimals() public view returns (uint8)
```

## Eventos

#### event Approval: Siempre que una dirección autorice a otras direcciones a mover su saldo.

```
event Approval(address indexed _owner, address indexed _spender, uint256 _value)
```

#### event Transfer: Siempre que exista una transferencia o quema de tokens.

```
event Transfer(address indexed _from, address indexed _to, uint256 _value)
```

## Extensiones

#### `ERC20Mintable:`  Permite que las direcciones autorizadas creen nuevos tokens.

```
modifier onlyMinter()

mint(account, amount) onlyMinter() {}
```

#### `ERC20Burnable:` Quemará tokens de la dirección que llame a esta función. <a href="#erc20burnable" id="erc20burnable"></a>

```
burn(amount)

burnFrom(account, amount)
```

#### `ERC20Pausable:` Permite pausar operaciones de compra y venta. <a href="#erc20pausable" id="erc20pausable"></a>

```
Modifiers:
onlyPauser()
whenNotPaused()
whenPaused()
```

#### `ERC20Capped:` Hay un límite de tokens que se pueden crear. <a href="#erc20capped" id="erc20capped"></a>

```
constructor(cap) {}

require(totalSupply().add(amount) <= _cap); //Insertar en la función mint
```