# Mapping Iterável

Você não pode iterar através de um `mapping`. Aqui está um exemplo de como criar um `mapping` iterável.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

library IterableMapping {
    // Mapeamento iterável de endereço para uint;
    struct Map {
        address[] keys;
        mapping(address => uint) values;
        mapping(address => uint) indexOf;
        mapping(address => bool) inserted;
    }

    function get(Map storage map, address key) public view returns (uint) {
        return map.values[key];
    }

    function getKeyAtIndex(Map storage map, uint index) public view returns (address) {
        return map.keys[index];
    }

    function size(Map storage map) public view returns (uint) {
        return map.keys.length;
    }

    function set(
        Map storage map,
        address key,
        uint val
    ) public {
        if (map.inserted[key]) {
            map.values[key] = val;
        } else {
            map.inserted[key] = true;
            map.values[key] = val;
            map.indexOf[key] = map.keys.length;
            map.keys.push(key);
        }
    }

    function remove(Map storage map, address key) public {
        if (!map.inserted[key]) {
            return;
        }

        delete map.inserted[key];
        delete map.values[key];

        uint index = map.indexOf[key];
        uint lastIndex = map.keys.length - 1;
        address lastKey = map.keys[lastIndex];

        map.indexOf[lastKey] = index;
        delete map.indexOf[key];

        map.keys[index] = lastKey;
        map.keys.pop();
    }
}

