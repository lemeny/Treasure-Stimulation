interface PlayerAttribute {
    money: number;
    health: number;
    reputation: number;
    insight: number; // 添加见识属性
}

type Outcome = (attributes: PlayerAttribute) => GameState;

interface Choice {
    text: string;
    outcome: Outcome;
    condition?: (attributes:PlayerAttribute) => boolean;
}

interface GameState {
    story: string;
    choices: Choice[];
}

class Game {
    // 其他代码...

    private handleChoice(choice: Choice) {
        const nextState = choice.outcome(this.playerAttributes);
        this.currentState = nextState;

        // 更新角色属性
        this.playerAttributes = nextState.attributes;

        this.render();
    }
}

// 定义状态
const State1_1: GameState = { story: "宝物是假的", choices: [] };
const State1_2: GameState = { story: "宝物是真的", choices: [] };

// 在初始化状态的时候，你需要为每个选择设置一个结果
const State1: GameState = {
    story: "开始鉴定宝物",
    choices: [
        { 
            text: "鉴定宝物", 
            outcome: attributes => {
                if (attributes.insight > 50) {
                    attributes.insight += 5;
                    return { ...State1_2, attributes }; // 宝物是真的
                } else {
                    attributes.insight += 1;
                    return { ...State1_1, attributes }; // 宝物是假的
                }
            }
        },
    ]
};

// 其他代码...