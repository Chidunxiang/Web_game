// ===================== Winter 2021 EECS 493 Assignment 2 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==============================================
// ============ Page Scoped Globals Here ========
// ==============================================

// Counters
let throwingItemIdx = 1;

// Size Constants
const FLOAT_1_WIDTH = 149;
const FLOAT_2_WIDTH = 101;
const FLOAT_SPEED = 2;
const OBJECT_REFRESH_RATE = 50;  //ms
const SCORE_UNIT = 100;  // scoring is in 100-point units
// const END_SCORE = 500;  // end the game if reach this score
const OLD_SPEED = 25;
let PERSON_SPEED = 25;


// Size vars
let maxPersonPosX, maxPersonPosY;
let maxItemPosX;
let maxItemPosY;

// Global Window Handles (gwh__)
let gwhGame, gwhStatus, gwhScore;

// Global Object Handles
// JQuery
let player;
let paradeRoute;
let paradeFloat1;
let paradeFloat2;
let paradeTimer;
let splash;
let InnerSettings;
let NewFrequency;
let beadsCounter, candyCounter;
let endBlock;

// End game
let endGame = false;
let end_score = 1000;  // end the game if reach this score

// Buttons
let OpenSetting, SaveSetting, DiscardSetting;
let Restart, SetScore, ConfirmScore;


/*
 * This is a handy little container trick: use objects as constants to collect
 * vals for easier (and more understandable) reference to later.
 */
const KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shift: 16,
  spacebar: 32
};

let createThrowingItemIntervalHandle;
let currentThrowingFrequency = 2000;


// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready( function() {
    console.log("Ready!");

    // Set global handles (now that the page is loaded)
    // Allows us to quickly access parts of the DOM tree later
    gwhGame = $('#actualGame');
    gwhStatus = $('.status-window');
    gwhScore = $('#score-box');
    player = $('#player');  // set the global player handle
    paradeRoute = $("#paradeRoute");
    paradeFloat1 = $("#paradeFloat1");
    paradeFloat2 = $("#paradeFloat2");

    // Set global positions for thrown items
    maxItemPosX = $('.game-window').width() - 50;
    maxItemPosY = $('.game-window').height() - 40;

    // Set global positions for the player
    maxPersonPosX = $('.game-window').width() - player.width();
    maxPersonPosY = $('.game-window').height() - player.height();

    // End Game
    endBlock = $('.end');
    endBlock.hide();
    
    // Splash
    splash = $('.splash');

    // Superpower
    player.magic = false;

    // Settings
    InnerSettings = $('.InnerSettings');
    OpenSetting = $('.OuterSettings #Open');
    SaveSetting = $('.InnerSettings #Save');
    DiscardSetting = $('.InnerSettings #Discard');
    NewFrequency = $('.NewFrequency');
    Restart = $('.OuterSettings #Restart');
    SetScore = $('.OuterSettings #SetScore');
    ConfirmScore = $('.OuterSettings #ConfirmScore');

    // Object Counter
    beadsCounter = document.getElementById('beadsCounter');
    candyCounter = document.getElementById('candyCounter');


    // --------------- Splash ---------------
    // TODO: Add a splash screen and delay starting the game
    splash.show();
    gwhGame.hide();

    setTimeout( () => {
        if(!endGame) {
            splash.hide();
            gwhGame.show();
            startParade();
            $(window).keydown(keydownRouter);
            // Throw items onto the route at the specified frequency
            createThrowingItemIntervalHandle = setInterval(createThrowingItem, currentThrowingFrequency);
        }
    }, 3000);
    // --------------- Splash ---------------


    // --------------- Settings ---------------
    // TODO: Event handlers for the settings panel
    OpenSetting.show();
    SetScore.show();
    ConfirmScore.show()
    InnerSettings.hide();
    Restart.hide();
    
    OpenSetting.click( () => {
        OpenSetting.hide();
        ConfirmScore.hide();
        SetScore.hide();
        InnerSettings.show();
    });

    ConfirmScore.click( () => {
        end_score = SetScore.val().match(/\d+/g);
        if(end_score.length > 1) {
            end_score = end_score.join('');
        } 
        end_score = parseInt(end_score);

        if(end_score >  gwhScore.text() ) {
            $('#SetScore').attr("placeholder", "Your goal is: " + end_score);
            SetScore.val("");
        }
        else {
            alert('Your goal must greater than your current score!');
        }
    })

    DiscardSetting.click( () => {
        NewFrequency.val(currentThrowingFrequency);
        OpenSetting.show();
        ConfirmScore.show();
        SetScore.show();
        InnerSettings.hide();
    });

    SaveSetting.click( () => {
        let NewValue = NewFrequency.val();
        
        // Parse input string into integers
        NewValue = NewValue.match(/\d+/g);
        if(NewValue.length > 1) {
            NewValue = NewValue.join('');
        } 
        NewValue = parseInt(NewValue);
        // Parse input string into integers
        
        if(NewValue < 100) {
            alert('Frequency must be a number greater than or equal to 100');
        }
        else {
            currentThrowingFrequency = NewValue;
            NewFrequency.val(NewValue);
            OpenSetting.show();
            ConfirmScore.show();
            SetScore.show();
            InnerSettings.hide();
            
            clearInterval(createThrowingItemIntervalHandle);
            createThrowingItemIntervalHandle = setInterval(createThrowingItem, currentThrowingFrequency);
        }
    });
    // --------------- Settings ---------------
});


