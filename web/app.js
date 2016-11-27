var express = require('express');
var path = require('path');
var app = express();

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('public', express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  var accounts = web3.eth.accounts;
  var accInfoList = [];

  accounts.forEach(function(acc){
  	var balance = web3.eth.getBalance(acc);
  	 //console.log(balance);
  	 accInfoList.push({
  	 	acc_id: acc,
  	 	balance: web3.fromWei(balance, 'ether')
  	 });
  });
  //console.log(accounts);
  var reward = web3.eth.getBalance('0xB65Ca742B2d0Ac8342dE8DA278b1baF6864c2D76');
  res.render('index', { 
  	title: 'Hey', 
  	reward: web3.fromWei(reward, 'ether'),
  	message: 'Accounts', 
  	accounts: accInfoList });
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});