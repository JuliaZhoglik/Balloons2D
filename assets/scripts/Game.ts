import CreatingBalloons from "./CreatingBalloons";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Label)
    labelScore: cc.Label = null;

    @property(cc.Label)
    labelLife: cc.Label = null;

    @property(cc.Node)
    balloons: cc.Node = null;

    @property(cc.Node)
    gameOver: cc.Node = null;

    @property(cc.Node)
    menuNode: cc.Node = null;

    @property()
    maxLife: number = 5;

    @property()
    scoreForLevelUp: number = 5;

    _life: number;
    _score: number;

    onLoad () 
    {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        this.balloons.on('life_decrease', this.LifeDecrease, this);
        this.balloons.on('score_increase', this.ScoreIncrease, this);
        this.menuNode.on('start_game', this.onStartGame, this);
        this.InitGame();
    }

    InitGame ()
    {
        this.ResetGame();
        this.balloons.getComponent('CreatingBalloons').SetSpeedBalls(0);
        this.balloons.getComponent('CreatingBalloons').enabled = false;
        this.gameOver.active = false;
        this.menuNode.active = true;
    }

    ResetGame ()
    {
        this._life = this.maxLife;
        this._score = 0;
        this.labelScore.string = "SCORE: " + this._score;
        this.labelLife.string = "LIFE: " + this._life;
    }

    onStartGame ()
    {
        this.ResetGame();
        this.balloons.getComponent('CreatingBalloons').ResetSpeed();
        this.balloons.getComponent('CreatingBalloons').enabled = true;
        this.balloons.destroyAllChildren();
        this.gameOver.active = false;
        this.menuNode.active = false;
    }

    onEndGame ()
    {
       this.balloons.getComponent('CreatingBalloons').SetSpeedBalls(0);
       this.balloons.getComponent('CreatingBalloons').enabled = false;
       this.gameOver.active = true;
       this.menuNode.active = true;
       this.node.emit("end_game", this._score);
    }

    LifeDecrease ()
    {
        this._life -= 1;
        if (this._life < 0)
        {
            this.onEndGame();
            return;
        }
        this.labelLife.string = "LIFE: " + this._life;
    }

    ScoreIncrease ()
    {
        this._score += 1;
        this.labelScore.string = "SCORE: " + this._score;
        if (this._score % this.scoreForLevelUp == 0)
        {
            this.balloons.getComponent('CreatingBalloons').SpeedUp();
        }
    }


}
