
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    EditName: cc.EditBox = null;

    @property(cc.Button)
    BtnPlay: cc.Button = null;

    @property(cc.Button)
    BtnRating: cc.Button = null;

    @property(cc.Node)
    mainMenu: cc.Node = null;

    @property(cc.Node)
    ratingMenu: cc.Node = null;

    @property(cc.Node)
    gameNode: cc.Node = null;

    @property()
    maxCountRating: number = 50;

    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Prefab)
    targetItem: cc.Prefab = null;

    _player: string = '';
    _rating: any;

    onLoad () 
    {
        this._player = cc.sys.localStorage.getItem('player');
        if (this._player == null)
        {
            this.EditName.string = '';
        }
        else
        {
            this.EditName.string = this._player;
        }

        this._rating = JSON.parse(cc.sys.localStorage.getItem('rating'));
        if (this._rating == null)
        {
            this._rating = new Array();
        }

        this.gameNode.on('end_game', this.EndGame, this);
    }

    MenuEnabled (enable: boolean)
    {
        this.EditName.enabled = enable;
        this.BtnPlay.enabled = enable;
        this.BtnRating.enabled = enable;
    }

    onClickPlay ()
    {
        if (this.EditName.string.length == 0)
        {
            this.MenuEnabled(false);
            this.EditName.placeholderFontColor = new cc.Color().fromHEX('#FF0000');
            setTimeout(function () {
                this.EditName.placeholderFontColor = new cc.Color().fromHEX('#BBBBBB');
                this.MenuEnabled(true);
            }.bind(this), 250);
            return;
        }
        this._player = this.EditName.string;
        cc.sys.localStorage.setItem('player', this._player);
        this.node.emit("start_game");
    }

    GetRatingString (num: number, name: string, val: number)
    {
        let sym = this.EditName.maxLength - name.length;
        let str = '';
        if (num < 9)
        {
            str = ' ';
        }
        str = str + (num + 1) + '. ' + name;
        if (sym > 0)
        {
            for (let i = 0; i < sym; i++)
            {
                str = str + ' ';
            }
        }
        str = str + ' ' + val;

        return str;
    }


    onClickRating ()
    {
        this.gameNode.active = false;
        this.mainMenu.active = false;
        this.ratingMenu.active = true;

        this.contentNode.destroyAllChildren();

        if (this._rating.length > 0)
        {
            for (let i = 0; i < this._rating.length; i++)
            {
                let itemNode = cc.instantiate(this.targetItem);
                this.contentNode.addChild(itemNode);
                let y = (-1) * itemNode.height * i;
                itemNode.setPosition(0, y);
                let str = this.GetRatingString(i, this._rating[i].name, this._rating[i].val);
                itemNode.getComponent(cc.Label).string = str;
            }
        }
    }

    onClickBack ()
    {
        this.gameNode.active = true;
        this.mainMenu.active = true;
        this.ratingMenu.active = false;
    }

    EndGame (score: number)
    {
        if (score > 0)
        {
            let resultGame = {name: this._player, val: score};
            this._rating.push(resultGame);
            this._rating.sort(function(a,b) {
                return b.val - a.val;
            });
            if (this._rating.length > this.maxCountRating)
            {
                this._rating.pop();
            }
            cc.sys.localStorage.setItem('rating', JSON.stringify(this._rating));
        }
    }

}
