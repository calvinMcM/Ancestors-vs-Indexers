define(['IAncestor'],function() {


    function Render()
    {
      this.canvas = $("#canvas").get(0);
      this.ctx = this.canvas.getContext("2d");

      this.bgReady = false;
      this.bgImage = new Image();
      var self = this
      this.bgImage.onload = function () {
      	self.bgReady = true;
      };
      this.bgImage.src = "src/img/background.png";

      this.indexerImgReady = false;
      this.indexerImg = new Image();
      this.indexerImg.onload = function() {
        self.indexerImgReady = true;
      }
      this.indexerImg.src = "src/img/ancestor.png";

      this.recordImgReady = false;
      this.recordImg = new Image();
      this.recordImg.onload = function() {
        self.recordImgReady = true;
      }
      this.recordImg.src = "src/img/record.png";
    }


    Render.prototype.renderBackground = function()
    {
        if (this.bgReady)
        {
          this.ctx.drawImage(this.bgImage, 0, 0, this.bgImage.width, this.bgImage.height, 0, 0, canvas.width, canvas.height);
        }
    };

    Render.prototype.renderAncestors = function(activeAncestors)
    {
      var self = this;
        if (this.indexerImgReady)
        {
          for (var i = 0; i < activeAncestors.length; i++)
          {
            this.ctx.drawImage(this.indexerImg, 600, 0);
          }
        }
    };

    Render.prototype.renderIndexers = function(activeIndexers)
    {

    };

    Render.prototype.renderBuildings = function(activeBuildings)
    {

    };

    Render.prototype.render = function(activeAncestors, activeIndexers, activeBuildings)
    {
      this.renderBackground();
      this.renderAncestors(activeAncestors);
      this.renderIndexers(activeIndexers);
      this.renderBuildings(activeBuildings);
    };


    return Render;

});