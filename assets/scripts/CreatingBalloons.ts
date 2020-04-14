
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    target: cc.Prefab = null;

    @property
    minSpeed: float = 100;

    @property
    maxSpeed: float = 500;

    start () 
    {
        this.createBalloon();
    }

    createBalloon(data)
    {
        this.current = cc.instantiate(this.target);
        this.node.addChild(this.current);
        if (!data) {
            data = this.generateRandomData();
        }
        const balloon = this.current.getComponent('Balloon');
        balloon.init(data.speed, data.x, data.y);
        setTimeout(function () {
            this.createBalloon();
          }.bind(this), 1000); // TO DO seconds multiply level with max and min seconds
    }


    generateRandomData()
    {
        let data = {
            speed: 0,
            x: 0,
            y: 0,
        };

        const xMin = - cc.winSize.width / 2 + this.current.width / 2;
        const xMax = cc.winSize.width / 2 - this.current.width / 2;
        data.x = xMin + Math.random() * (xMax - xMin);
        data.y = - cc.winSize.height / 2 - this.current.height / 2;
        data.speed = 100; // TO DO speed multiply level with max and min speed

        return data;
    }

}
