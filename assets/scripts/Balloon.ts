
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    speed: float = 100.0;
    

     onLoad () 
     {
        cc.director.getCollisionManager().enabled = true;

        let collider = this.node.getComponent(cc.BoxCollider);
        this.node.on(cc.Node.EventType.TOUCH_START, function (touch, event) {
            if (!this.clicked)
            {
                let touchLoc = touch.getLocation();
                if (cc.Intersection.pointInPolygon(touchLoc, collider.world.points)) {
                    this.clicked = true;

                    this.node.runAction(cc.fadeOut(0.2));
                }
            }
        }, this);
     }


    init(speed, x, y)
    {
        this.node.setPosition(cc.v2(x, y));
        this.speed = speed;
    }

    start () {
        this.clicked = false;
    }


     update (dt) {
        if (!this.clicked)
        {
            this.node.y += this.speed * dt;
            if (this.node.y > (cc.winSize.height / 2 + this.node.height / 2))
            {
                this.node.destroy(); // TO DO life minus
            }
        }
        else
        {
            if (this.node.opacity <= 0.0)
            {
                this.node.destroy(); // TO DO count plus
            }
        }
     }
}