// Key down event handler
// Check which key is pressed and call the associated function
function keydownRouter(e) {
    switch (e.which) {
        case KEYS.shift:
            break;
        case KEYS.spacebar:
            break;
        case KEYS.left:
        case KEYS.right:
        case KEYS.up:
        case KEYS.down:
            movePerson(e.which);
            break;
        default:
            console.log("Invalid input!");
    }
}


// Handle player movement events
// TODO: Stop the player from moving into the parade float. Only update if
// there won't be a collision
function movePerson(arrow) {
    switch (arrow) {
        case KEYS.left: { // left arrow
            let newPos = parseInt(player.css('left'))-PERSON_SPEED;
            if (newPos < 0) {
                newPos = 0;
            }

            // measure player.css('left'), press left increases 'left'
            if(!isOrWillCollide(player, paradeFloat1, -PERSON_SPEED, 0) &&
               !isOrWillCollide(player, paradeFloat2, -PERSON_SPEED, 0))
            {
                player.css('left', newPos);
            }
            break;
        }
        case KEYS.right: { // right arrow
            let newPos = parseInt(player.css('left'))+PERSON_SPEED;
            if (newPos > maxPersonPosX) {
                newPos = maxPersonPosX;
            }

            // measure player.css('left'), press right increases 'left'
            if(!isOrWillCollide(player, paradeFloat1, PERSON_SPEED, 0) &&
               !isOrWillCollide(player, paradeFloat2, PERSON_SPEED, 0))
            {
                player.css('left', newPos);
            }
            break;
        }
        case KEYS.up: { // up arrow
            let newPos = parseInt(player.css('top'))-PERSON_SPEED;
            if (newPos < 0) {
                newPos = 0;
            }

            // measure player.css('top'), press up decreases 'top'
            if(!isOrWillCollide(player, paradeFloat1, 0, -PERSON_SPEED) &&
               !isOrWillCollide(player, paradeFloat2, 0, -PERSON_SPEED))
            {
                player.css('top', newPos);
            }
            break;
        }
        case KEYS.down: { // down arrow
            let newPos = parseInt(player.css('top'))+PERSON_SPEED;
            if (newPos > maxPersonPosY) {
                newPos = maxPersonPosY;
            }

            // measure player.css('top'), press down increases 'top'
            if(!isOrWillCollide(player, paradeFloat1, 0, PERSON_SPEED) &&
               !isOrWillCollide(player, paradeFloat2, 0, PERSON_SPEED))
            {
                player.css('top', newPos);
            }
            break;
        }
    }
}


