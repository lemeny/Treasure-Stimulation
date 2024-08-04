"use strict";
// 延迟初始化游戏状态
var startState;
var leftPath;
var rightPath;
var fightAnimal;
var openChest;
function initializeStates() {
    startState = {
        story: "You are in a dark forest. There are paths to the left and right.",
        choices: [
            { text: "Go left", nextState: leftPath },
            { text: "Go right", nextState: rightPath }
        ]
    };
    leftPath = {
        story: "You encounter a wild animal! What do you do?",
        choices: [
            { text: "Run", nextState: startState },
            { text: "Fight", nextState: fightAnimal }
        ]
    };
    rightPath = {
        story: "You find a treasure chest! What do you do?",
        choices: [
            { text: "Open it", nextState: openChest },
            { text: "Leave it", nextState: startState }
        ]
    };
    fightAnimal = {
        story: "You bravely fight the animal and win!",
        choices: [
            { text: "Continue", nextState: startState }
        ]
    };
    openChest = {
        story: "You find gold and jewels inside the chest!",
        choices: [
            { text: "Take the treasure", nextState: startState },
            { text: "Leave the treasure", nextState: startState }
        ]
    };
    // 重新设置初始状态的下一步选择
    startState.choices = [
        { text: "Go left", nextState: leftPath },
        { text: "Go right", nextState: rightPath }
    ];
}
var Game = /** @class */ (function () {
    function Game(initialState) {
        this.currentState = initialState;
        this.storyElement = document.getElementById('story');
        this.choicesElement = document.getElementById('choices');
        this.render();
    }
    Game.prototype.render = function () {
        var _this = this;
        this.storyElement.innerText = this.currentState.story;
        this.choicesElement.innerHTML = '';
        this.currentState.choices.forEach(function (choice) {
            var button = document.createElement('button');
            button.innerText = choice.text;
            button.addEventListener('click', function () {
                _this.currentState = choice.nextState;
                _this.render();
            });
            _this.choicesElement.appendChild(button);
        });
    };
    return Game;
}());
document.addEventListener('DOMContentLoaded', function () {
    initializeStates();
    new Game(startState);
});
//# sourceMappingURL=main.js.map