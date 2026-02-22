// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import 'hardhat/console.sol';
contract Token{
    // public variables ka automatically getter function rehta hai
    string public token="Swastik's Token";
    string public symbol="SWT";
    uint public totalSupply=50000;

    address public owner;

    mapping(address=>uint) public balance;

    constructor(){
        balance[msg.sender]=totalSupply;
        owner=msg.sender;
    }

    function transfer(address to,uint amt) external{
        console.log("Sender address:%s",msg.sender);
        console.log("Sender tokens %s",balance[msg.sender]);
        
        require(amt<=balance[msg.sender],"Itna paise nhi hai");
        balance[msg.sender]-=amt;
        require(amt+balance[to]<=totalSupply,"Upper bound ko phaad doge kya");
        balance[to]+=amt;
    }

    /*
      view - readOnly function,no change of state variables
      external - just like public but gas fee less
     */
    function balanceof(address account) external view returns(uint){
        return balance[account];
    }
}