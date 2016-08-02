define(),function() {

    function IIndexer() {
        this.type = "standard";
        this.slowAmount = 30;
        this.slowRadius = 150;
    }


    IIndexer.prototype.update = function(activeAncestors, timeElapsed, activeProjectiles, levelStructure)
    {
        this.checkShootProjectile(timeElapsed, levelStructure, activeProjectiles);
    };

    IIndexer.prototype.checkShootProjectile = function(timeElapsed, levelStructure, activeProjectiles)
    {
        this.throwTimer += timeElapsed;
        if (this.throwTimer > this.throwDelay) {
            this.throwTimer = 0;
            var tempProjectile = this.getProjectile(levelStructure.length);
            tempProjectile.timeRemaining = 10; // 10 second timeout
            activeProjectiles.push(tempProjectile);
        }
    };

    IIndexer.prototype.getProjectile = function(numGenerations){
        var self = this;

        var canShootUpLeft = true;
        var canShootUpRight = true;
        var canShootDownLeft = true;
        var canShootDownRight = true;

        if (this.yNode == 0) {
          canShootUpLeft = false;
        }
        if (this.yNode == this.xNode)
        {
          canShootDownLeft = false;
        }
        if (this.xNode == numGenerations)
        {
          canShootUpRight = false;
          canShootDownRight = false;
        }
        if (this.xNode == 0)
        {
          canShootUpLeft = false;
          canShootDownLeft = false;
        }
        if (this.xNode == numGenerations && this.yNode == numGenerations)
        {
          canShootDownLeft = false;
          canShootUpRight = false;
          canShootDownRight = false;
        }
        if (this.xNode == numGenerations && this.yNode == 0)
        {
          canShootUpRight = false;
          canShootDownRight = false;
          canShootUpLeft = false;
        }
        console.log("canShootDownLeft", canShootDownLeft);
        console.log("the x node: ", this.xNode);
        console.log("the y node: ", this.yNode);
        console.log("the number of genearations: ", numGenerations);
            switch(this.projectileOrientation)
            {
              case "upRight":
                if (canShootDownRight){
                  this.projectileOrientation = "downRight";
                }
                else if (canShootDownLeft){
                  this.projectileOrientation = "downLeft";
                }
                else if (canShootUpLeft){
                  this.projectileOrientation = "upLeft";
                }
                break;
              case "downRight":
                if (canShootDownLeft){
                  this.projectileOrientation = "downLeft";
                }
                else if (canShootUpLeft){
                  this.projectileOrientation = "upLeft";
                }
                else if (canShootUpRight){
                  this.projectileOrientation = "upRight";
                }
                break;
              case "downLeft":
                if (canShootUpLeft){
                  this.projectileOrientation = "upLeft";
                }
                else if (canShootUpRight){
                  this.projectileOrientation = "upRight";
                }
                else if (canShootDownRight){
                  this.projectileOrientation = "downRight";
                }
                break;
              case "upLeft":
                if (canShootUpRight)
                {
                  this.projectileOrientation = "upRight";
                }
                else if (canShootDownRight){
                  this.projectileOrientation = "downRight";
                }
                else if (canShootDownLeft){
                  this.projectileOrientation = "downLeft";
                }
                break;
            }
        var projectile = new Projectile();
        projectile.xCoord = this.xCoord + 5;
        projectile.yCoord = this.yCoord + 20;
        projectile.dmg = this.dmg;
        projectile.orientation = this.projectileOrientation;
        return projectile;
    };

    return IIndexer;

});
