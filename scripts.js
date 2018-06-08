let container = $('#container');
let buttons = $('.color-button');
let audio = $('audio');
let scoreBoard = $('#score');
let start = $('#start');
let steps = $('#steps');
let strictModeButton = $('#strict-mode');
let message = $('#message');
let restart = $('#restart');


let simonSays = {
	// strict mode
	// score
	// function startNewRound() {}
		// adds square
		// lights up board (loops over elements, and after a delay adds class of active)

	// function strictModeToggle() {}
}

let currentRound = {
	// var user clicks arr: squares that the user has clicked
	// var game order arr: order of the squares that light up
	// function addNewSquare() {}
	// function lightUpBoard() {}
	// function checkForMatch() {}
	// function updateScore() {}
	playSound: function(color) {
		audio.attr('src', sounds[color]);
		audio[0].play();
	},

	// createNewCombination: function() {
	// 	let elements = ['red', 'yellow', 'blue', 'green']
	// 	newCombo.push(elements[(Math.floor(Math.random()*4))])
	// 	console.log(newCombo)
	// }
}

// *each colored div has a class of button and an id of its color
// when clicked, add and then remove class of active

// click events
	// onclick: start button - game.startRound
	// on mousepress / on click (?): for all elements with a class of button
		// if target is blue, 
			// adds blue square to users array, 
			// checks if user and game arrays are the same
			// triggers the sound (while the mouse is clicked on it)
		// if target is yellow, 
			// adds blue square to users array, 
			// checks if user and game arrays are the same
			// triggers the sound (while the mouse is clicked on it)
		// if target is green, 
			// adds blue square to users array, 
			// checks if user and game arrays are the same
			// triggers the sound (while the mouse is clicked on it)
		// if target is red, 
			// adds blue square to users array, 
			// checks if user and game arrays are the same
			// triggers the sound (while the mouse is clicked on it)

// buttons.addEventListener('click', function(e){
// 	// if (e.target ===) {

// 	// }
// 	console.log(e.target);
// })

// for whatever the target is, i want to add its id to the array
// create another funciton to add a class of active while holding down the mouse on 'this'

let sounds = {
	'blue': 'sounds/simonSound1.mp3',
	'yellow': 'sounds/simonSound2.mp3',
	'red': 'sounds/simonSound3.mp3',
	'green': 'sounds/simonSound4.mp3'
};

let buttonsClicked = [];
let newCombo = []; //this will be random and add 1 every round
let score = 0;
let numberOfSteps = newCombo.length;
let strictMode = false;


strictModeButton.on('click', toggleStrictMode);

// handles user clicks
Array.from(buttons).forEach(function(elem){
	$(elem).on('mousedown', function(e){
		$(e.target).toggleClass('active'); //make tile brighter
		let color = $(e.target).attr("class").split(' ')[0]; //get color from the class name
		buttonsClicked.push(color); //push the color to the array
		currentRound.playSound(color);
		console.log('newCombo: '+newCombo.length)
		console.log('buttonsClicked: '+buttonsClicked.length)
		checkForMatch(buttonsClicked, newCombo) //check to see if the user input matches the combo
	})
	$(elem).on('mouseup', function(e){
		setTimeout( function(){ $(e.target).toggleClass('active'); }, 350 ); 
	})
})

function initNewRound() {
		console.log('init new round')
		updateSteps();
		buttonsClicked.length = 0;
		createNewCombo();
		lightUpBoard(newCombo)
}

function createNewCombo() {
	let elements = ['red', 'yellow', 'blue', 'green']
	newCombo.push(elements[(Math.floor(Math.random()*4))])
}

// adds and removes active class to denote the tiles randomely chosen by the createNewCombination function
function lightUpBoard(newCombo) {
	for(var i = 0; i < newCombo.length; i++){
    (function(i){
      setTimeout(function(){
        let currentEl = $(`.${newCombo[i]}`);
        currentEl.addClass('active');	
        let color = currentEl.attr("class").split(' ')[0];
        currentRound.playSound(color); 
        setTimeout( function(){ currentEl.removeClass('active'); }, 400 );          
      }, 800 * (i + 1));
    })(i);
	}
}

function updateScore() {
	score += 1;
	scoreBoard.text('Score: '+score)
	if (score === 20) {
		alert('you win!')
	}
}

function updateSteps() {
	numberOfSteps += 1;
	console.log('steps: '+steps);
	steps.text('Steps: '+numberOfSteps);
}

function resetNoStrict() {
	buttonsClicked.length = 0;
	lightUpBoard(newCombo);
}

function displayMessageLost() { //look into promises - move reset game back to the check for match function or move reset to initnewround function
	message.text(`You guess wrong. Brush yourself off and try again.`);

	setTimeout( function(){ 
		message.fadeOut( "slow", function() {
    	message.text('');
  	});
	}, 1000 ); 
	
	setTimeout(function(){
		resetGame();
	}, 2000)
}

	function resetGame() {
		console.log('resetting game')
		// buttonsClicked = [];
		newCombo.length = 0; //this will be random and add 1 every round
		buttonsClicked.length = 0;
		// console.log('newCombo: '+newCombo.length)
		// console.log('buttonsClicked: '+buttonsClicked.length)
		score = 0;
		scoreBoard.text('Score: '+score);
		numberOfSteps = newCombo.length;
		steps.text('Steps: '+numberOfSteps);
		strictMode = false;
		initNewRound();
	}

function checkForMatch(buttonsClicked, newCombo) {
	let flag = true;
	let gameLost = false;

	buttonsClicked.forEach(function(color, index){
		if (newCombo[index] === color) { //if the element at the index of the color is the same
			console.log('continue')		
		} else {
			if (!strictMode) {
				console.log('no strict')
				resetNoStrict()
			} else if (strictMode) {
				displayMessageLost();
				console.log('you lost')
				gameLost = true;
				if (!strictMode) { strictMode = true }
			}
		}
	})
	if (flag === true && gameLost === false && buttonsClicked.length === newCombo.length) { //if the all the elements are the same and the arrays are equal length
		// return true;
		updateScore();
		initNewRound();
	} 
}

function toggleStrictMode() {
	strictMode = !strictMode;
	if (strictMode) {
		alert('you are in strict mode');
	} else if (!strictMode) {
		alert('you are not in strict mode');
	}
}

$(restart).on('click', function(e) {
	score = 0;
	newCombo.length = 0;
	numberOfSteps = 0;
	buttonsClicked.length = 0;
	scoreBoard.text('Score: '+score)
	initNewRound();
})

$(start).on('click', function(e) {
	scoreBoard.text('Score: '+score)
	initNewRound();
})