contract TestIterableMap {
    using IterableMapping for IterableMapping.Map;

    IterableMapping.Map private map;

    function testIterableMap() public {
        map.set(address(0), 0);
        map.set(address(1), 100);
        map.set(address(2), 200); // insert
        map.set(address(2), 200); // update
        map.set(address(3), 300);

        for (uint i = 0; i < map.size(); i++) {
            address key = map.getKeyAtIndex(i);

            assert(map.get(key) == i * 100);
        }

        map.remove(address(1));

        // keys = [address(0), address(3), address(2)]
        assert(map.size() == 3);
        assert(map.getKeyAtIndex(0) == address(0));
        assert(map.getKeyAtIndex(1) == address(3));
        assert(map.getKeyAtIndex(2) == address(2));
    }
}
```

## Teste no Remix

- [IterableMapping.sol](https://remix.ethereum.org/#code=Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4xMzsKCmxpYnJhcnkgSXRlcmFibGVNYXBwaW5nIHsKICAgIC8vIE1hcGVhbWVudG8gaXRlcmF2ZWwgZGUgZW5kZXJlY28gcGFyYSB1aW50OwogICAgc3RydWN0IE1hcCB7CiAgICAgICAgYWRkcmVzc1tdIGtleXM7CiAgICAgICAgbWFwcGluZyhhZGRyZXNzID0+IHVpbnQpIHZhbHVlczsKICAgICAgICBtYXBwaW5nKGFkZHJlc3MgPT4gdWludCkgaW5kZXhPZjsKICAgICAgICBtYXBwaW5nKGFkZHJlc3MgPT4gYm9vbCkgaW5zZXJ0ZWQ7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0KE1hcCBzdG9yYWdlIG1hcCwgYWRkcmVzcyBrZXkpIHB1YmxpYyB2aWV3IHJldHVybnMgKHVpbnQpIHsKICAgICAgICByZXR1cm4gbWFwLnZhbHVlc1trZXldOwogICAgfQoKICAgIGZ1bmN0aW9uIGdldEtleUF0SW5kZXgoTWFwIHN0b3JhZ2UgbWFwLCB1aW50IGluZGV4KSBwdWJsaWMgdmlldyByZXR1cm5zIChhZGRyZXNzKSB7CiAgICAgICAgcmV0dXJuIG1hcC5rZXlzW2luZGV4XTsKICAgIH0KCiAgICBmdW5jdGlvbiBzaXplKE1hcCBzdG9yYWdlIG1hcCkgcHVibGljIHZpZXcgcmV0dXJucyAodWludCkgewogICAgICAgIHJldHVybiBtYXAua2V5cy5sZW5ndGg7CiAgICB9CgogICAgZnVuY3Rpb24gc2V0KAogICAgICAgIE1hcCBzdG9yYWdlIG1hcCwKICAgICAgICBhZGRyZXNzIGtleSwKICAgICAgICB1aW50IHZhbAogICAgKSBwdWJsaWMgewogICAgICAgIGlmIChtYXAuaW5zZXJ0ZWRba2V5XSkgewogICAgICAgICAgICBtYXAudmFsdWVzW2tleV0gPSB2YWw7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgbWFwLmluc2VydGVkW2tleV0gPSB0cnVlOwogICAgICAgICAgICBtYXAudmFsdWVzW2tleV0gPSB2YWw7CiAgICAgICAgICAgIG1hcC5pbmRleE9mW2tleV0gPSBtYXAua2V5cy5sZW5ndGg7CiAgICAgICAgICAgIG1hcC5rZXlzLnB1c2goa2V5KTsKICAgICAgICB9CiAgICB9CgogICAgZnVuY3Rpb24gcmVtb3ZlKE1hcCBzdG9yYWdlIG1hcCwgYWRkcmVzcyBrZXkpIHB1YmxpYyB7CiAgICAgICAgaWYgKCFtYXAuaW5zZXJ0ZWRba2V5XSkgewogICAgICAgICAgICByZXR1cm47CiAgICAgICAgfQoKICAgICAgICBkZWxldGUgbWFwLmluc2VydGVkW2tleV07CiAgICAgICAgZGVsZXRlIG1hcC52YWx1ZXNba2V5XTsKCiAgICAgICAgdWludCBpbmRleCA9IG1hcC5pbmRleE9mW2tleV07CiAgICAgICAgdWludCBsYXN0SW5kZXggPSBtYXAua2V5cy5sZW5ndGggLSAxOwogICAgICAgIGFkZHJlc3MgbGFzdEtleSA9IG1hcC5rZXlzW2xhc3RJbmRleF07CgogICAgICAgIG1hcC5pbmRleE9mW2xhc3RLZXldID0gaW5kZXg7CiAgICAgICAgZGVsZXRlIG1hcC5pbmRleE9mW2tleV07CgogICAgICAgIG1hcC5rZXlzW2luZGV4XSA9IGxhc3RLZXk7CiAgICAgICAgbWFwLmtleXMucG9wKCk7CiAgICB9Cn0KCmNvbnRyYWN0IFRlc3RJdGVyYWJsZU1hcCB7CiAgICB1c2luZyBJdGVyYWJsZU1hcHBpbmcgZm9yIEl0ZXJhYmxlTWFwcGluZy5NYXA7CgogICAgSXRlcmFibGVNYXBwaW5nLk1hcCBwcml2YXRlIG1hcDsKCiAgICBmdW5jdGlvbiB0ZXN0SXRlcmFibGVNYXAoKSBwdWJsaWMgewogICAgICAgIG1hcC5zZXQoYWRkcmVzcygwKSwgMCk7CiAgICAgICAgbWFwLnNldChhZGRyZXNzKDEpLCAxMDApOwogICAgICAgIG1hcC5zZXQoYWRkcmVzcygyKSwgMjAwKTsgLy8gaW5zZXJ0CiAgICAgICAgbWFwLnNldChhZGRyZXNzKDIpLCAyMDApOyAvLyB1cGRhdGUKICAgICAgICBtYXAuc2V0KGFkZHJlc3MoMyksIDMwMCk7CgogICAgICAgIGZvciAodWludCBpID0gMDsgaSA8IG1hcC5zaXplKCk7IGkrKykgewogICAgICAgICAgICBhZGRyZXNzIGtleSA9IG1hcC5nZXRLZXlBdEluZGV4KGkpOwoKICAgICAgICAgICAgYXNzZXJ0KG1hcC5nZXQoa2V5KSA9PSBpICogMTAwKTsKICAgICAgICB9CgogICAgICAgIG1hcC5yZW1vdmUoYWRkcmVzcygxKSk7CgogICAgICAgIC8vIGtleXMgPSBbYWRkcmVzcygwKSwgYWRkcmVzcygzKSwgYWRkcmVzcygyKV0KICAgICAgICBhc3NlcnQobWFwLnNpemUoKSA9PSAzKTsKICAgICAgICBhc3NlcnQobWFwLmdldEtleUF0SW5kZXgoMCkgPT0gYWRkcmVzcygwKSk7CiAgICAgICAgYXNzZXJ0KG1hcC5nZXRLZXlBdEluZGV4KDEpID09IGFkZHJlc3MoMykpOwogICAgICAgIGFzc2VydChtYXAuZ2V0S2V5QXRJbmRleCgyKSA9PSBhZGRyZXNzKDIpKTsKICAgIH0KfQ==&version=soljson-v0.8.13+commit.abaa5c0e.js)