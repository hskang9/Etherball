pragma solidity ^0.4.23;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    if (a == 0) {
      return 0;
    }
    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }
}



contract Etherball is Ownable {
    address[] public players;
    uint public playing = players.length;
    uint256 private number = 0;
    uint private weiPrice = 0.001*10**18;
    uint public startTime = now;
    uint public deadline;
    address public owner;
    address public winner;
    uint256 public prize = SafeMath.mul(SafeMath.div(address(this).balance, 10), 9);

    event Game(uint256 _deadline, address _owner, uint256 _startTime);

    event Players(address[] _players, uint playing);

    event Prize(uint256 _prize, address _winner);



    constructor(uint256 _deadline, address _owner, uint256 _number) public {
        owner = _owner;
        deadline = _deadline;
        number = _number;
    }

    // Getters
    function getStart() view public returns(uint) {
        return startTime;
    }

    function getDeadline() view public returns(uint) {
        return deadline;
    }

    function getPlaying() view public returns(uint) {
        return playing;
    }

    function getPrize() view public returns(uint256) {
        return prize;
    }

    function getWinner() view public returns(address) {
        return winner;
    }

    function getPlayer() view public returns(address[]) {
        return players;
    }

    // Methods
    function startGame(address _owner, uint256 _deadline, uint256 _number) onlyOwner public {
        owner = _owner;
        startTime = now;
        deadline = _deadline;
        number = _number;
        emit Game(deadline, owner, startTime);
    }

    function guess(uint256 _guess) payable returns (string) {

       // Check if the number is in the range
       require(_guess >= 1 && _guess < 1000000000000);

       // Owner cannot guess the number
       require(msg.sender != owner);

       // Check if the lottery ended
       require(now <= deadline);

       // msg.value is how much ether was sent
       require(msg.value == weiPrice);

       players.push(msg.sender);

       emit Players(players, playing);

       if(_guess == number) {
           // Give prize to winner
           (msg.sender).transfer(prize);
           // Give fee to the owner
           (owner).transfer(address(this).balance);
           winner = msg.sender;
           emit Prize(prize, winner);
           return "You've won!";
       }
       else {
           if(now >= deadline) finalize(); return "Game has ended. Wait for the next round";
           emit Prize(prize, winner);
           return "Wrong guess. Try again";
       }
    }

    function finalize() onlyOwner {
       owner.transfer(address(this).balance);
    }

    function kill() public {
        if(msg.sender == owner) selfdestruct(owner);
    }

    function () payable {
      revert();
    }

}
