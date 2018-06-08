// elements
let container = $('#container'),
		buttons = $('.color-button'),
		audio = $('audio'),
		scoreBoard = $('#score'),
		start = $('#start'),
		steps = $('#steps'),
		strictModeButton = $('#strict-mode'),
		message = $('#message'),
		restart = $('#restart');

let sounds = {
	'blue': 'sounds/simonSound1.mp3',
	'yellow': 'sounds/simonSound2.mp3',
	'red': 'sounds/simonSound3.mp3',
	'green': 'sounds/simonSound4.mp3'
};

let buttonsClicked = [],
		newCombo = [],
		score = 0,
		numberOfSteps = newCombo.length,
		strictMode = false;

// -------------------------------------------------------
// click events
// strictModeButton.on('click', function(e){
// 	e.stopPropagation();
// });
strictModeButton.on('click', toggleStrictMode);



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

Array.from(buttons).forEach(function(elem){
	$(elem).on('mousedown', function(e){
		let color = $(e.target).attr("class").split(' ')[0]; //get color from the class name
		$(e.target).toggleClass('active'); //make tile brighter
		buttonsClicked.push(color); //push the color to the array
		playSound(color);
		checkForMatch(buttonsClicked, newCombo) //check to see if the user input matches the combo
	})
	$(elem).on('mouseup', function(e){
		setTimeout( function(){ $(e.target).toggleClass('active'); }, 350 ); 
	})
})

// -------------------------------------------------------

function playSound(color) {
	audio.attr('src', sounds[color]);
	audio[0].play();
}

function initNewRound() {
		console.log('init new round')
		updateSteps();
		buttonsClicked.length = 0;
		createNewCombo();
		lightUpBoard(newCombo)
}

function resetGame() {
	console.log('resetting game')
	newCombo.length = 0; //this will be random and add 1 every round
	buttonsClicked.length = 0;
	score = 0;
	scoreBoard.text('Score: '+score);
	numberOfSteps = newCombo.length;
	steps.text('Steps: '+numberOfSteps);
	strictMode = false;
	initNewRound();
}

// replays the same level 
function resetNoStrict() {
	buttonsClicked.length = 0;
	lightUpBoard(newCombo);
}

function toggleStrictMode() {
	strictMode = !strictMode;
	console.log(strictMode)
	if (strictMode) {
		$('#strict-text').css({'color': 'red'})
	} else {
		$('#strict-text').css({'color': 'black'})
	}
	
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
        playSound(color); 
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

// displays message when user loses
	//look into promises - move reset game back to the check for match function or move reset to initnewround function
	// only displays first time user loses - look into why
function displayMessageLost() { 
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

// checks for match of newCombo array and buttonsClicked array
function checkForMatch(buttonsClicked, newCombo) {
	let flag = true;
	let gameLost = false;

	buttonsClicked.forEach(function(color, index){
		if (newCombo[index] === color) { //if the element at the index of the color is the same
			console.log('continue')		
		} else {
			if (!strictMode) { //replays same level if not on strict mode
				console.log('no strict')
				resetNoStrict();
			} else if (strictMode) { 
				displayMessageLost(); //displays message and resets the game
				gameLost = true;
				if (!strictMode) { strictMode = true }
			}
		}
	})
	if (flag === true && gameLost === false && buttonsClicked.length === newCombo.length) { //if the all the elements are the same and the arrays are equal length
		updateScore();
		initNewRound();
	} 
}



















