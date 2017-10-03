

const TYPE = cc.Enum({
    ZERO:0 ,
    ONE:1,
    TWO:2,
    THREE:3,
    FOUR:4,
    FIVE:5,
    SIX:6,
    SEVEN:7,
    EIGHT:8,
    BOMB:9
});

const STATE = cc.Enum({
    NONE:-1,// 未点击的初始状态
    CLICKED:-1,// 被点击的状态
    FLAG:-1,// 插旗的状态，表示有雷
    DOUBT:-1 // 疑问的状态，未确认
});

// 外部常量访问
module.exports = {
    TYPE:TYPE ,
    STATE:STATE
};

cc.Class({
    extends: cc.Component,

    properties: {
        // 定义这些图片，以便动态赋值给UI
        picNone:cc.SpriteFrame,
        picFlag:cc.SpriteFrame,
        picDoubt:cc.SpriteFrame,
        picBomb:cc.SpriteFrame,
        picZero:cc.SpriteFrame,
        picOne:cc.SpriteFrame,
        picTwo:cc.SpriteFrame,
        picThree:cc.SpriteFrame,
        picFour:cc.SpriteFrame,
        picFive:cc.SpriteFrame,
        picSix:cc.SpriteFrame,
        picSeven:cc.SpriteFrame,
        picEight:cc.SpriteFrame,
        _state:{
            default:STATE.NONE ,
            type:STATE ,
            visible:false
        },
        state:{
            get:function(){
                return this._state;
            },
            set:function(value){
                if(value != this._state){
                    this._state = value ;
                    switch(this._state){
                        case STATE.CLICKED:
                            this.showType() ;
                            break ;
                        case STATE.DOUBT:
                            this.getComponent(cc.Sprite).spriteFrame = this.picDoubt ;
                            break ;
                        case STATE.FLAG:
                            this.getComponent(cc.Sprite).spriteFrame = this.picFlag ;
                            break ;
                        case STATE.NONE:
                            this.getComponent(cc.Sprite).spriteFrame = this.picNone ;
                            break ;
                    }
                }
            },
            type:STATE
        },
        type:{
            default:TYPE.ZERO ,
            type:TYPE
        }
    },

    showType:function(){
        switch(this.type){
            case TYPE.ZERO:
                this.getComponent(cc.Sprite).spriteFrame = this.picZero ;
                break ;
            case TYPE.ONE:
                this.getComponent(cc.Sprite).spriteFrame = this.picOne ;
                break ;
            case TYPE.TWO:
                this.getComponent(cc.Sprite).spriteFrame = this.picTwo ;
                break ;
            case TYPE.THREE:
                this.getComponent(cc.Sprite).spriteFrame = this.picThree ;
                break ;
            case TYPE.FOUR:
                this.getComponent(cc.Sprite).spriteFrame = this.picFour ;
                break ;
            case TYPE.FIVE:
                this.getComponent(cc.Sprite).spriteFrame = this.picFive ;
                break ;
            case TYPE.SIX:
                this.getComponent(cc.Sprite).spriteFrame = this.picSix ;
                break ;
            case TYPE.SEVEN:
                this.getComponent(cc.Sprite).spriteFrame = this.picSeven ;
                break ;
            case TYPE.EIGHT:
                this.getComponent(cc.Sprite).spriteFrame = this.picEight ;
                break ;
            case TYPE.BOMB:
                this.getComponent(cc.Sprite).spriteFrame = this.picBomb ;
                break ;
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
