
function init() {

    setupEthereum();
    setupUi();
}

var allowAnswer = false;
var millionaireContractABI = [ { "constant": false, "inputs": [], "name": "nextQuestion", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [ { "name": "_answer", "type": "string" } ], "name": "answer", "outputs": [], "payable": false, "type": "function" }, { "inputs": [], "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "p", "type": "address" }, { "indexed": false, "name": "id", "type": "uint256" }, { "indexed": false, "name": "q", "type": "string" }, { "indexed": false, "name": "c", "type": "string" }, { "indexed": false, "name": "a", "type": "string" }, { "indexed": false, "name": "reward", "type": "uint256" } ], "name": "print_question", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "p", "type": "address" }, { "indexed": false, "name": "correctCount", "type": "uint256" }, { "indexed": false, "name": "msg", "type": "string" } ], "name": "print_result", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "print_transfer", "type": "event" } ];
var millionaireContractAddress = '0x71829240266681928426522D64f369d1D12Bc2d4';

function setupEthereum(){
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
}

function setupUi(){

    document.getElementById('answer').addEventListener('click', function(){ nextQuestion(); }, false);
    document.getElementById('vote1').addEventListener('click', function(){ answer('a'); }, false);
    document.getElementById('vote2').addEventListener('click', function(){ answer('b'); }, false);
    document.getElementById('vote3').addEventListener('click', function(){ answer('c'); }, false);
    document.getElementById('vote4').addEventListener('click', function(){ answer('d'); }, false);

    showQuestion(false);
}

var millionaireContract = web3.eth.contract(millionaireContractABI);
var millionaireContractFunction = millionaireContract.at(millionaireContractAddress);

function nextQuestion() {

    console.log('nextQuestion', web3.eth.accounts.length);

    web3.eth.defaultAccount = web3.eth.accounts[0];
    millionaireContract = web3.eth.contract(millionaireContractABI);
    millionaireContractFunction = millionaireContract.at(millionaireContractAddress);

    console.log('sender', web3.eth.defaultAccount);

    var printQuestionLog = millionaireContractFunction.print_question({address:web3.eth.defaultAccount});

    printQuestionLog.watch(function(error, result){

        //document.getElementById('status').textContent = result.args.s;
        console.log('event next question', result.args);

        if(result.args.p != web3.eth.defaultAccount){
            console.log('not a user who call next question');
            return;
        }

        var question = result.args.q;
        var choices = result.args.c.split(';');

        var reward = web3.fromWei(web3.eth.getBalance(millionaireContractAddress),'ether').toString(10);
        console.log('reward', reward);

        document.getElementById('subtitle').textContent = '(Reward = ' + reward + ' ether)';
        document.getElementById('proposal').textContent = question;
        document.getElementById('vote1').textContent = choices[0];
        document.getElementById('vote2').textContent = choices[1];
        document.getElementById('vote3').textContent = choices[2];
        document.getElementById('vote4').textContent = choices[3];

        document.getElementById('proposal').textContent = question;
        document.getElementById('answer').textContent = 'Next';
        document.getElementById('status').textContent = '';

        showQuestion(true);
        showChoices(true);
        showLoading(false);
        showNext(false);

        allowAnswer = true;
    })

    showLoading(true);

    var result = millionaireContractFunction.nextQuestion({value: web3.toWei(1, "ether")});
    //var result = millionaireContractFunction.nextQuestion();
    console.log('next question api call', result);
}

function answer(choice) {

    if(!allowAnswer){
        console.log('not allow to answer');
        return;
    }

    allowAnswer = false;

    var printResultLog = millionaireContractFunction.print_result();
    printResultLog.watch(function(error, result){

        console.log('event print result', result.args);

        if(result.args.p != web3.eth.defaultAccount){
            console.log('not a user who call answer');
            return;
        }

        showLoading(false);
        document.getElementById('status').textContent = result.args.msg;
        document.getElementById('proposal').textContent = result.args.msg;

        showChoices(false);
        showNext(true);
        if(result.args.msg == 'Wrong answer.'){
            document.getElementById('status').textContent = 'Wrong answer! Click Restart to Begin';
            document.getElementById('proposal').textContent = 'Wrong answer! Click Restart to Begin';
            document.getElementById('answer').textContent = 'Restart';
        }else if(result.args.msg == 'Correct answer. Please next question.'){
            document.getElementById('status').textContent = 'Correct answer! Click Next to Continue';
            document.getElementById('proposal').textContent = 'Correct answer! Click Next to Continue';
            document.getElementById('answer').textContent = 'Next';
        }else if(result.args.msg == 'You win!'){
            document.getElementById('status').textContent = 'You Win! Click Start to Play Again';
            document.getElementById('proposal').textContent = 'You Win! Click Start to Play Again';
            document.getElementById('answer').textContent = 'Start';
        }
    })

    showLoading(true);
    var result = millionaireContractFunction.answer(choice);
    console.log('answer api call', result);
}

function showLoading(show){
    if(show){
        document.getElementById('loading').style.display = 'block';
    }else{
        document.getElementById('loading').style.display = 'none';
    }
}

function showQuestion(show){

    var visibility = 'hidden';
    if(show){
        visibility = 'visible';
    }
    document.getElementById('proposal').style.visibility = visibility;
    document.getElementById('vote1').style.visibility = visibility;
    document.getElementById('vote2').style.visibility = visibility;
    document.getElementById('vote3').style.visibility = visibility;
    document.getElementById('vote4').style.visibility = visibility;
}

function showChoices(show){
    var visibility = 'hidden';
    if(show){
        visibility = 'visible';
    }
    document.getElementById('vote1').style.visibility = visibility;
    document.getElementById('vote2').style.visibility = visibility;
    document.getElementById('vote3').style.visibility = visibility;
    document.getElementById('vote4').style.visibility = visibility;
}

function showNext(show){
    var visibility = 'hidden';
    if(show){
        visibility = 'visible';
    }
    document.getElementById('answer').style.visibility = visibility;
}