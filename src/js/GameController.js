define(['jquery','LevelDefinition', 'ClickManager', 'Update', 'Render', 'model/IAncestor', 'VictoryDefeatHandler', 'ImageManager'],
  function($,LevelDefinition, ClickManager, Update, Render, IAncestor, VictoryDefeatHandler, ImageManager) {

      function GameController(canvas) {
          this.canvas = canvas;
          this.myUpdate = new Update();
          this.myRender;
          this.translation = {dx: 0, dy: 0};
          this.myVictoryDefeatHandler = new VictoryDefeatHandler();

          this.resourcePoints = 200;

          this.timeElapsed = 0;

          this.lastTime;
          this.playerInfo;
          this.level = [];

          this.activeAncestors = [];
          this.activeIndexers = [];
          this.activeBuildings = [];
          this.activeRecords = [];
          this.activeProjectiles = [];

          this.gameBoardGrid = {};

          this.gameEnded = false;
          this.victory;
      }


      GameController.prototype.loadResources = function () {
          var self = this;
          return new Promise(function (resolve, reject) {
              ImageManager.launch().then(function (response) {
                      self.myRender = new Render(canvas, ImageManager);
                      resolve(response);
                  },
                  function (e) {
                      console.log("The ImageManager was not able to load correctly. Response:", e);
                      self.myRender = new Render(canvas, ImageManager);
                      reject(e);
                  });
          });
      };

      GameController.prototype.initializeGame = function (level, playerInfo) {
          this.myUpdate = new Update();
          for (var i = 0; i < 9; i++) {
              this.gameBoardGrid[i] = [];
              for (var j = 0; j < 5; j++) {
                  this.gameBoardGrid[i][j] = 0;
              }
          }
          console.log(this.gameBoardGrid);
          this.currentLevel = level;
          this.resourcePoints = 200;

          this.timeElapsed = 0;

          this.lastTime;
          this.playerInfo;
          this.level = [];

          this.activeAncestors = [];
          this.activeIndexers = [];
          this.activeBuildings = [];
          this.activeRecords = [];
          this.activeProjectiles = [];

          this.gameEnded = false;
          this.victory = null;
          this.playerInfo = playerInfo;

          var levelDefinition = new LevelDefinition();

          this.level = levelDefinition.getLevel(level); // Wave information location
          this.lastTime = Date.now();
          this.clickManager = new ClickManager(this);
          this.clickManager.start();
      };

      GameController.prototype.updateCoordinates = function(dx, dy){
          this.translation = {dx: dx, dy: dy};
          //console.log("Coordinates updated to:",this.translation);
      };

      GameController.prototype.loop = function () {
          //console.log("running loop");
          var now = Date.now();
          var delta_s = (now - this.lastTime) / 1000; // obtain time elapsed since last check and convert to seconds
          this.lastTime = now;
          this.timeElapsed += delta_s;

          this.myUpdate.update(this.activeAncestors, this.activeIndexers, this.activeProjectiles, this.activeRecords, this.activeBuildings, delta_s, this.level, this, this.translation);
          this.myRender.render(this.activeAncestors, this.activeIndexers, this.activeProjectiles, this.activeRecords, this.activeBuildings, this.canvas, this.translation);
          this.updateCoordinates(0, 0);
          if (!this.gameEnded) // game end condition.
          {
              requestAnimationFrame(this.loop.bind(this));
          }
          else {
              this.clickManager.stop();
              if (this.victory) {
                  this.myVictoryDefeatHandler.victory(this.myRender, this);
              }
              else {
                  this.myVictoryDefeatHandler.defeat(this.myRender, this);
              }
          }
      };

      return GameController;

  });
