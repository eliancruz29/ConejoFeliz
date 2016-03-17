"use strict";

var ConejoFelizLayer = cc.Layer.extend({
    sprFondo: null,
    sprConejo: null,
    size: null,
    velocity: 250,
    floorPosition: null,
    right: null,
    left: null,
    bombas: [],
    
    random: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    verifyCollision: function(){
        var parent = this.sprConejo.getParent();
        var conejo = parent.sprConejo.getBoundingBox();
        
        parent.bombas.forEach(function(item, index){
            var bom = item.getPosition();
            if(cc.rectContainsPoint(conejo, bom)){
                parent.removeBomba(item, index);
            } 
        });
    },
    
    removeBomba: function(bomba, idx){
        var parent = bomba.getParent();
        if(idx == null || idx == undefined){
            idx = parent.bombas.indexOf(bomba);
        }
        parent.removeChild(bomba);
        parent.bombas.splice(idx, 1);
    },
    
    creaBombas: function(){
		
		var bomba = new cc.Sprite(res.bomba_png);
        this.bombas.push(bomba);
        
        var pos = {
            x_1:(this.sprFondo.getPositionX()-(this.sprFondo.width/2)),
            x_2:(this.sprFondo.getPositionX()+(this.sprFondo.width/2))
        }
        
        bomba.setPosition(this.random((pos.x_1+(bomba._getWidth()/2)),(pos.x_2-(bomba._getWidth()/2))), this.size.height );
        this.addChild(bomba, 1);
        
		var moveto = cc.moveTo(this.random(2,7), cc.p(bomba.getPositionX(), this.floorPosition), this.floorPosition);
        
        var finish = cc.callFunc(this.removeBomba, bomba);
            
        var seq = new cc.sequence(moveto, finish);
        
		bomba.runAction(seq);        
	},
    
    setVelocity: function(pos){
        pos = Math.abs(pos);
        return pos/this.velocity;
    },
    
    moveConejo: function (touch, event) {
        var target = event.getCurrentTarget();
        var fondo = target.sprFondo.getBoundingBox();
        var conejo = target.sprConejo;
        var diff;
        var moveto;
        
        if(touch.getLocation().x >= (target.size.width/2)){
            diff = target.right - conejo.x;
            moveto = cc.moveTo(target.setVelocity(diff), cc.p(target.right, conejo.y), conejo.y);
        }
        else{
            diff = conejo.x - target.left;
            moveto = cc.moveTo(target.setVelocity(diff), cc.p(target.left, conejo.y), conejo.y);
        }
        
        moveto.setTag(100);
        conejo.runAction(moveto);
    
        return true;
    },
    
    ctor: function () {
        this._super();
        //Obteniendo el tamaño de la pantalla
        this.size = cc.winSize;

        //posicionando la imagen de fondo
        this.sprFondo = new cc.Sprite(res.fondo_png);
        this.sprFondo.setPosition(this.size.width / 2, this.size.height / 2);
        this.addChild(this.sprFondo, 0);
        
        this.floorPosition = this.size.height*(108/800);
        
        var sclPropFondo = {
            _width: (this.size.width/this.sprFondo._getWidth()),
            _height: (this.size.height/this.sprFondo._getHeight())
        }
        
        this.sprFondo.setScale(sclPropFondo._width, sclPropFondo._height);
        
        //posicionando la imagen de fondo
        this.sprConejo = new cc.Sprite(res.conejo_png);
        this.sprConejo.setPosition(this.size.width / 2, this.floorPosition+(this.sprConejo.height/2));
        this.sprConejo.setTag(1001);
        this.addChild(this.sprConejo, 1);
        
        this.right = this.size.width - (this.sprConejo.width/2);
        this.left = this.sprConejo.width/2;
        
        this.schedule(this.creaBombas, 1);
        this.schedule(this.verifyCollision, 1/60);
        
        //Agregando eventos
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: this.moveConejo,
            
            onTouchEnded: function(touch, event){
                var target = event.getCurrentTarget();
                var conejo = target.sprConejo;
                conejo.stopActionByTag(100);
            },
		}, this);

        return true;
    }
});

var ConejoFelizScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new ConejoFelizLayer();
        this.addChild(layer);
    }
});