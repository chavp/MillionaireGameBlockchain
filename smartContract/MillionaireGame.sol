pragma solidity ^0.4.2;

contract MillionaireGame{
    
    struct Player{
        bool newShare;
        uint nextQuestion;
        bool waitingNextQuestion;
        uint correctCount;
    }
    
    struct Question
    {
        uint id;
        string question;
        string choices;
        string answer;
    }
    
    event print_question(address p, uint id, string q, string c, string a, uint reward);
    event print_result(address p, uint correctCount, string msg);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    address owner;

    uint questionsCount;
    mapping(uint => Question) questions;
    mapping(address => Player) players;

    uint feeAmount;
    uint totalRewardAmount;

    function MillionaireGame() payable {
        owner = msg.sender;
        feeAmount = 1;
        totalRewardAmount = 0;
        addQuestion(1, "Q-1?", "a, b, c, d, e", "a");
        addQuestion(2, "Q-2?", "a, b, c, d, e", "b");
        addQuestion(3, "Q-3?", "a, b, c, d, e", "c");
        addQuestion(4, "Q-4?", "a, b, c, d, e", "d");
        addQuestion(5, "Q-5?", "a, b, c, d, e", "e");
    }

    function nextQuestion() payable {
        //if (msg.value == 0 || msg.value < feeAmount || feeAmount < msg.value) return;
        Player player = players[msg.sender];
        if(!player.newShare){
            player.newShare = true;
            player.waitingNextQuestion = true;
        }
        if(player.waitingNextQuestion) {
            totalRewardAmount += feeAmount;
            Transfer(msg.sender, owner, msg.value);
            player.nextQuestion += 1;
            player.waitingNextQuestion = false;
            if( player.nextQuestion <= questionsCount){
                print_question(
                    msg.sender,
                    questions[player.nextQuestion].id, 
                    questions[player.nextQuestion].question, 
                    questions[player.nextQuestion].choices, 
                    "Please answer?.",
                    this.balance);
            }
        } else {
            print_question(
                    msg.sender,
                    questions[player.nextQuestion].id, 
                    questions[player.nextQuestion].question, 
                    questions[player.nextQuestion].choices, 
                    "Please answer?.",
                    this.balance);
        }
    }
    
    function answer(string _answer) {
        Player player = players[msg.sender];
        if(!player.newShare){
            player.newShare = true;
            player.waitingNextQuestion = true;
        }
        if(player.waitingNextQuestion){
            print_result(msg.sender, player.correctCount, "Please next question.");
        } else {
            if( stringsEqual(questions[player.nextQuestion].answer, _answer)){
                ++player.correctCount;
                player.waitingNextQuestion = true;
                print_result(msg.sender, player.correctCount, "Correct answer. Please next question.");
            } else {
                print_result(msg.sender, player.correctCount, "Wrong answer.");
                newGame(msg.sender);
            }
            
            if(player.correctCount == questionsCount){
                uint _value = this.balance;
                if(msg.sender.send(_value)){
                    print_result(msg.sender, player.correctCount, "You win!");
                    Transfer(owner, msg.sender, _value);
                    totalRewardAmount = 0;
                    newGame(msg.sender);
                }
            }
        }
    }
    
    function query() internal {
        for (uint i = 1; i <= questionsCount; i++) {
            print_question(msg.sender, questions[i].id, questions[i].question, questions[i].choices, "Question info.",
                    this.balance);
        }
    }
    
    function newGame(address _sender) internal {
        players[_sender].nextQuestion = 0;
        players[_sender].correctCount = 0;
        players[_sender].waitingNextQuestion = true;
    }
    
    function addQuestion(uint _id, string _question, string _choices, string _answer) internal {
        questions[_id].id = _id;
        questions[_id].question = _question;
        questions[_id].choices = _choices;
        questions[_id].answer = _answer;
        ++questionsCount;
    }
    
    function stringsEqual(string storage _a, string memory _b) internal returns (bool) {
		bytes storage a = bytes(_a);
		bytes memory b = bytes(_b);
		if (a.length != b.length)
			return false;
		// @todo unroll this loop
		for (uint i = 0; i < a.length; i ++)
			if (a[i] != b[i])
				return false;
		return true;
	}
}