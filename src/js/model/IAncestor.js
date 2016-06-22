define([],function() {

    function IAncestor(lane) {
      this.hp = 2;
      this.speed = 10;
      this.lane = lane;
      this.animation;
      this.xCoord = 500;
      this.yCoord = 300;
    }

    IAncestor.prototype = {
        hp: this.hp,
        speed: this.speed,
        lane: this.lane,
        animation: this.animation,
        xCoord: this.xCoord,
        yCoord: this.yCoord
    };

    return IAncestor;

});