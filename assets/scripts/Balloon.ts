
const {ccclass, property} = cc._decorator;

@ccclass
export default class Balloon extends cc.Component {

    _clicked: boolean = false;
    _collider: cc.Component;
    _top: number;
    _speed: number = 100.0;
    

    onLoad () 
    {
        this._top = (cc.winSize.height / 2 + this.node.height / 2);
        this._collider = this.node.getComponent(cc.BoxCollider);
        cc.director.getCollisionManager().enabled = true;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Touch)
    {
        if (!this._clicked)
        {
            let touchLoc = e.getLocation();
            if (cc.Intersection.pointInPolygon(touchLoc, this._collider.world.points)) {
                this._clicked = true;

                this.node.runAction(cc.fadeOut(0.2));
            }
        }
    }

    onDestroy ()
    {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }


    init(speed: number, x: number, y: number)
    {
        this.node.setPosition(cc.v2(x, y));
        this.SetSpeed(speed);
    }

    SetSpeed(speed: number)
    {
        this._speed = speed;
    }

    update (dt) 
    {
        if (!this._clicked)
        {
            this.node.y += this._speed * dt;
            if (this.node.y > this._top)
            {
                this.node.emit("ball_gone");
                this.node.destroy();
            }
        }
        else
        {
            if (this.node.opacity <= 0.0)
            {
                this.node.emit("ball_hit")
                this.node.destroy();
            }
        }
    }
}
