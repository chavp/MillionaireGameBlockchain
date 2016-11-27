pragma solidity ^0.4.2;

contract owned {
  address public owner;

  /* this function is executed at initialization and sets the owner of the contract */
  function owned() {
    owner = msg.sender;
  }

  modifier onlyOwner {
    if (msg.sender != owner) throw;
    _;
  }

  function transferOwnership(address newOwner) onlyOwner {
    owner = newOwner;
  }

  /* Function to recover the funds on the contract */
  function kill() { if (msg.sender == owner) suicide(owner); }
}

contract MillenniumToken9 is owned {

  string public standard = 'Token 0.1';
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;
  uint256 public sellPrice;
  uint256 public buyPrice;

  /* This creates an array with all balances */
  mapping (address => uint256) public balanceOf;
  uint256 public poolMT;

  /* This generates a public event on the blockchain that will notify clients */
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Print(string log);

  /* Initializes contract with initial supply tokens to the creator of the contract */
  function MillenniumToken9(uint256 _initialSupply,
    string _name,
    string _symbol,
    uint8 _decimals,
    uint256 _sellPrice,
    uint256 _buyPrice) {
      balanceOf[this] = _initialSupply;              // Give the creator all initial tokens
      name = _name;
      symbol = _symbol;
      decimals = _decimals;
      totalSupply = _initialSupply;
      sellPrice = _sellPrice;
      buyPrice = _buyPrice;
      poolMT = 0;
    }

    function hello() returns (string) {
      Print('hello');
      return 'hello';
    }

    function echo(string text) returns (string) {
      Print('echo');
      return strConcat('echo: ', text);
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
      Print('transfer');
      if (balanceOf[msg.sender] < _value) throw;           // Check if the sender has enough
      if (balanceOf[_to] + _value < balanceOf[_to]) throw; // Check for overflows
      balanceOf[msg.sender] -= _value;                     // Subtract from the sender
      balanceOf[_to] += _value;                            // Add the same to the recipient
      Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    function getReward() {
      Print('getReward');
      uint _value = balanceOf[this];
      balanceOf[msg.sender] += poolMT;
      poolMT = 0;
      Transfer(this, msg.sender, _value);
    }

    function payFee(uint256 _value) {
      Print('payFee');
      if (balanceOf[msg.sender] < _value) throw;
      poolMT += _value;
      balanceOf[msg.sender] -= _value;
      Transfer(msg.sender, this, _value);
    }

    function () {
      throw;
    }

    function mintToken(address target, uint256 mintedAmount) onlyOwner {
      Print('mintToken');
      balanceOf[target] += mintedAmount;
      totalSupply += mintedAmount;
      Transfer(0, owner, mintedAmount);
      Transfer(owner, target, mintedAmount);
    }

    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyOwner {
      Print('setPrices');
      sellPrice = newSellPrice;
      buyPrice = newBuyPrice;
    }

    function buy() payable returns (uint amount) {
      Print('buy');
      amount = msg.value / buyPrice;                     // calculates the amount
      if (balanceOf[this] < amount) throw;               // checks if it has enough to sell
      balanceOf[msg.sender] += amount;                   // adds the amount to buyer's balance
      balanceOf[this] -= amount;                         // subtracts amount from seller's balance
      Transfer(this, msg.sender, amount);                // execute an event reflecting the change
      return amount;                                     // ends function and returns
    }

    function sell(uint amount) returns (uint revenue) {
      Print('sell');
      if (balanceOf[msg.sender] < amount ) throw;        // checks if the sender has enough to sell
      balanceOf[this] += amount;                         // adds the amount to owner's balance
      balanceOf[msg.sender] -= amount;                   // subtracts the amount from seller's balance
      revenue = amount * sellPrice;
      if (!msg.sender.send(revenue)) {                   // sends ether to the seller: it's important
      throw;                                           // to do this last to prevent recursion attacks
      } else {
        Transfer(msg.sender, this, amount);             // executes an event reflecting on the change
        return revenue;                                 // ends function and returns
      }
    }

    function strConcat(string _a, string _b) internal returns (string){
      bytes memory _ba = bytes(_a);
      bytes memory _bb = bytes(_b);
      string memory ab = new string(_ba.length + _bb.length);
      bytes memory result = bytes(ab);
      uint k = 0;
      for (uint i = 0; i < _ba.length; i++) result[k++] = _ba[i];
      for (i = 0; i < _bb.length; i++) result[k++] = _bb[i];
      return string(result);
    }
  }
