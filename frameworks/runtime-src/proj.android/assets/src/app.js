
var HelloWorldLayer = cc.Layer.extend({
    sprFondo: null,
    sprConejo: null,
    actionConejo: null,
    velocity: 250,
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
            
            if(!target.actionConejo || target.actionConejo.isDone()){
                
                var pos = posInScreen.x;

                if((pos-fondo.x) < (conejo._getWidth()/2))
                    pos = fondo.x + conejo._getWidth()/2;
                else if( ((fondo.x+fondo.width) - pos) < (conejo._getWidth()/2))
                    pos = fondo.x + fondo.width - conejo._getWidth()/2;
                
                var diff = pos-conejo.x;
                var moveto = cc.moveTo(target.setVelocity(diff), pos, conejo.y);
                target.actionConejo = conejo.runAction(moveto);
                
            }
        }
        return false;
    },
    ctor: function () {
        this._super();
        //Obteniendo el tamaño de la pantalla
        var size = cc.winSize;

        //posicionando la imagen de fondo
        this.sprFondo = new cc.Sprite(res.fondo_png);
        this.sprFondo.setPosition(size.width / 2, size.height / 2);
        this.addChild(this.sprFondo, 0);
        
        //posicionando la imagen de fondo
        this.sprConejo = new cc.Sprite(res.conejo_png);
        this.sprConejo.setPosition(size.width / 2, size.height * 0.15);
        this.addChild(this.sprConejo, 1);

        //Agregando eventos
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: this.moveConejo
		}, this);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});