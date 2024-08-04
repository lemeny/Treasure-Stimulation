interface GameState {
    story: string;
    choices: Choice[];
    outcomes?: Outcome[];
}

interface Choice {
    text: string;
    nextState: (attributes:PlayerAttribute) => GameState;
    // probabilities: number[];
    condition?: (attributes:PlayerAttribute) => boolean;

}

interface PlayerAttribute {
    money: number;
    health: number;
    insight: number;
    reputation: number;
}

type Outcome = (attributes: PlayerAttribute) => GameState;


let startState: GameState;
let IdentifyTreasure: GameState;
let CrossRode: GameState;
let leftPath: GameState;
let rightPath: GameState;
let State1: GameState;
let State2: GameState;
let State1_1: GameState;
let State1_2: GameState;

let EndGame: GameState;

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
    EndGame = { story: "看来收藏古玩不适合你，让我们看看喜欢收藏的世界线吧！", choices: [] };

    startState.story = "你是个古玩爱好者，希望通过自己的经验找到一些宝贝";
    startState.choices = [
        { text: "去古玩街", nextState: () => CrossRode },
        { text: "在周围逛逛", nextState: () => rightPath },
        { text: "把玩自己的藏品", nextState: (attributes) => handleIdentifyEvent(attributes) },
        { text: "放弃收藏爱好", nextState: () => EndGame },
    ];

    CrossRode.story = "你来到了一个十字路口";
    CrossRode.choices = [
        { text: "往左走", nextState: () => leftPath },
        { text: "往右走", nextState: () => rightPath }
    ];

    leftPath.story = "有一个老大爷在摆地摊";
    leftPath.choices = [
        { text: "上去看看", nextState: () => State1 },
        { text: "走开", nextState: () => State2 }
    ];

    rightPath.story = "有个面色不善的小混混盯着你看";
    rightPath.choices = [
        { text: "加速往前走", nextState: () => CrossRode },
        { text: "盯着走上去", nextState: () => startState }
    ];

    State1.story = "老大爷看到你，说：这个古董是我从老家带来的，你看看吧";
    State1.choices = [
        { text: "看看", nextState: () => State1_1 },
        { text: "不感兴趣", nextState: () => startState }
    ];

    State1_1.story = "你看到了一个古董，你想要买吗？";
    State1_1.choices = [
        { text: "买", nextState: () => State1_2, condition: (attributes) => attributes.money >= 10 },
        { text: "不买", nextState: () => CrossRode }
    ];

    State1_2.story = "你根据自己的经验买了一件古董";
    State1_2.choices = [
        { text: "字画", nextState: () => startState },
        { text: "瓷器", nextState: () => startState },
        { text: "木雕", nextState: () => startState },
        { text: "铜器", nextState: () => startState },
        { text: "玉器", nextState: () => startState },
        { text: "其他", nextState: () => startState }
    ];

    State2.story = "老大爷看到你，说：这个古董是我从老家带来的，你看看吧";
    State2.choices = [
        { text: "看看", nextState: () => State1_1 },
        { text: "不感兴趣", nextState: () => startState }
    ];
}


function handleIdentifyEvent(attributes: PlayerAttribute): GameState {
    const successRate = 0.2 + Math.log(attributes.insight);
    const isSuccess = Math.random() < successRate;

    if (isSuccess) {
        attributes.insight += 5;
        return { story: "鉴定成功！", choices: [{ text: "继续", nextState: () => startState }] };
    } else {
        attributes.insight += 1;
        return { story: "鉴定失败！", choices: [{ text: "继续", nextState: () => startState }] };
    }
}


class Game {
    private currentState: GameState;
    private playerAttributes: PlayerAttribute;
    private attributesElement: HTMLElement;
    private storyElement: HTMLElement;
    private choicesElement: HTMLElement;

    constructor(initialState: GameState) {
        this.currentState = initialState;
        this.playerAttributes = { money: 100, health: 100, reputation: 0 ,insight: 0};
        this.attributesElement = document.getElementById('attributes')!;
        this.storyElement = document.getElementById('story')!;
        this.choicesElement = document.getElementById('choices')!;
        this.render();
    }

    private render() {
        this.attributesElement.innerText = " 金钱：" + this.playerAttributes.money + " 健康：" + this.playerAttributes.health + " 声望：" + this.playerAttributes.reputation+ " 见识：" + this.playerAttributes.insight;
        this.storyElement.innerText = this.currentState.story;
        this.choicesElement.innerHTML = '';
        this.currentState.choices.forEach(choice => {
            const button = document.createElement('button');
            button.innerText = choice.text;
            button.addEventListener('click', () => {
                this.handleChoice(choice);
            });
            this.choicesElement.appendChild(button);
        });
    }

    private handleChoice(choice: Choice) {
        if (choice.condition && !choice.condition(this.playerAttributes)) {
            alert('条件未满足');
            return;
        }

        this.currentState = choice.nextState(this.playerAttributes);
        this.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeStates();
    new Game(startState);
});
