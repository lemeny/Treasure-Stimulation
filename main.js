var startState;
var IdentifyTreasure;
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
    IdentifyTreasure = { story: "开始鉴定宝物", choices: [] };
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
        { text: "去古玩街", nextState: function () { return CrossRode; } },
        { text: "在周围逛逛", nextState: function () { return rightPath; } },
        { text: "把玩自己的藏品", nextState: function (attributes) { return handleIdentifyEvent(attributes); } },
        { text: "放弃收藏爱好", nextState: function () { return EndGame; } },
    ];
    CrossRode.story = "你来到了一个十字路口";
    CrossRode.choices = [
        { text: "往左走", nextState: function () { return leftPath; } },
        { text: "往右走", nextState: function () { return rightPath; } }
    ];
    leftPath.story = "有一个老大爷在摆地摊";
    leftPath.choices = [
        { text: "上去看看", nextState: function () { return State1; } },
        { text: "走开", nextState: function () { return State2; } }
    ];
    rightPath.story = "有个面色不善的小混混盯着你看";
    rightPath.choices = [
        { text: "加速往前走", nextState: function () { return CrossRode; } },
        { text: "盯着走上去", nextState: function () { return startState; } }
    ];
    State1.story = "老大爷看到你，说：这个古董是我从老家带来的，你看看吧";
    State1.choices = [
        { text: "看看", nextState: function () { return State1_1; } },
        { text: "不感兴趣", nextState: function () { return startState; } }
    ];
    State1_1.story = "你看到了一个古董，你想要买吗？";
    State1_1.choices = [
        { text: "买", nextState: function () { return State1_2; }, condition: function (attributes) { return attributes.money >= 10; } },
        { text: "不买", nextState: function () { return CrossRode; } }
    ];
    State1_2.story = "你根据自己的经验买了一件古董";
    State1_2.choices = [
        { text: "字画", nextState: function () { return startState; } },
        { text: "瓷器", nextState: function () { return startState; } },
        { text: "木雕", nextState: function () { return startState; } },
        { text: "铜器", nextState: function () { return startState; } },
        { text: "玉器", nextState: function () { return startState; } },
        { text: "其他", nextState: function () { return startState; } }
    ];
    State2.story = "老大爷看到你，说：这个古董是我从老家带来的，你看看吧";
    State2.choices = [
        { text: "看看", nextState: function () { return State1_1; } },
        { text: "不感兴趣", nextState: function () { return startState; } }
    ];
}
function handleIdentifyEvent(attributes) {
    var successRate = 0.2 + Math.log(attributes.insight);
    var isSuccess = Math.random() < successRate;
    if (isSuccess) {
        attributes.insight += 5;
        return { story: "鉴定成功！", choices: [{ text: "继续", nextState: function () { return startState; } }] };
    }
    else {
        attributes.insight += 1;
        return { story: "鉴定失败！", choices: [{ text: "继续", nextState: function () { return startState; } }] };
    }
}
var Game = /** @class */ (function () {
    function Game(initialState) {
        this.currentState = initialState;
        this.playerAttributes = { money: 100, health: 100, reputation: 0, insight: 0 };
        this.attributesElement = document.getElementById('attributes');
        this.storyElement = document.getElementById('story');
        this.choicesElement = document.getElementById('choices');
        this.render();
    }
    Game.prototype.render = function () {
        var _this = this;
        this.attributesElement.innerText = " 金钱：" + this.playerAttributes.money + " 健康：" + this.playerAttributes.health + " 声望：" + this.playerAttributes.reputation + " 见识：" + this.playerAttributes.insight;
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
        if (choice.condition && !choice.condition(this.playerAttributes)) {
            alert('条件未满足');
            return;
        }
        this.currentState = choice.nextState(this.playerAttributes);
        this.render();
    };
    return Game;
}());
document.addEventListener('DOMContentLoaded', function () {
    initializeStates();
    new Game(startState);
});
