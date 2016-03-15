
var ConejoFelizLayer = cc.Layer.extend({
    sprFondo: null,
    sprConejo: null,
    size: null,
    actionConejo: null,
    velocity: 250,
    floorPosition: null,
    
    random: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    creaBombas: function(){
		
		var bomba = new cc.Sprite(res.bomba_png);
        var pos = {
            x_1:(this.sprFondo.getPositionX()-(this.sprFondo.width/2)),
            x_2:(this.sprFondo.getPositionX()+(this.sprFondo.width/2))
        }
        bomba.setPosition(this.random((pos.x_1+(bomba._getWidth()/2)),(pos.x_2-(bomba._getWidth()/2))), this.size.height );
        this.addChild(bomba, 1);
		var moveto = cc.moveTo(this.random(3,7), bomba.getPositionX(), this.floorPosition);
		bomba.runAction(moveto);
		
	},
    
    setVelocity: function(pos){
        pos = Math.abs(pos);
        return pos/this.velocity;
    },
    
    moveConejo: function (touch, event) {
        var target = event.getCurrentTarget();
        var posInScreen = touch.getLocation();
        var fondo = target.sprFondo.getBoundingBox();
        var conejo = target.sprConejo;
        
        if(cc.rectContainsPoint(fondo, posInScreen)){
            //cc.log((target.actionConejo === null));
            
            if(target.actionConejo){
                target.actionConejo.stop();
            }
                
            var pos = posInScreen.x;

            if((pos-fondo.x) < (conejo._getWidth()/2))
                pos = fondo.x + conejo._getWidth()/2;
            else if( ((fondo.x+fondo.width) - pos) < (conejo._getWidth()/2))
                pos = fondo.x + fondo.width - conejo._getWidth()/2;
                
            var diff = pos-conejo.x;
            var moveto = cc.moveTo(target.setVelocity(diff), pos, conejo.y);
            target.actionConejo = conejo.runAction(moveto);
        }
        
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
        
        //posicionando la imagen de fondo
        this.sprConejo = new cc.Sprite(res.conejo_png);
        this.sprConejo.setPosition(this.size.width / 2, this.size.height * 0.15);
        this.addChild(this.sprConejo, 1);
        
        this.floorPosition = this.size.height*0.09;
        
        this.schedule(this.creaBombas, 3);

        //Agregando eventos
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: this.moveConejo
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