// Check for any collisions with thrown items
// If needed, score and remove the appropriate item
function checkCollisions(checkObject, curObject) {
    // beadsCounter = document.getElementById('beadsCounter');
    // candyCounter = document.getElementById('candyCounter');
    let slogan = $('.onfire');

    if(isColliding(player, curObject) && !checkObject.collide) {
        curObject.css("background-color", "yellow");
        curObject.css("border-radius","50%");
        // objectType = checkObject.attr('class');
        checkObject.collide = true;

        if(checkObject.hasClass("beads")) {
            beadsCounter.innerHTML = parseInt(beadsCounter.innerHTML) + 1;
        }
        else if(checkObject.hasClass("candy")) {
            candyCounter.innerHTML = parseInt(candyCounter.innerHTML) + 1;
        }
        gwhScore.text(parseInt(gwhScore.text()) + SCORE_UNIT);

        // if(parseInt(gwhScore.text()) >= (3/5) * end_score) {
        if(checkObject.hasClass('magic') && !player.magic) {
            let avatar = $('.player-avatar');
            player.magic = true;

            // Indicating superpower
            avatar.css("background-color", "orange");
            avatar.css("border-radius","100%");
            slogan.text("You are on Fire!");
            
            // Increase moving speed
            if(PERSON_SPEED <= OLD_SPEED) {
                PERSON_SPEED = 2 * PERSON_SPEED;
            }
            
            let hight1 = setInterval( () => {
                slogan.css('color', 'red');
            }, 500);

            let hight2 = setInterval( () => {
                slogan.css('color', 'black');
            }, 1000);

            // Superpower lasts for 5s
            setTimeout( () => {
                player.magic = false;
                avatar.css("background-color", "");
                avatar.css("border-radius", "");
                slogan.text("Welcome!");
                PERSON_SPEED = OLD_SPEED;
               
                clearInterval(hight1);
                clearInterval(hight2);
            }, 5000);
        }

        if(parseInt(gwhScore.text()) >= end_score) {
            EndGame();
            return;
        }

        setTimeout( () => {
            graduallyFadeAndRemoveElement(curObject);
        }, 0);
    }
}


function EndGame() {
    endGame = true;
    OpenSetting.hide();
    InnerSettings.hide();
    ConfirmScore.hide();
    SetScore.hide();
    Restart.show();

    endBlock.show();
    gwhGame.hide();

    setInterval( () => {
        endBlock.css('color', 'red');
        endBlock.css('font-size', 'xx-large');
    }, 500);

    setInterval( () => {
        endBlock.css('color', 'black');
        endBlock.css('font-size', 'large');
    }, 1000);

    Restart.click( ()=> {
        location.reload()
    });
}


// Move the parade floats (Unless they are about to collide with the player)
function startParade(){
    console.log("Starting parade...");

    if(endGame) {
        return;
    }

    let QueenStart = parseInt(paradeFloat1.css('left'));
    let AlligatorStart = parseInt(paradeFloat2.css('left'));

    paradeTimer = setInterval( function() {
        // TODO: (Depending on current position) update left value for each
        let currQueen =  parseInt(paradeFloat1.css('left'));
        let currAlligator =  parseInt(paradeFloat2.css('left'));
        let newQueen = currQueen + FLOAT_SPEED;
        let newAlligator = currAlligator + FLOAT_SPEED;

        if(!isOrWillCollide(paradeFloat2, player, FLOAT_SPEED, 0) &&
           !isOrWillCollide(paradeFloat1, player, FLOAT_SPEED, 0))
        {
            paradeFloat2.css('left', newAlligator);
            paradeFloat1.css('left', newQueen);
        }

        // if(parseInt(paradeFloat1.css('left')) > parseInt(gwhGame.css('width'))) {
        if(newQueen > parseInt(gwhGame.css('width'))) {
            paradeFloat1.css('left', QueenStart);
            paradeFloat2.css('left', AlligatorStart);
        }

        // parade float, check for collision with player, etc.
        if(isColliding(paradeFloat2, player) ||
           isColliding(paradeFloat1, player))
        {
            paradeFloat1.css('left', currQueen);
            paradeFloat2.css('left', currAlligator);
        }
    }, OBJECT_REFRESH_RATE);
}


