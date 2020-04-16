
const {ccclass, property} = cc._decorator;

@ccclass
export default class Balloon extends cc.Component {

    @property(cc.AudioClip)
    hitAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    goneAudio: cc.AudioClip = null;

    _timeOut: number = 0.2;

    _top: number;
    _collider: cc.Component;
    _body: cc.Component;

    onLoad () 
    {
        this._top = (cc.winSize.height / 2 + this.node.height / 2);
        this._collider = this.node.getComponent(cc.BoxCollider);
        this._body = this.node.getComponent(cc.RigidBody);

        this.enabled = true;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Touch)
    {
        if (this.enabled)
        {
            let touchLoc = e.getLocation();
            if (cc.Intersection.pointInPolygon(touchLoc, this._collider.world.points)) {
                this.enabled = false;
                this.node.runAction(cc.fadeOut(this._timeOut));
                this.schedule(function() 
                {
                    this.BallHit();
                }, this._timeOut);

            }
        }
    }

    onDestroy ()
    {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    Initialize(speed: number, x: number, y: number)
    {
        this.node.setPosition(cc.v2(x, y));
        this.SetSpeed(speed);
    }

    SetSpeed(speed: number)
    {
        this._body.linearVelocity = cc.v2(0, speed);
    }

    BallHit ()
    {
        cc.audioEngine.play(this.hitAudio, false);
        this.node.emit("ball_hit");
        this.node.destroy();
    }

    CheckBallGone ()
    {
        if (this.enabled && (this.node.y > this._top))
        {
            this.enabled = false;
            cc.audioEngine.play(this.goneAudio, false);
            this.node.emit("ball_gone");
            this.node.destroy();
        }
    }

    update (dt) 
    {
        this.CheckBallGone();
    }
}
