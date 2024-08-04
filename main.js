var startState;
var CrossRode;
var leftPath;
var rightPath;
var State1;
var State2;
var State1_1;
var State1_2;
var EndGame;
function initializeStates() {
    startState = { story: "", choices: [] };
    CrossRode = { story: "", choices: [] };
    leftPath = { story: "", choices: [] };
    rightPath = { story: "", choices: [] };
    State1 = { story: "", choices: [] };
    State2 = { story: "", choices: [] };
    State1_1 = { story: "", choices: [] };
    State1_2 = { story: "", choices: [] };
    EndGame = { story: "游戏结束", choices: [] };
    startState.story = "你是个古玩爱好者，希望通过自己的经验找到一些宝贝";
    startState.choices = [
        { text: "去古玩街", nextState: [CrossRode], probabilities: [1.0] },
        { text: "在周围逛逛", nextState: [rightPath], probabilities: [1.0] }
    ];
    CrossRode.story = "你来到了一个十字路口";
    CrossRode.choices = [
        { text: "往左走", nextState: [leftPath], probabilities: [1.0] },
        { text: "往右走", nextState: [rightPath], probabilities: [1.0] }
    ];
    leftPath.story = "有一个老大爷在摆地摊";
    leftPath.choices = [
        { text: "上去看看", nextState: [State1], probabilities: [1.0] },
        { text: "走开", nextState: [State2], probabilities: [1.0] }
    ];
    rightPath.story = "有个面色不善的小混混盯着你看";
    rightPath.choices = [
        { text: "加速往前走", nextState: [CrossRode], probabilities: [1.0] },
        { text: "盯着走上去", nextState: [startState], probabilities: [1.0] }
    ];
    State1.story = "老大爷看到你，说：这个古董是我从老家带来的，你看看吧";
    State1.choices = [
        { text: "看看", nextState: [State1_1], probabilities: [1.0] },
        { text: "不感兴趣", nextState: [startState], probabilities: [1.0] }
    ];
    State1_1.story = "你看到了一个古董，你想要买吗？";
    State1_1.choices = [
        { text: "买", nextState: [State1_2], probabilities: [1.0], condition: function (attributes) { return attributes.money >= 10; } },
        { text: "不买", nextState: [CrossRode], probabilities: [1.0] }
    ];
    State1_2.story = "你根据自己的经验买了一件古董";
    State1_2.choices = [
        { text: "字画", nextState: [startState], probabilities: [1.0] },
        { text: "瓷器", nextState: [startState], probabilities: [1.0] },
        { text: "木雕", nextState: [startState], probabilities: [1.0] },
        { text: "铜器", nextState: [startState], probabilities: [1.0] },
        { text: "玉器", nextState: [startState], probabilities: [1.0] },
        { text: "其他", nextState: [startState], probabilities: [1.0] },
    ];
    State2.story = "老大爷看到你，说：这个古董是我从老家带来的，你看看吧";
    State2.choices = [
        { text: "看看", nextState: [State1_1], probabilities: [1.0] },
        { text: "不感兴趣", nextState: [startState], probabilities: [1.0] }
    ];
}
function getNextState(choice, attributes) {
    if (choice.condition && !choice.condition(attributes)) {
        return EndGame;
    }
    var nextState;
    var random = Math.random();
    var cumulativeProbability = 0;
    for (var i = 0; i < choice.probabilities.length; i++) {
        cumulativeProbability += choice.probabilities[i];
        if (random < cumulativeProbability) {
            return nextState = choice.nextState[i];
        }
    }
    return choice.nextState[choice.nextState.length - 1];
}
var Game = /** @class */ (function () {
    function Game(initialState) {
        this.currentState = initialState;
        this.playerAttributes = { money: 100, health: 100, reputation: 0 };
        this.attributesElement = document.getElementById('attributes');
        this.storyElement = document.getElementById('story');
        this.choicesElement = document.getElementById('choices');
        this.render();
    }
    Game.prototype.render = function () {
        var _this = this;
        this.attributesElement.innerText = " 金钱：" + this.playerAttributes.money + " 健康：" + this.playerAttributes.health + " 声望：" + this.playerAttributes.reputation;
        this.storyElement.innerText = this.currentState.story;
        this.choicesElement.innerHTML = '';
        this.currentState.choices.forEach(function (choice) {
            var button = document.createElement('button');
            button.innerText = choice.text;
            button.addEventListener('click', function () {
                _this.handleChoice(choice);
            });
            _this.choicesElement.appendChild(button);
        });
    };
    Game.prototype.handleChoice = function (choice) {
        // 添加条件判断和角色属性更新逻辑
        var nextState = getNextState(choice, this.playerAttributes);
        this.currentState = nextState;
        // 这里可以更新角色属性，比如减少金钱
        if (nextState === State1_2) {
            this.playerAttributes.money -= 10; // 假设购买古董需要花费10金钱
        }
        this.render();
    };
    return Game;
}());
document.addEventListener('DOMContentLoaded', function () {
    initializeStates();
    new Game(startState);
});