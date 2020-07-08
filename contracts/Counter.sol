// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

contract Counter {
    uint256 public value;

    function increase() public {
        value += 1;
    }
}
