
function init() {

    // Checks Web3 support
    if(typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
        // If there's a web3 library loaded, then make your own web3
        web3 = new Web3(web3.currentProvider);
    } else if (typeof Web3 !== 'undefined') {
        // If there isn't then set a provider
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    } else if(typeof web3 == 'undefined' && typeof Web3 == 'undefined') {
        // If there is neither then this isn't an ethereum browser
        document.getElementById("results").style.display = "none";
        document.getElementById("see-results").style.display = "none";
        document.getElementById("vote1").style.display = "none";
        document.getElementById("vote2").style.display = "none";
        document.getElementById("vote3").style.display = "none";
        document.getElementById("vote4").style.display = "none";
        document.getElementById("subtitle").style.display = "none";
        document.getElementById("proposal").textContent = "Millennium";

        var message = document.getElementById("message");
        message.style.display = "block";
        return;
    }

    // If no accounts are present, show the floating baloon
    if (!web3.eth.accounts || web3.eth.accounts.length == 0) {
        document.getElementById("vote1").style.display = "none";
        document.getElementById("vote2").style.display = "none";
        document.getElementById("vote3").style.display = "none";
        document.getElementById("vote4").style.display = "none";
        document.getElementById("add-account").style.display = "block";
    }


    setupUi();

    //greeting();

    //nextQuestion();

    //answer();
}


var millionaireContractABI = [ { "constant": false, "inputs": [], "name": "nextQuestion", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [ { "name": "_answer", "type": "string" } ], "name": "answer", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "players", "outputs": [ { "name": "newShare", "type": "bool", "value": false }, { "name": "nextQuestion", "type": "uint256", "value": "0" }, { "name": "waitingNextQuestion", "type": "bool", "value": false }, { "name": "correctCount", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "inputs": [], "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "p", "type": "address" }, { "indexed": false, "name": "id", "type": "uint256" }, { "indexed": false, "name": "q", "type": "string" }, { "indexed": false, "name": "c", "type": "string" }, { "indexed": false, "name": "a", "type": "string" }, { "indexed": false, "name": "reward", "type": "uint256" } ], "name": "print_question", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "p", "type": "address" }, { "indexed": false, "name": "correctCount", "type": "uint256" }, { "indexed": false, "name": "msg", "type": "string" } ], "name": "print_result", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "print_transfer", "type": "event" } ];
var millionaireContractAddress = '0xe54985ce432620000F95A0F84F6CD945eA74811b';


//event print_question(address p, uint id, string q, string c, string a, uint reward);

function nextQuestion() {

    console.log('nextQuestion', web3.eth.accounts.length);

    web3.eth.defaultAccount = web3.eth.accounts[0];

    var millionaireContract = web3.eth.contract(millionaireContractABI);
    var millionaireContractFunction = millionaireContract.at(millionaireContractAddress);

    var printQuestionLog = millionaireContractFunction.print_question();
    printQuestionLog.watch(function(error, result){
        //document.getElementById('status').textContent = result.args.s;
        console.log('event', result.args);


        var question = result.args.q;
        var choices = result.args.c.split(',');

        //var reward = web3.fromWei(result.args.reward, 'ether')

        var reward = web3.fromWei(web3.eth.getBalance(millionaireContractAddress),'ether').toString(10);
        console.log('reward', reward);

        document.getElementById('proposal').textContent = (question + '(Reward = '+reward+' ether)');
        document.getElementById('vote1').textContent = choices[0];
        document.getElementById('vote2').textContent = choices[1];
        document.getElementById('vote3').textContent = choices[2];
        document.getElementById('vote4').textContent = choices[3];

        document.getElementById('proposal').textContent = question;

    })

    var result = millionaireContractFunction.nextQuestion();
    console.log('next question result', result);


    // Check if thsere are accounts available
    /*if (web3.eth.accounts && web3.eth.accounts.length > 0) {

        document.getElementById('status').textContent = 'Has account';

    } else {
        console.log('callbacks', mist.callbacks);
        mist.requestAccount(function(e, account) {
            document.getElementById('status').textContent = 'Get Account';
        });
    }*/
}

function answer() {

}

//var greetingContractABI = [ { "constant": false, "inputs": [ { "name": "msg", "type": "string" } ], "name": "greeting", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "s", "type": "string" } ], "name": "print_log", "type": "event" } ];
//var greetingContractAddress = '0x1ce3470C92595B094007355E5BfA3Fb20aD1cE92';
function greeting() {

    /*console.log('greeting', web3.eth.accounts.length);

    web3.eth.defaultAccount = web3.eth.accounts[0];

    var greetingContract = web3.eth.contract(greetingContractABI);
    var greetingFunction = greetingContract.at(greetingContractAddress);

    var printLog = greetingFunction.print_log();
    // Wait for the events to be loaded
    printLog.watch(function(error, result){
        document.getElementById('status').textContent = result.args.s;
        console.log('event', result.args.s);
    })

    var result = greetingFunction.greeting('super hello world');
    console.log('greeting result', result);
    */
}

/*
function vote(support) {
    console.log('vote', web3.eth.accounts.length);

    // Check if there are accounts available
    if (web3.eth.accounts && web3.eth.accounts.length > 0) {

        // Create a dialog requesting the transaction
        ethervote.vote(proposalHash, support, {from: web3.eth.accounts[0]})
        document.getElementById('status').textContent = 'Waiting for new block...';

    } else {
        console.log('callbacks', mist.callbacks);
        mist.requestAccount(function(e, account) {
            console.log('return account', e, account);
            if(!e) {
                // Create a dialog requesting the transaction
                ethervote.vote(proposalHash, support, {from: account.toLowerCase()})
                document.getElementById('status').textContent = 'Waiting for new block...';
            }
        });
        console.log('callbacks', mist.callbacks);

    }

    document.getElementById("results").style.opacity = "1";
    document.getElementById("see-results").style.opacity = "0";
}
    */