

const GAME_STATE = cc.Enum({
    PREPARE:-1,
    PLAY:-1,
    DEAD:-1,
    WIN:-1
});

const TOUCH_STATE = cc.Enum({
    BLANK:-1,
    FLAG:-1
});

cc.Class({
    extends: cc.Component,

    properties: {
        tilesLayout:cc.Node,
        tile:cc.Prefab,
        btnShow:cc.Node,
        tiles:[] ,
        picPrepare:cc.SpriteFrame ,
        picPlay:cc.SpriteFrame,
        picDead:cc.SpriteFrame,
        picWin:cc.SpriteFrame,
        gameState:{
            default:GAME_STATE.PREPARE,
            type:GAME_STATE
        },
        touchState:{
            default:TOUCH_STATE.BLANK,
            type:TOUCH_STATE
        },
        row:0,
        col:0,
        bombNum:0
    },

    // use this for initialization
    onLoad: function () {
        this.Tile = require('STile');
        let self = this ;

        for(let y = 0 ; y< this.row ; y++){
            for(let x = 0 ; x< this.col ; x++){
                let tile = cc.instantiate(this.tile) ;
                tile.tag = y*this.col + x ;
                tile.on(cc.Node.EventType.MOUSE_UP ,function(event){
                    var clickBtn = event.getButton() ;
                    if(clickBtn == 0){  // 点击鼠标左键
                        self.touchState = TOUCH_STATE.BLANK ;
                    }else if(clickBtn == 2){  // 点击鼠标右键
                        self.touchState = TOUCH_STATE.FLAG ;
                    }
                    self.onTouchTile(tile) ;
                }) ;
                this.tilesLayout.addChild(tile) ;
                this.tiles.push(tile) ;
            }
        }
        this.newGame() ;
    },

    newGame:function(){
        // 初始化游戏场景
        for(let n=0 ;n< this.tiles.length ; n++){
            let tmp = this.tiles[n].getComponent('STile') ;
            tmp.type = this.Tile.TYPE.ZERO ;
            tmp.state = this.Tile.STATE.NONE ;
        }
        // 初始化地雷
        var tilesIndex = [] ;
        for(var i=0 ;i<this.tiles.length ;i++){
            tilesIndex[i] = i ;
        }
        for(var j=0 ;j<this.bombNum ; j++){
            var n = Math.floor(Math.random()*tilesIndex.length) ;
            this.tiles[tilesIndex[n]].getComponent('STile').type = this.Tile.TYPE.BOMB ;
            tilesIndex.splice(n ,1) ;
        }
        // 标记地雷周围的方块
        for(var k=0 ;k<this.tiles.length ;k++){
            var tmpBomb = 0 ;
            if(this.tiles[k].getComponent('STile').type == this.Tile.TYPE.ZERO){
                var roundTiles = this.tileRound(k) ;
                for(var m= 0 ; m< roundTiles.length ;m++){
                    if(roundTiles[m].getComponent('STile').type == this.Tile.TYPE.BOMB){
                        tmpBomb++ ;
                    }
                }
                this.tiles[k].getComponent('STile').type = tmpBomb ;
            }
        }
        this.gameState = GAME_STATE.PLAY ;
        this.btnShow.getComponent(cc.Sprite).spriteFrame = this.picPlay ;
    },

    onTouchTile:function(touchTile){
        if(this.gameState != GAME_STATE.PLAY){
            return;
        }
        switch(this.touchState){
            case TOUCH_STATE.BLANK:
                if(touchTile.getComponent("STile").type == 9){
                    touchTile.getComponent("STile").state = this.Tile.STATE.CLICKED;
                    this.gameOver();
                    return;
                }
                var testTiles = [];
                if(touchTile.getComponent("STile").state === this.Tile.STATE.NONE){
                    testTiles.push(touchTile);
                    while(testTiles.length){
                        var testTile = testTiles.pop();
                        if(testTile.getComponent("STile").type === 0){
                            testTile.getComponent("STile").state = this.Tile.STATE.CLICKED;
                            var roundTiles = this.tileRound(testTile.tag);
                            for(var i=0;i<roundTiles.length;i++){
                                if(roundTiles[i].getComponent("STile").state == this.Tile.STATE.NONE){
                                    testTiles.push(roundTiles[i]);
                                }
                            }
                        }else if(testTile.getComponent("STile").type > 0 && testTile.getComponent("STile").type < 9){
                            testTile.getComponent("STile").state = this.Tile.STATE.CLICKED;
                        }
                    }
                    this.judgeWin();
                }

                break;
            case TOUCH_STATE.FLAG:
                if(touchTile.getComponent("STile").state == this.Tile.STATE.NONE){
                    touchTile.getComponent("STile").state = this.Tile.STATE.FLAG;
                }else if(touchTile.getComponent("STile").state == this.Tile.STATE.FLAG){
                    touchTile.getComponent("STile").state = this.Tile.STATE.NONE;
                }
                break;
        }
    },

    tileRound:function(i){
        var roundTiles = [];
        if(i%this.col > 0){//left
            roundTiles.push(this.tiles[i-1]);
        }
        if(i%this.col > 0 && Math.floor(i/this.col) > 0){//left bottom
            roundTiles.push(this.tiles[i-this.col-1]);   
        }
        if(i%this.col > 0 && Math.floor(i/this.col) < this.row-1){//left top
            roundTiles.push(this.tiles[i+this.col-1]);
        }
        if(Math.floor(i/this.col) > 0){//bottom
            roundTiles.push(this.tiles[i-this.col]);
        }
        if(Math.floor(i/this.col) < this.row-1){//top
            roundTiles.push(this.tiles[i+this.col]);
        }
        if(i%this.col < this.col-1){//right
            roundTiles.push(this.tiles[i+1]);
        }
        if(i%this.col < this.col-1 && Math.floor(i/this.col) > 0){//rihgt bottom
            roundTiles.push(this.tiles[i-this.col+1]);
        }
        if(i%this.col < this.col-1 && Math.floor(i/this.col) < this.row-1){//right top
            roundTiles.push(this.tiles[i+this.col+1]);
        }
        return roundTiles;
    },

    judgeWin:function(){
        var confNum = 0;
        //判断是否胜利
        for(let i=0;i<this.tiles.length;i++){
            if(this.tiles[i].getComponent('STile').state === this.Tile.STATE.CLICKED){
                confNum++;
            }
        }
        if(confNum === this.tiles.length-this.bombNum){
            this.gameState = GAME_STATE.WIN;
            this.btnShow.getComponent(cc.Sprite).spriteFrame = this.picWin;
        }
    },

    gameOver:function(){
        this.gameState = GAME_STATE.DEAD;
        this.btnShow.getComponent(cc.Sprite).spriteFrame = this.picDead;
    },

    onBtnShow:function(){
        if(this.gameState === GAME_STATE.PREPARE){
            this.newGame();
        }
        if(this.gameState === GAME_STATE.DEAD){
            // this.bombNum--;
            this.newGame();
        }
        if(this.gameState === GAME_STATE.WIN){
            // this.bombNum++;
            this.newGame();
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
