
const {ccclass, property} = cc._decorator;

@ccclass
export default class CreatingBalloons extends cc.Component {

    @property(cc.Label)
    labelCount: cc.Label = null;

    @property(cc.Label)
    labelLife: cc.Label = null;

    @property(cc.Prefab)
    target: cc.Prefab = null;

    _life: number;
    _count: number;
    _speed: number;
    _current: cc.Node = null;

    @property()
    maxLife: number = 5;

    @property()
    countForLevelUp: number = 5;

    @property()
    deltaSpeed: number = 50;

    @property()
    minSpeed: number = 100;

    @property()
    maxSpeed: number = 500;

    onLoad () 
    {
        this._speed = this.minSpeed;
        this._life = this.maxLife;
        this._count = 0;
        this.labelCount.string = "Count: " + this._count;
        this.labelLife.string = "Life: " + this._life;
    }

    createBalloon(data)
    {
        this._current = cc.instantiate(this.target);
        this.node.addChild(this._current);
        this.node.childrenCount
        this._current.on('ball_gone', this.onBallGone, this);
        this._current.on('ball_hit', this.onBallHit, this);

        if (!data) {
            data = this.generateRandomData();
        }
        const balloon = this._current.getComponent('Balloon');
        balloon.init(data.speed, data.x, data.y);
    }


    generateRandomData()
    {
        let data = {
            speed: 0,
            x: 0,
            y: 0,
        };

        const xMin = - cc.winSize.width / 2 + this._current.width / 2;
        const xMax = cc.winSize.width / 2 - this._current.width / 2;
        data.x = xMin + Math.random() * (xMax - xMin);
        data.y = - cc.winSize.height / 2 - this._current.height / 2;
        data.speed = this._speed;

        return data;
    }

    onBallGone ()
    {
        this._life -= 1;
        if (this._life < 0)
        {
            cc.log("End game"); // TO DO
            return;
        }
        this.labelLife.string = "Life: " + this._life;
    }

    onBallHit ()
    {
        this._count += 1;
        this.labelCount.string = "Count: " + this._count;
        if (this._count % this.countForLevelUp == 0)
        {
           this._speed += this.deltaSpeed;
           if (this._speed > this.maxSpeed)
           {
               this._speed = this.maxSpeed;
           }

           let balls = this.node.children;
           for (let obj of balls) 
           {
                const balloon = obj.getComponent('Balloon');
                balloon.SetSpeed(this._speed);
           }

        }
    }

    update (dt)
    {
        if (this.node.childrenCount == 0)
        {
            this.createBalloon();
        }
        else
        {
            if (this._current.y > (- cc.winSize.height / 2 + this._current.height / 2))
            {
                this.createBalloon();
            }
        }
      
    }

}
