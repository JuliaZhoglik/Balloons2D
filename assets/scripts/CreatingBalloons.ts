
const {ccclass, property} = cc._decorator;

@ccclass
export default class CreatingBalloons extends cc.Component {

    @property(cc.Prefab)
    target: cc.Prefab = null;

    @property()
    deltaSpeed: number = 50;

    @property()
    minSpeed: number = 200;

    @property()
    maxSpeed: number = 700;

    _speed: number = 0;
    _current: cc.Node = null;

    createBalloon(data)
    {
        this._current = cc.instantiate(this.target);
        this.node.addChild(this._current);
        this._current.on('ball_gone', this.onBallGone, this);
        this._current.on('ball_hit', this.onBallHit, this);

        if (!data) {
            data = this.generateRandomData();
        }
        const balloon = this._current.getComponent('Balloon');
        balloon.Initialize(data.speed, data.x, data.y);
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
        this.node.emit("life_decrease");
    }

    onBallHit ()
    {
        this.node.emit("score_increase");
    }

    ResetSpeed()
    {
        this.SetSpeedBalls(this.minSpeed);
    }

    SetSpeedBalls (speed: number)
    {
        this._speed = speed;

        if (this.node.childrenCount > 0)
        {
            let balls = this.node.children;
            for (let obj of balls) 
            {
                const balloon = obj.getComponent('Balloon');
                balloon.SetSpeed(this._speed);
            }
        }
    }

    SpeedUp ()
    {
        this._speed += this.deltaSpeed;
        if (this._speed > this.maxSpeed)
        {
            this._speed = this.maxSpeed;
        }

        if (this.node.childrenCount > 0)
        {
            let balls = this.node.children;
            for (let obj of balls) 
            {
                const balloon = obj.getComponent('Balloon');
                balloon.SetSpeed(this._speed);
            }
        }
    }

    onEnable ()
    {
        if (this.node.childrenCount > 0)
        {
            let balls = this.node.children;
            for (let obj of balls) 
            {
                const balloon = obj.getComponent('Balloon');
                balloon.enabled = true;
            }
        }
    }

    onDisable ()
    {
        if (this.node.childrenCount > 0)
        {
            let balls = this.node.children;
            for (let obj of balls) 
            {
                const balloon = obj.getComponent('Balloon');
                balloon.enabled = false;
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
