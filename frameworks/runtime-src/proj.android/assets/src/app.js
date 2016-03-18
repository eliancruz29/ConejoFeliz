"use strict";

var zanahorias_init = 0;
var vidas_init = 5;

var ConejoFelizLayer = cc.Layer.extend({
    sprFondo: null,
    sprConejo: null,
    size: null,
    velocity: 300,
    floorPosition: null,
    right: null,
    left: null,
    bombas: null,
    zanahorias: null,
    flecha_right: null,
    flecha_left: null,
    
    random: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    stopGame: function(){
        var parent = this;
        parent.setConejoToStart();
        
        while(parent.zanahorias.length != 0){
            parent.removeZanahoria(parent.zanahorias[0], 0);
        }
        while(parent.bombas.length != 0){
            parent.removeBomba(parent.bombas[0], 0);
        }
    },
    
    setConejoToStart: function(){
        this.sprConejo.setPosition(this.size.width / 2, this.floorPosition+(this.sprConejo.height/2));
    },
    
    verifyCollision: function(){
        var parent = this.sprConejo.getParent();
        var conejo = parent.sprConejo.getBoundingBox();
        
        parent.bombas.forEach(function(item, index){
            var bom = item.getPosition();
            if(cc.rectContainsPoint(conejo, bom)){
                parent.getParent().getChildByName("layerLabels").numVidas--;
                parent.setConejoToStart();
                parent.removeBomba(item, index);
            } 
        });
        
        parent.zanahorias.forEach(function(item, index){
            var zan = item.getPosition();
            if(cc.rectContainsPoint(conejo, zan)){
                parent.getParent().getChildByName("layerLabels").numZanahorias++;
                parent.removeZanahoria(item, index);
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
    
    removeZanahoria: function(zanahoria, idx){
        var parent = zanahoria.getParent();
        if(idx == null || idx == undefined){
            idx = parent.zanahorias.indexOf(zanahoria);
        }
        parent.removeChild(zanahoria);
        parent.zanahorias.splice(idx, 1);
    },
    
    creaZanahoria: function(){
        var zanahoria = new cc.Sprite(res.zanahoria_png);
        this.zanahorias.push(zanahoria);
        
        var pos = {
            x_1:(this.sprFondo.getPositionX()-(this.sprFondo.width/2)),
            x_2:(this.sprFondo.getPositionX()+(this.sprFondo.width/2))
        }
        
        zanahoria.setPosition(this.random((pos.x_1+(zanahoria._getWidth()/2)),(pos.x_2-(zanahoria._getWidth()/2))), this.size.height );
        zanahoria.setScale(0.8, 0.8);
        
        this.addChild(zanahoria, 1);
        
		var moveto = cc.moveTo(this.random(1,5), cc.p(zanahoria.getPositionX(), this.size.height*(108/800)), this.size.height*(108/800));

        var finish = cc.callFunc(this.removeZanahoria, zanahoria);
            
        var seq = new cc.sequence(moveto, finish);
        
		zanahoria.runAction(seq); 
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
        
		var moveto = cc.moveTo(this.random(1,5), cc.p(bomba.getPositionX(), this.size.height*(108/800)), this.size.height*(108/800));
        
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
        
        if(cc.rectContainsPoint(target.flecha_right.getBoundingBox(), touch.getLocation())){
            diff = target.right - conejo.x;
            moveto = cc.moveTo(target.setVelocity(diff), cc.p(target.right, conejo.y), conejo.y);
            moveto.setTag(100);
            conejo.runAction(moveto);
        }
        else if (cc.rectContainsPoint(target.flecha_left.getBoundingBox(), touch.getLocation())){
            diff = conejo.x - target.left;
            moveto = cc.moveTo(target.setVelocity(diff), cc.p(target.left, conejo.y), conejo.y);
            moveto.setTag(100);
            conejo.runAction(moveto);
        }
    
        return true;
    },
    
    ctor: function () {
        this._super();
        //Obteniendo el tamaño de la pantalla
        this.size = cc.winSize;
        
        this.bombas = [];
        this.zanahorias = [];

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
        
        this.flecha_right = new cc.Sprite(res.flecha_png);
        
        this.flecha_right.setPosition(this.size.width-(this.flecha_right._getWidth()/2*0.2)-(this.size.width*0.0115), (this.floorPosition/2)-(this.size.width*0.0115));
        
        var fScale = 0.2;
        this.flecha_right.setScale(fScale, fScale);
        this.flecha_right.setRotation(180);
        this.addChild(this.flecha_right, 0);
        
        this.flecha_left = new cc.Sprite(res.flecha_png);
        this.flecha_left.setPosition((this.flecha_right._getWidth()/2*0.2)+(this.size.width*0.0115), (this.floorPosition/2)-(this.size.width*0.0115));
        
        this.flecha_left.setScale(fScale, fScale);
        this.addChild(this.flecha_left, 0);
        
        if(cc.sys.isNative){
            var v = 0.7, fScale = 0.2;
            this.flecha_right.setScale(fScale*v, fScale*v);
            this.flecha_left.setScale(fScale*v, fScale*v);
        }
        
        this.schedule(this.creaBombas, 1);
        this.schedule(this.creaZanahoria, 1);
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

var ConejoFeliz_Labels_Layer = cc.Layer.extend({
    sprFondo: null,
    sprZanahoria: null,
    size: null,
    zanahoria: null,
    numZanahorias: zanahorias_init,
    numVidas: vidas_init,
    lblNumber: null,
    lblVidas: null,
    
    updateZanahorias: function(){
        this.lblNumber.setString(this.numZanahorias);
    },
    
    updateVidas: function(){
        this.lblVidas.setString(this.numVidas);
        if(this.numVidas == 0){    
            this.stopGame();
        }
    },
    
    starGame: function(){
        var confirmation = confirm("Star Game?");
        if(confirmation){
            this.numVidas = vidas_init;
            this.numZanahorias = zanahorias_init;
            this.getParent().resume();
        }
    },
    
    stopGame: function(){
        var ConejoFelizLayer = this.getParent().getChildByName("layer");
        ConejoFelizLayer.stopGame();
        this.getParent().pause();
        this.starGame();
    },
    
    ctor: function () {
        this._super();
        //Obteniendo el tamaño de la pantalla
        this.size = cc.winSize;
        
        var _floorPosition = this.size.height*(108/800);
        
        //posicionando la imagen de fondo
        this.sprZanahoria = new cc.Sprite(res.zanahoria_png);
        this.sprZanahoria.setPosition((this.size.width / 2)-(this.size.width*0.18), (_floorPosition/2));
        this.sprZanahoria.setTag(2001);
        this.sprZanahoria.setScale(0.7, 0.7);
        this.addChild(this.sprZanahoria, 0);
        
        this.lblNumber = new cc.LabelTTF(this.numZanahorias, "Arial", 40);
        this.lblNumber.setPosition(this.sprZanahoria.getPositionX()+(this.size.width*0.06), this.sprZanahoria.getPositionY()-(this.size.width*0.0115));
        this.addChild(this.lblNumber, 0);
        
        var vidas = new cc.LabelTTF("Vidas:", "Arial", 40);
        vidas.setPosition((this.size.width / 2)+(this.size.width*0.08), (_floorPosition/2)-(this.size.width*0.011));
        this.addChild(vidas, 0);
        
        this.lblVidas = new cc.LabelTTF(this.numVidas, "Arial", 40);
        this.lblVidas.setPosition(vidas.getPositionX()+(this.size.width*0.11), vidas.getPositionY());
        this.addChild(this.lblVidas, 0);
        
        if(cc.sys.isNative){
            var v = 0.7;
            vidas.setScale(v, v);
            this.sprZanahoria.setScale(v, v);
            this.lblNumber.setScale(v, v);
            this.lblVidas.setScale(v, v);
        }
        
        this.schedule(this.updateZanahorias, 10/60);
        this.schedule(this.updateVidas, 10/60);
        
        return true;
    }
});

var ConejoFelizScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new ConejoFelizLayer();
        layer.setName("layer");
        this.addChild(layer, 0);
        
        var layerLabels = new ConejoFeliz_Labels_Layer();
        layerLabels.setName("layerLabels");
        this.addChild(layerLabels, 1);
    }
});