// Get random position to throw object to, create the item, begin throwing
function createThrowingItem(){
    // TODO
    if(endGame) {
        return;
    }

    // let objectTypeIndex = getRandomNumber(0, 3);
    let objectTypeIndex = (Math.random()*10) % 3;
    let objectType, imageString, objectWidth, objectHeight;
    let checkObject, curObject;
    let magicIndex = Math.floor(Math.random()*10) % 10;

    // ------- Classify throw object type -------
    if(magicIndex !== 3) {
        if(objectTypeIndex < 2) {
            objectType = "beads";
            imageString = "beads.png";
            objectWidth = "40px";
            objectHeight = "40px";
        }
        else {
            objectType = "candy";
            imageString = "candy.png";
            objectWidth = "46px";
            objectHeight = "40px";
        }
    }
    else {
        objectType = "magic";
        imageString = "mushroom.png";
        objectWidth = "46px";
        objectHeight = "40px";
    }
    // ------- Classify throw object type -------

    let addBlock = createItemDivString(throwingItemIdx, objectType, imageString);
    let throwObjectPos = parseInt(paradeFloat2.css('left')) + FLOAT_2_WIDTH;
    
    if( throwObjectPos >= 0 && throwObjectPos <= maxItemPosX) {
        // ------- Create add block -------
        gwhGame.append(addBlock);
        checkObject = $("#i-" + throwingItemIdx);
        checkObject.collide = false;
        curObject = checkObject.find('img');
        curObject.css({width: objectWidth, height: objectHeight});
        throwingItemIdx += 1;
        // ------- Create add block -------
        
        // ------- Set initial position -------
        curObject.css({position: 'absolute', left: throwObjectPos, top: '225px'});
        // ------- Set initial position -------

        let randomX = Math.floor(Math.random() * 41) - 20;
        let randomY = Math.ceil(Math.random() * 41) - 20;
        // let randomX = getRandomNumber(-20, 20);
        // let randomY = getRandomNumber(-20, 20);
        updateThrownItemPosition(curObject, randomX, randomY, 10);

        // Periodically check for collisions with thrown items (instead of checking every position-update)
        setInterval(function() {
            checkCollisions(checkObject, curObject);
        }, 100);
    }
}


// Helper function for creating items
// throwingItemIdx - index of the item (a unique identifier)
// type - beads or candy
// imageString - beads.png or candy.png
function createItemDivString(itemIndex, type, imageString){
    return "<div id='i-" + itemIndex + "' class='throwingItem " + type + "'><img src='img/" + imageString + "'/></div>";
}


// Throw the item. Meant to be run recursively using setTimeout, decreasing the
// number of iterationsLeft each time. You can also use your own implementation.
// If the item is at it's final postion, start removing it.
function updateThrownItemPosition(elementObj, xChange, yChange, iterationsLeft){
    // ------- Update position -------
    let currentX, currentY;

    currentX = parseInt(elementObj.css('left'));
    currentY = parseInt(elementObj.css('top'));

    if((currentX + xChange > 0) && (currentX + xChange < maxItemPosX) &&
       (currentY + yChange > 0) && (currentY + yChange < maxItemPosY))
    {
        elementObj.css('left', currentX + xChange);
        elementObj.css('top', currentY + yChange);
    }

    if (iterationsLeft != 0) {
        setTimeout( () => {
            updateThrownItemPosition(elementObj, xChange, yChange, iterationsLeft - 1);
        }, OBJECT_REFRESH_RATE);
    }

    setTimeout( () => {
        graduallyFadeAndRemoveElement(elementObj);
        return;
    }, 5000);
    // ------- Update position -------
}


function graduallyFadeAndRemoveElement(elementObj){
  // Fade to 0 opacity over 2 seconds
  elementObj.fadeTo(2000, 0, function(){
    $(this).remove();
  });
}

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}


// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange){
    return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}


// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange){
    const o1D = { 'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
    };
    const o2D = { 'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top,
        'bottom': o2.offset().top + o2.height()
    };
    // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
        // collision detected!
        return true;
    }
    return false;
}


// Get random number between min and max integer
function getRandomNumber(min, max){
  return (Math.random() * (max - min)) + min;
}