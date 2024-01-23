# Proxy atualizável

Exemplo de contrato de proxy atualizável. Nunca use isso em produção.

Este exemplo mostra

- como usar `delegatecalle` retornar dados quando `fallback` é chamado.
- como armazenar o endereço de `admin` e `implementation` em um slot específico.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Padrão de proxy atualizável transparente

contract CounterV1 {
    uint public count;

    function inc() external {
        count += 1;
    }
}

contract CounterV2 {
    uint public count;

    function inc() external {
        count += 1;
    }

    function dec() external {
        count -= 1;
    }
}

contract BuggyProxy {
    address public implementation;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function _delegate() private {
        (bool ok, bytes memory res) = implementation.delegatecall(msg.data);
        require(ok, "delegatecall failed");
    }

    fallback() external payable {
        _delegate();
    }

    receive() external payable {
        _delegate();
    }

    function upgradeTo(address _implementation) external {
        require(msg.sender == admin, "not authorized");
        implementation = _implementation;
    }
}

contract Dev {
    function selectors()
        external
        view
        returns (
            bytes4,
            bytes4,
            bytes4
        )
    {
        return (
            Proxy.admin.selector,
            Proxy.implementation.selector,
            Proxy.upgradeTo.selector
        );
    }
}

contract Proxy {
    // Todas as funções/variáveis ​​devem ser privadas, encaminhe todas as chamadas para fallback

    // -1 para pré-imagem desconhecida
    // 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc
    bytes32 private constant IMPLEMENTATION_SLOT =
        bytes32(uint(keccak256("eip1967.proxy.implementation")) - 1);
    // 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103
    bytes32 private constant ADMIN_SLOT =
        bytes32(uint(keccak256("eip1967.proxy.admin")) - 1);

    constructor() {
        _setAdmin(msg.sender);
    }

    modifier ifAdmin() {
        if (msg.sender == _getAdmin()) {
            _;
        } else {
            _fallback();
        }
    }

    function _getAdmin() private view returns (address) {
        return StorageSlot.getAddressSlot(ADMIN_SLOT).value;
    }

    function _setAdmin(address _admin) private {
        require(_admin != address(0), "admin = zero address");
        StorageSlot.getAddressSlot(ADMIN_SLOT).value = _admin;
    }

    function _getImplementation() private view returns (address) {
        return StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value;
    }

    function _setImplementation(address _implementation) private {
        require(_implementation.code.length > 0, "implementation is not contract");
        StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value = _implementation;
    }

    // Interface do administrador//
    function changeAdmin(address _admin) external ifAdmin {
        _setAdmin(_admin);
    }

    // 0x3659cfe6
    function upgradeTo(address _implementation) external ifAdmin {
        _setImplementation(_implementation);
    }

    // 0xf851a440
    function admin() external ifAdmin returns (address) {
        return _getAdmin();
    }

    // 0x5c60da1b
    function implementation() external ifAdmin returns (address) {
        return _getImplementation();
    }

    // Interface do usuário //
    function _delegate(address _implementation) internal virtual {
        assembly {
            // Copia msg.data. Assumimos o controle total da memória nesta montagem em linha
            // bloquear porque não retornará ao código Solidity. Nós sobrescrevemos o
            // Nós sobrescrevemos o bloco de rascunho de Solidity na posição de memória 0.


            // calldatacopy(t, f, s) - copia S bytes de calldata na posição f para mem na posição t
            // calldatasize() - tamanho dos dados da chamada em bytes
            calldatacopy(0, 0, calldatasize())

            // Chama a implementação.
            // out and outsize são 0 porque ainda não sabemos o tamanho.

            // delegatecall(g, a, in, insize, out, outsize) -
            // - contrato de chamada no endereço a
            // - com entrada mem[in…(in+insize))
            // - fornecimento de gás g
            // - área de saída mem[out…(out+outsize))
            // - retornando 0 em caso de erro (por exemplo, falta de gás) e 1 em caso de sucesso
            let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)

            // Copie os dados retornados.
            // returndatacopy(t, f, s) - copia S bytes de returndata na posição f para mem na posição t
            // returndatasize() - tamanho do último returndata
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall retorna 0 em caso de erro.
            case 0 {
                // revert(p, s) - finaliza a execução, reverte mudanças de estado, retorna dados mem[p…(p+s))
                revert(0, returndatasize())
            }
            default {
                // return(p, s) - finaliza a execução, retorna dados mem[p…(p+s))
                return(0, returndatasize())
            }
        }
    }

    function _fallback() private {
        _delegate(_getImplementation());
    }

    fallback() external payable {
        _fallback();
    }

    receive() external payable {
        _fallback();
    }
}

