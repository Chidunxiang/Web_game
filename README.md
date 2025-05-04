# Bonus Features
```
    By Hanfu Hou
    
---

### Superpower: Doubles Player Speed
There only way to get a superpower is to move the player to step on a golden mushroom. This will not only increases the score by the same unit as stepping on "beads" and "candy", but also doubles the moving speed of the player. This effect will last for 5 seconds. After 5 seconds, the player will return to its original speed (25px). Notice that stepping on multiple golden mushrooms will not increases the player's speed exponentially. The maximum moving speed is set to be 50px. In other words, if the player have already gained the superpower, stepping on golden mushrooms would not have any effect, not even extending the superpower lasting time.  

<br>

### Superpower Indicator: Golden Mushroom
I added an extra image, a golden mushroom, among the throwing objects. The frequency of throwing a golden mushroom is much smaller than throwing "beads" and "candy". It's around 1/10. This image would have the same dimension, width and height, as the "candy" image.  

<br>

### Superpower Indicator: Player
If the user moves the player to step on a "golden mushroom", the player avatar would be highlighted by a circle filled with "orange" color.  

<br>

### Superpower Indicator: Slogan
I added a couple of `SetInterval()` functions. If the user moves the player to step on a "golden mushroom", the "Welcome!" text in the status window would be changed to "You are on fire!". This text would would highlight itself by changing its font color between red and black until the player loses his superpower.  


<img src="https://github.com/danwyk/eecs493_hw2/blob/main/superpower.png">


<br>

### Input string handler
I added a handler to parse the input string into a list of integers. If there are more than 1 integers within the list, all of those integers will be joined a single string. The input value after the parsing process would be the "parseInt()", given that joined string.  
=There are two places that ask for user inputs. One for throwing frequency, one for setting a scoring goal to end the game.=  

<br>

==It can now support frequency inputs like:==  
- input: 100a => frequency: 100  
- input: a100 => frequency: 100  
- input: a10a10 => frequency: 1010  
- input: 1a0 100 => frequency: 1100  

<img src="https://github.com/danwyk/eecs493_hw2/blob/main/set_frequency.png">

<br>

### End Game: Scoring Goal
I added an input box and a button for ending the game. The user can type in their desirable scoring goal in the input box. This value cannot be smaller or equal to the current score. An alert box will be raised if the scoring goal is smaller or equal to the current scores. The default value is set to be 1000. In other words, by default, you will need to catch 10 objects to end the game.  

<br>

### End Game Indicator: End Game Splash
After the scoring goal is achieved, an "End Game Splash" will show up and the game window will be hidden. The content of the splash is "You Win! Game Over!"  

<br>

### End Game Indicator: Highlighted Splash
The "End Game Splash" will highlight itself between two colors and two font sizes: "red" + "xx-large" and "black" + "large" according.  

<br>

### Restart Game
After the game has ended, a "Restart Game" button will show up in the status window. At this time, the only button that is accessible and visible would be this one. Once the user click the button, the page will reload and the game should start again.  
