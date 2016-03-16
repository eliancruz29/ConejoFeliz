
var ConejoFelizLayer = cc.Layer.extend({
    sprFondo: null,
    sprConejo: null,
    size: null,
    velocity: 250,
    floorPosition: null,
    
    random: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    verifyCollision: function(bomba){
        var conejo = bomba.getParent().getChildByTag(1001).getBoundingBox();
        var _bomba = bomba.getBoundingBox();
        var parent = bomba.getParent();
        
        if ( cc.rectContainsPoint(conejo, _bomba) ) {
            console.log("Colision");
            parent.removeBomba(bomba);
        }else if(bomba.getParent().random(0,1) == "1"){
            parent.removeBomba(bomba);
        }
    },
    
    removeBomba: function(bomba){
        bomba.getParent().removeChild(bomba);
    },
    
    creaBombas: function(){
		
		var bomba = new cc.Sprite(res.bomba_png);
        
        var pos = {
            x_1:(this.sprFondo.getPositionX()-(this.sprFondo.width/2)),
            x_2:(this.sprFondo.getPositionX()+(this.sprFondo.width/2))
        }
        
        bomba.setPosition(this.random((pos.x_1+(bomba._getWidth()/2)),(pos.x_2-(bomba._getWidth()/2))), this.size.height );
        this.addChild(bomba, 1);
        
        var speed = this.random(2,7);
        var positionConejo = (this.sprConejo.getPositionY()+this.sprConejo._getWidth());
		var moveto = cc.moveTo(speed, bomba.getPositionX(), positionConejo);
        var _moveto = cc.moveTo((speed*((positionConejo-this.floorPosition)/(this.size.height-positionConejo))), bomba.getPositionX(), this.floorPosition);
        
        var verify = cc.callFunc(this.verifyCollision, bomba);
        
        var finish = cc.callFunc(this.removeBomba, bomba);
            
        var seq = new cc.sequence(moveto, verify, _moveto, finish);
        
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
        var pos = touch.getLocation().x;

        if((pos-fondo.x) < (conejo._getWidth()/2))
            pos = fondo.x + conejo._getWidth()/2;
        else if( ((fondo.x+fondo.width) - pos) < (conejo._getWidth()/2))
            pos = fondo.x + fondo.width - conejo._getWidth()/2;
                
        var diff = pos-conejo.x;
        var moveto = cc.moveTo(target.setVelocity(diff), pos, conejo.y);
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
        
        var sclPropFondo = {
            _width: (this.size.width/this.sprFondo._getWidth()),
            _height: (this.size.height/this.sprFondo._getHeight())
        }
        
        this.sprFondo.setScale(sclPropFondo._width, sclPropFondo._height);
        
        this.floorPosition = this.size.height*(110/800)*sclPropFondo._height;
        
        //posicionando la imagen de fondo
        this.sprConejo = new cc.Sprite(res.conejo_png);
        this.sprConejo.setPosition(this.size.width / 2, 200);
        this.sprConejo.setTag(1001);
        this.addChild(this.sprConejo, 1);
        
        this.schedule(this.creaBombas, 1);

        // check if the device ou are using is capable of touch
        /*if ( cc.sys.capabilities.hasOwnProperty( 'touches' ) ){
            
        }*/
        
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