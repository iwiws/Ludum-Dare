
var BASE_LOOP_INTERVAL = 1400; // 2500
var currentLoopInterval = BASE_LOOP_INTERVAL;
var chatCallback;
var settleArray = [];


// Settlement
function Settlement () {
  this.id = 0;
  this.totalPopulation = 0;
  // Residential
  
  this.getDisplayInfo = function () {
    return {
			'id': this.id
		};
  };
};

// Initialize a new Village
cVillageInit = function () {
  var village = new Settlement();
  village.totalPopulation = 500;
  // residential
  
  settleArray.push(village);
  return village;
};

/*
 * gameInitialization, start game loop
 */
exports.gameInitialization = function gameInitialization (loopedBroadcastFunction, chatCallbackFct) {
  chatCallback = chatCallbackFct;
	
	exports.startNewGame();
  
  var updateGameLogic = function () {
		//GAME LOOP    
    
		// Broadcast new world state
		currentLoopInterval = BASE_LOOP_INTERVAL;
		loopedBroadcastFunction();
    setTimeout(updateGameLogic, currentLoopInterval);
  };
  updateGameLogic();
};

exports.getDisplayInitData = function getDisplayInitData () {
  displayInitData = {
    'pif': "paf"
    'loopInterval': currentLoopInterval
  };
  return displayInitData;
};

// reset game variables
exports.startNewGame = function startNewGame () {
  settleArray = [];
  cVillageInit();
};