contract ProxyAdmin {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function getProxyAdmin(address proxy) external view returns (address) {
        (bool ok, bytes memory res) = proxy.staticcall(
            abi.encodeCall(Proxy.implementation, ())
        );
        require(ok, "call failed");
        return abi.decode(res, (address));
    }

    function getProxyImplementation(address proxy) external view returns (address) {
        (bool ok, bytes memory res) = proxy.staticcall(abi.encodeCall(Proxy.admin, ()));
        require(ok, "call failed");
        return abi.decode(res, (address));
    }

    function changeProxyAdmin(address payable proxy, address admin) external onlyOwner {
        Proxy(proxy).changeAdmin(admin);
    }

    function upgrade(address payable proxy, address implementation) external onlyOwner {
        Proxy(proxy).upgradeTo(implementation);
    }
}

library StorageSlot {
    struct AddressSlot {
        address value;
    }

    function getAddressSlot(bytes32 slot)
        internal
        pure
        returns (AddressSlot storage r)
    {
        assembly {
            r.slot := slot
        }
    }
}

contract TestSlot {
    bytes32 public constant slot = keccak256("TEST_SLOT");

    function getSlot() external view returns (address) {
        return StorageSlot.getAddressSlot(slot).value;
    }

    function writeSlot(address _addr) external {
        StorageSlot.getAddressSlot(slot).value = _addr;
    }
}
```

## Teste no Remix

- [UpgradeableProxy.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4yMDsKCi8vIFBhZHJhbyBkZSBwcm94eSBhdHVhbGl6YXZlbCB0cmFuc3BhcmVudGUKCmNvbnRyYWN0IENvdW50ZXJWMSB7CiAgICB1aW50IHB1YmxpYyBjb3VudDsKCiAgICBmdW5jdGlvbiBpbmMoKSBleHRlcm5hbCB7CiAgICAgICAgY291bnQgKz0gMTsKICAgIH0KfQoKY29udHJhY3QgQ291bnRlclYyIHsKICAgIHVpbnQgcHVibGljIGNvdW50OwoKICAgIGZ1bmN0aW9uIGluYygpIGV4dGVybmFsIHsKICAgICAgICBjb3VudCArPSAxOwogICAgfQoKICAgIGZ1bmN0aW9uIGRlYygpIGV4dGVybmFsIHsKICAgICAgICBjb3VudCAtPSAxOwogICAgfQp9Cgpjb250cmFjdCBCdWdneVByb3h5IHsKICAgIGFkZHJlc3MgcHVibGljIGltcGxlbWVudGF0aW9uOwogICAgYWRkcmVzcyBwdWJsaWMgYWRtaW47CgogICAgY29uc3RydWN0b3IoKSB7CiAgICAgICAgYWRtaW4gPSBtc2cuc2VuZGVyOwogICAgfQoKICAgIGZ1bmN0aW9uIF9kZWxlZ2F0ZSgpIHByaXZhdGUgewogICAgICAgIChib29sIG9rLCBieXRlcyBtZW1vcnkgcmVzKSA9IGltcGxlbWVudGF0aW9uLmRlbGVnYXRlY2FsbChtc2cuZGF0YSk7CiAgICAgICAgcmVxdWlyZShvaywgImRlbGVnYXRlY2FsbCBmYWlsZWQiKTsKICAgIH0KCiAgICBmYWxsYmFjaygpIGV4dGVybmFsIHBheWFibGUgewogICAgICAgIF9kZWxlZ2F0ZSgpOwogICAgfQoKICAgIHJlY2VpdmUoKSBleHRlcm5hbCBwYXlhYmxlIHsKICAgICAgICBfZGVsZWdhdGUoKTsKICAgIH0KCiAgICBmdW5jdGlvbiB1cGdyYWRlVG8oYWRkcmVzcyBfaW1wbGVtZW50YXRpb24pIGV4dGVybmFsIHsKICAgICAgICByZXF1aXJlKG1zZy5zZW5kZXIgPT0gYWRtaW4sICJub3QgYXV0aG9yaXplZCIpOwogICAgICAgIGltcGxlbWVudGF0aW9uID0gX2ltcGxlbWVudGF0aW9uOwogICAgfQp9Cgpjb250cmFjdCBEZXYgewogICAgZnVuY3Rpb24gc2VsZWN0b3JzKCkKICAgICAgICBleHRlcm5hbAogICAgICAgIHZpZXcKICAgICAgICByZXR1cm5zICgKICAgICAgICAgICAgYnl0ZXM0LAogICAgICAgICAgICBieXRlczQsCiAgICAgICAgICAgIGJ5dGVzNAogICAgICAgICkKICAgIHsKICAgICAgICByZXR1cm4gKAogICAgICAgICAgICBQcm94eS5hZG1pbi5zZWxlY3RvciwKICAgICAgICAgICAgUHJveHkuaW1wbGVtZW50YXRpb24uc2VsZWN0b3IsCiAgICAgICAgICAgIFByb3h5LnVwZ3JhZGVUby5zZWxlY3RvcgogICAgICAgICk7CiAgICB9Cn0KCmNvbnRyYWN0IFByb3h5IHsKICAgIC8vIFRvZGFzIGFzIGZ1bmNvZXMvdmFyaWF2ZWlzID8/ZGV2ZW0gc2VyIHByaXZhZGFzLCBlbmNhbWluaGUgdG9kYXMgYXMgY2hhbWFkYXMgcGFyYSBmYWxsYmFjawoKICAgIC8vIC0xIHBhcmEgcHJlLWltYWdlbSBkZXNjb25oZWNpZGEKICAgIC8vIDB4MzYwODk0YTEzYmExYTMyMTA2NjdjODI4NDkyZGI5OGRjYTNlMjA3NmNjMzczNWE5MjBhM2NhNTA1ZDM4MmJiYwogICAgYnl0ZXMzMiBwcml2YXRlIGNvbnN0YW50IElNUExFTUVOVEFUSU9OX1NMT1QgPQogICAgICAgIGJ5dGVzMzIodWludChrZWNjYWsyNTYoImVpcDE5NjcucHJveHkuaW1wbGVtZW50YXRpb24iKSkgLSAxKTsKICAgIC8vIDB4YjUzMTI3Njg0YTU2OGIzMTczYWUxM2I5ZjhhNjAxNmUyNDNlNjNiNmU4ZWUxMTc4ZDZhNzE3ODUwYjVkNjEwMwogICAgYnl0ZXMzMiBwcml2YXRlIGNvbnN0YW50IEFETUlOX1NMT1QgPQogICAgICAgIGJ5dGVzMzIodWludChrZWNjYWsyNTYoImVpcDE5NjcucHJveHkuYWRtaW4iKSkgLSAxKTsKCiAgICBjb25zdHJ1Y3RvcigpIHsKICAgICAgICBfc2V0QWRtaW4obXNnLnNlbmRlcik7CiAgICB9CgogICAgbW9kaWZpZXIgaWZBZG1pbigpIHsKICAgICAgICBpZiAobXNnLnNlbmRlciA9PSBfZ2V0QWRtaW4oKSkgewogICAgICAgICAgICBfOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIF9mYWxsYmFjaygpOwogICAgICAgIH0KICAgIH0KCiAgICBmdW5jdGlvbiBfZ2V0QWRtaW4oKSBwcml2YXRlIHZpZXcgcmV0dXJucyAoYWRkcmVzcykgewogICAgICAgIHJldHVybiBTdG9yYWdlU2xvdC5nZXRBZGRyZXNzU2xvdChBRE1JTl9TTE9UKS52YWx1ZTsKICAgIH0KCiAgICBmdW5jdGlvbiBfc2V0QWRtaW4oYWRkcmVzcyBfYWRtaW4pIHByaXZhdGUgewogICAgICAgIHJlcXVpcmUoX2FkbWluICE9IGFkZHJlc3MoMCksICJhZG1pbiA9IHplcm8gYWRkcmVzcyIpOwogICAgICAgIFN0b3JhZ2VTbG90LmdldEFkZHJlc3NTbG90KEFETUlOX1NMT1QpLnZhbHVlID0gX2FkbWluOwogICAgfQoKICAgIGZ1bmN0aW9uIF9nZXRJbXBsZW1lbnRhdGlvbigpIHByaXZhdGUgdmlldyByZXR1cm5zIChhZGRyZXNzKSB7CiAgICAgICAgcmV0dXJuIFN0b3JhZ2VTbG90LmdldEFkZHJlc3NTbG90KElNUExFTUVOVEFUSU9OX1NMT1QpLnZhbHVlOwogICAgfQoKICAgIGZ1bmN0aW9uIF9zZXRJbXBsZW1lbnRhdGlvbihhZGRyZXNzIF9pbXBsZW1lbnRhdGlvbikgcHJpdmF0ZSB7CiAgICAgICAgcmVxdWlyZShfaW1wbGVtZW50YXRpb24uY29kZS5sZW5ndGggPiAwLCAiaW1wbGVtZW50YXRpb24gaXMgbm90IGNvbnRyYWN0Iik7CiAgICAgICAgU3RvcmFnZVNsb3QuZ2V0QWRkcmVzc1Nsb3QoSU1QTEVNRU5UQVRJT05fU0xPVCkudmFsdWUgPSBfaW1wbGVtZW50YXRpb247CiAgICB9CgogICAgLy8gSW50ZXJmYWNlIGRvIGFkbWluaXN0cmFkb3IvLwogICAgZnVuY3Rpb24gY2hhbmdlQWRtaW4oYWRkcmVzcyBfYWRtaW4pIGV4dGVybmFsIGlmQWRtaW4gewogICAgICAgIF9zZXRBZG1pbihfYWRtaW4pOwogICAgfQoKICAgIC8vIDB4MzY1OWNmZTYKICAgIGZ1bmN0aW9uIHVwZ3JhZGVUbyhhZGRyZXNzIF9pbXBsZW1lbnRhdGlvbikgZXh0ZXJuYWwgaWZBZG1pbiB7CiAgICAgICAgX3NldEltcGxlbWVudGF0aW9uKF9pbXBsZW1lbnRhdGlvbik7CiAgICB9CgogICAgLy8gMHhmODUxYTQ0MAogICAgZnVuY3Rpb24gYWRtaW4oKSBleHRlcm5hbCBpZkFkbWluIHJldHVybnMgKGFkZHJlc3MpIHsKICAgICAgICByZXR1cm4gX2dldEFkbWluKCk7CiAgICB9CgogICAgLy8gMHg1YzYwZGExYgogICAgZnVuY3Rpb24gaW1wbGVtZW50YXRpb24oKSBleHRlcm5hbCBpZkFkbWluIHJldHVybnMgKGFkZHJlc3MpIHsKICAgICAgICByZXR1cm4gX2dldEltcGxlbWVudGF0aW9uKCk7CiAgICB9CgogICAgLy8gSW50ZXJmYWNlIGRvIHVzdWFyaW8gLy8KICAgIGZ1bmN0aW9uIF9kZWxlZ2F0ZShhZGRyZXNzIF9pbXBsZW1lbnRhdGlvbikgaW50ZXJuYWwgdmlydHVhbCB7CiAgICAgICAgYXNzZW1ibHkgewogICAgICAgICAgICAvLyBDb3BpYSBtc2cuZGF0YS4gQXNzdW1pbW9zIG8gY29udHJvbGUgdG90YWwgZGEgbWVtb3JpYSBuZXN0YSBtb250YWdlbSBlbSBsaW5oYQogICAgICAgICAgICAvLyBibG9xdWVhciBwb3JxdWUgbmFvIHJldG9ybmFyYSBhbyBjb2RpZ28gU29saWRpdHkuIE5vcyBzb2JyZXNjcmV2ZW1vcyBvCiAgICAgICAgICAgIC8vIE5vcyBzb2JyZXNjcmV2ZW1vcyBvIGJsb2NvIGRlIHJhc2N1bmhvIGRlIFNvbGlkaXR5IG5hIHBvc2ljYW8gZGUgbWVtb3JpYSAwLgoKCiAgICAgICAgICAgIC8vIGNhbGxkYXRhY29weSh0LCBmLCBzKSAtIGNvcGlhIFMgYnl0ZXMgZGUgY2FsbGRhdGEgbmEgcG9zaWNhbyBmIHBhcmEgbWVtIG5hIHBvc2ljYW8gdAogICAgICAgICAgICAvLyBjYWxsZGF0YXNpemUoKSAtIHRhbWFuaG8gZG9zIGRhZG9zIGRhIGNoYW1hZGEgZW0gYnl0ZXMKICAgICAgICAgICAgY2FsbGRhdGFjb3B5KDAsIDAsIGNhbGxkYXRhc2l6ZSgpKQoKICAgICAgICAgICAgLy8gQ2hhbWEgYSBpbXBsZW1lbnRhY2FvLgogICAgICAgICAgICAvLyBvdXQgYW5kIG91dHNpemUgc2FvIDAgcG9ycXVlIGFpbmRhIG5hbyBzYWJlbW9zIG8gdGFtYW5oby4KCiAgICAgICAgICAgIC8vIGRlbGVnYXRlY2FsbChnLCBhLCBpbiwgaW5zaXplLCBvdXQsIG91dHNpemUpIC0KICAgICAgICAgICAgLy8gLSBjb250cmF0byBkZSBjaGFtYWRhIG5vIGVuZGVyZWNvIGEKICAgICAgICAgICAgLy8gLSBjb20gZW50cmFkYSBtZW1baW4/KGluK2luc2l6ZSkpCiAgICAgICAgICAgIC8vIC0gZm9ybmVjaW1lbnRvIGRlIGdhcyBnCiAgICAgICAgICAgIC8vIC0gYXJlYSBkZSBzYWlkYSBtZW1bb3V0PyhvdXQrb3V0c2l6ZSkpCiAgICAgICAgICAgIC8vIC0gcmV0b3JuYW5kbyAwIGVtIGNhc28gZGUgZXJybyAocG9yIGV4ZW1wbG8sIGZhbHRhIGRlIGdhcykgZSAxIGVtIGNhc28gZGUgc3VjZXNzbwogICAgICAgICAgICBsZXQgcmVzdWx0IDo9IGRlbGVnYXRlY2FsbChnYXMoKSwgX2ltcGxlbWVudGF0aW9uLCAwLCBjYWxsZGF0YXNpemUoKSwgMCwgMCkKCiAgICAgICAgICAgIC8vIENvcGllIG9zIGRhZG9zIHJldG9ybmFkb3MuCiAgICAgICAgICAgIC8vIHJldHVybmRhdGFjb3B5KHQsIGYsIHMpIC0gY29waWEgUyBieXRlcyBkZSByZXR1cm5kYXRhIG5hIHBvc2ljYW8gZiBwYXJhIG1lbSBuYSBwb3NpY2FvIHQKICAgICAgICAgICAgLy8gcmV0dXJuZGF0YXNpemUoKSAtIHRhbWFuaG8gZG8gdWx0aW1vIHJldHVybmRhdGEKICAgICAgICAgICAgcmV0dXJuZGF0YWNvcHkoMCwgMCwgcmV0dXJuZGF0YXNpemUoKSkKCiAgICAgICAgICAgIHN3aXRjaCByZXN1bHQKICAgICAgICAgICAgLy8gZGVsZWdhdGVjYWxsIHJldG9ybmEgMCBlbSBjYXNvIGRlIGVycm8uCiAgICAgICAgICAgIGNhc2UgMCB7CiAgICAgICAgICAgICAgICAvLyByZXZlcnQocCwgcykgLSBmaW5hbGl6YSBhIGV4ZWN1Y2FvLCByZXZlcnRlIG11ZGFuY2FzIGRlIGVzdGFkbywgcmV0b3JuYSBkYWRvcyBtZW1bcD8ocCtzKSkKICAgICAgICAgICAgICAgIHJldmVydCgwLCByZXR1cm5kYXRhc2l6ZSgpKQogICAgICAgICAgICB9CiAgICAgICAgICAgIGRlZmF1bHQgewogICAgICAgICAgICAgICAgLy8gcmV0dXJuKHAsIHMpIC0gZmluYWxpemEgYSBleGVjdWNhbywgcmV0b3JuYSBkYWRvcyBtZW1bcD8ocCtzKSkKICAgICAgICAgICAgICAgIHJldHVybigwLCByZXR1cm5kYXRhc2l6ZSgpKQogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQoKICAgIGZ1bmN0aW9uIF9mYWxsYmFjaygpIHByaXZhdGUgewogICAgICAgIF9kZWxlZ2F0ZShfZ2V0SW1wbGVtZW50YXRpb24oKSk7CiAgICB9CgogICAgZmFsbGJhY2soKSBleHRlcm5hbCBwYXlhYmxlIHsKICAgICAgICBfZmFsbGJhY2soKTsKICAgIH0KCiAgICByZWNlaXZlKCkgZXh0ZXJuYWwgcGF5YWJsZSB7CiAgICAgICAgX2ZhbGxiYWNrKCk7CiAgICB9Cn0KCmNvbnRyYWN0IFByb3h5QWRtaW4gewogICAgYWRkcmVzcyBwdWJsaWMgb3duZXI7CgogICAgY29uc3RydWN0b3IoKSB7CiAgICAgICAgb3duZXIgPSBtc2cuc2VuZGVyOwogICAgfQoKICAgIG1vZGlmaWVyIG9ubHlPd25lcigpIHsKICAgICAgICByZXF1aXJlKG1zZy5zZW5kZXIgPT0gb3duZXIsICJub3Qgb3duZXIiKTsKICAgICAgICBfOwogICAgfQoKICAgIGZ1bmN0aW9uIGdldFByb3h5QWRtaW4oYWRkcmVzcyBwcm94eSkgZXh0ZXJuYWwgdmlldyByZXR1cm5zIChhZGRyZXNzKSB7CiAgICAgICAgKGJvb2wgb2ssIGJ5dGVzIG1lbW9yeSByZXMpID0gcHJveHkuc3RhdGljY2FsbCgKICAgICAgICAgICAgYWJpLmVuY29kZUNhbGwoUHJveHkuaW1wbGVtZW50YXRpb24sICgpKQogICAgICAgICk7CiAgICAgICAgcmVxdWlyZShvaywgImNhbGwgZmFpbGVkIik7CiAgICAgICAgcmV0dXJuIGFiaS5kZWNvZGUocmVzLCAoYWRkcmVzcykpOwogICAgfQoKICAgIGZ1bmN0aW9uIGdldFByb3h5SW1wbGVtZW50YXRpb24oYWRkcmVzcyBwcm94eSkgZXh0ZXJuYWwgdmlldyByZXR1cm5zIChhZGRyZXNzKSB7CiAgICAgICAgKGJvb2wgb2ssIGJ5dGVzIG1lbW9yeSByZXMpID0gcHJveHkuc3RhdGljY2FsbChhYmkuZW5jb2RlQ2FsbChQcm94eS5hZG1pbiwgKCkpKTsKICAgICAgICByZXF1aXJlKG9rLCAiY2FsbCBmYWlsZWQiKTsKICAgICAgICByZXR1cm4gYWJpLmRlY29kZShyZXMsIChhZGRyZXNzKSk7CiAgICB9CgogICAgZnVuY3Rpb24gY2hhbmdlUHJveHlBZG1pbihhZGRyZXNzIHBheWFibGUgcHJveHksIGFkZHJlc3MgYWRtaW4pIGV4dGVybmFsIG9ubHlPd25lciB7CiAgICAgICAgUHJveHkocHJveHkpLmNoYW5nZUFkbWluKGFkbWluKTsKICAgIH0KCiAgICBmdW5jdGlvbiB1cGdyYWRlKGFkZHJlc3MgcGF5YWJsZSBwcm94eSwgYWRkcmVzcyBpbXBsZW1lbnRhdGlvbikgZXh0ZXJuYWwgb25seU93bmVyIHsKICAgICAgICBQcm94eShwcm94eSkudXBncmFkZVRvKGltcGxlbWVudGF0aW9uKTsKICAgIH0KfQoKbGlicmFyeSBTdG9yYWdlU2xvdCB7CiAgICBzdHJ1Y3QgQWRkcmVzc1Nsb3QgewogICAgICAgIGFkZHJlc3MgdmFsdWU7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0QWRkcmVzc1Nsb3QoYnl0ZXMzMiBzbG90KQogICAgICAgIGludGVybmFsCiAgICAgICAgcHVyZQogICAgICAgIHJldHVybnMgKEFkZHJlc3NTbG90IHN0b3JhZ2UgcikKICAgIHsKICAgICAgICBhc3NlbWJseSB7CiAgICAgICAgICAgIHIuc2xvdCA6PSBzbG90CiAgICAgICAgfQogICAgfQp9Cgpjb250cmFjdCBUZXN0U2xvdCB7CiAgICBieXRlczMyIHB1YmxpYyBjb25zdGFudCBzbG90ID0ga2VjY2FrMjU2KCJURVNUX1NMT1QiKTsKCiAgICBmdW5jdGlvbiBnZXRTbG90KCkgZXh0ZXJuYWwgdmlldyByZXR1cm5zIChhZGRyZXNzKSB7CiAgICAgICAgcmV0dXJuIFN0b3JhZ2VTbG90LmdldEFkZHJlc3NTbG90KHNsb3QpLnZhbHVlOwogICAgfQoKICAgIGZ1bmN0aW9uIHdyaXRlU2xvdChhZGRyZXNzIF9hZGRyKSBleHRlcm5hbCB7CiAgICAgICAgU3RvcmFnZVNsb3QuZ2V0QWRkcmVzc1Nsb3Qoc2xvdCkudmFsdWUgPSBfYWRkcjsKICAgIH0KfQ==&version=soljson-v0.8.20+commit.a1b79de6.js)
