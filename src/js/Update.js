define(['model/IAncestor'],function() {


    function Update() {
        this.levelStartBuffer = 0;

        this.wave = 0;
        this.timer = 0;
        this.secondsBetweenWaves = 5;
        this.spawnRecordTimer = 0;
        this.timeToNextRecordSpawn = 0;
        this.projectileSpeed = 80;

        this.doneSpawning = false;
        this.ancestorsDefeated = false;
    }

    Update.prototype.checkVictory = function (controller, activeAncestors) {
        //did you beat the level?
        if (this.doneSpawning && activeAncestors.length == 0) {
            controller.victory = true;
            controller.gameEnded = true;
        }
    };

    Update.prototype.checkDefeat = function (controller, activeAncestors) {
        for (var i = 0; i < activeAncestors.length; i++) {
            if (activeAncestors[i].xCoord <= 0) {
                controller.victory = false;
                controller.gameEnded = true;
            }
        }
    };

    //check if record ready to spawn
    Update.prototype.spawnRecord = function (activeRecords, timeElapsed) {

        this.spawnRecordTimer += timeElapsed;
        if (this.spawnRecordTimer > this.timeToNextRecordSpawn) {
            var collectableRecord = {
                xCoord: Math.random() * 900,
                yCoord: -100,
                speed: 20,
                includesPoint: function (pt) {
                    return ((pt.X >= this.xCoord && pt.X <= this.xCoord + 100)
                    && (pt.Y >= this.yCoord && pt.Y <= this.yCoord + 100));
                }
            };

            activeRecords.push(collectableRecord);

            //reset spawn timer
            this.spawnRecordTimer = 0;
            //time to next spawn is 5-11 seconds
            this.timeToNextRecordSpawn = Math.random() * 4 + 3;
        }
    };

    Update.prototype.moveRecords = function (activeRecords, timeElapsed, translation) {
        for (var i = 0; i < activeRecords.length; i++) {
            activeRecords[i].yCoord += timeElapsed * activeRecords[i].speed;
        }
    };

    Update.prototype.moveProjectiles = function (activeProjectiles, timeElapsed, translation) {
        for (var i = 0; i < activeProjectiles.length; i++) {
            if (activeProjectiles[i].orientation == "upRight")
            {
                activeProjectiles[i].xCoord += timeElapsed * this.projectileSpeed;
                activeProjectiles[i].yCoord += timeElapsed * this.projectileSpeed/2;
            }
            else if (activeProjectiles[i].orientation == "downRight")
            {
                activeProjectiles[i].xCoord += timeElapsed * this.projectileSpeed;
                activeProjectiles[i].yCoord -= timeElapsed * this.projectileSpeed/2;
            }
            else if (activeProjectiles[i].orientation == "upLeft")
            {
                activeProjectiles[i].xCoord -= timeElapsed * this.projectileSpeed;
                activeProjectiles[i].yCoord += timeElapsed * this.projectileSpeed/2;
            }
            else if (activeProjectiles[i].orientation == "downLeft")
            {
                activeProjectiles[i].xCoord -= timeElapsed * this.projectileSpeed;
                activeProjectiles[i].yCoord -= timeElapsed * this.projectileSpeed/2;
            }
        }
    };

    Update.prototype.checkShootProjectile = function (activeIndexers, activeAncestors, activeProjectiles, timeElapsed) {

        for (var i = 0; i < activeIndexers.length; i++) {

                activeIndexers[i].throwTimer += timeElapsed;
                if (activeIndexers[i].throwTimer > activeIndexers[i].throwDelay) {
                    activeIndexers[i].throwTimer = 0;
                    var tempProjectile = activeIndexers[i].getProjectile();
                    activeProjectiles.push(tempProjectile);
                }
        }
    };

    Update.prototype.checkProjectileCollision = function (activeProjectiles, activeAncestors) {
        for (var i = 0; i < activeProjectiles.length; i++) {
            var keepChecking = true;
            for (var j = 0; j < activeAncestors.length; j++) {
                //check if collision has occured
                if (keepChecking && (activeProjectiles[i].xCoord + 14) >= activeAncestors[j].xCoord
                    && activeProjectiles[i].lane == activeAncestors[j].lane && activeProjectiles[i].xCoord < (activeAncestors[j].xCoord + 40)) {
                    //deal damage
                    activeAncestors[j].hp -= activeProjectiles[i].dmg;
                    //remove projectile from gameOver
                    activeProjectiles.splice(i, 1);
                    i--;
                    keepChecking = false;
                }
            }
        }
    };

    Update.prototype.checkDeadAncestors = function (activeAncestors) {
        for (var i = 0; i < activeAncestors.length; i++) {
            if (activeAncestors[i].hp <= 0) {
                activeAncestors.splice(i, 1);
                i--;
            }
        }
    };

    Update.prototype.checkAncestorSpawnTimes = function (level, activeAncestors, timeElapsed) {
        this.timer += timeElapsed;
        if (this.timer > this.secondsBetweenWaves) {
            this.wave++;
            this.timer = 0;
        }
        if (level[this.wave] != null) {
            for (var i = 0; i < level[this.wave].length; i++) {
                activeAncestors.push(level[this.wave][i]);
            }
            level[this.wave] = [];
        }
        if (!this.doneSpawning) {

            if (this.wave > level.length) {
                this.doneSpawning = true;
                console.log("done spawning");
            }
        }
    };

    Update.prototype.updateAncestorsPosition = function (activeAncestors, modifier, translation) {
        for (var i = 0; i < activeAncestors.length; i++) {
            //check whether to move up or down
            if (activeAncestors[i].distanceMovedX >= 300)
            {
                console.log("current generation: " + activeAncestors[i].currentGeneration);
                var numNodes = activeAncestors[i].currentGeneration + 1;
                var firstNodeY = - activeAncestors[i].currentGeneration * 150 + 300;
                //check if moving up is impossible
                if (Math.abs(firstNodeY - activeAncestors[i].yCoord) < 150)
                {
                  console.log("had to go down");
                     activeAncestors[i].upOrDown = "up";
                }
                //check if moving down is impossible
                else if (((firstNodeY + (numNodes - 1) * 300) - activeAncestors[i].yCoord) < 150)
                {
                  console.log("had to go up");

                      activeAncestors[i].upOrDown = "down";
                }
                else
                {
                    var random = Math.random();
                    if (random > 0.5)
                    {
                        activeAncestors[i].upOrDown = "up";
                    }
                    else
                    {
                        activeAncestors[i].upOrDown = "down";
                    }
                }
                activeAncestors[i].distanceMovedX = 0;
                activeAncestors[i].currentGeneration--;
            }
            //move ancestor diagonally according to speed
            activeAncestors[i].distanceMovedX += modifier * activeAncestors[i].speed;
            activeAncestors[i].xCoord -= modifier * activeAncestors[i].speed;
            if (activeAncestors[i].upOrDown == "up")
            {
                activeAncestors[i].yCoord += modifier * activeAncestors[i].speed / 2;
            }
            else if (activeAncestors[i].upOrDown == "down")
            {
                activeAncestors[i].yCoord -= modifier * activeAncestors[i].speed / 2;
            }

        }
    };


    Update.prototype.spawnRecordsFromBuildings = function (activeBuildings, activeRecords, timeElapsed) {
        for (var i = 0; i < activeBuildings.length; i++) {
            activeBuildings[i].spawnTimer += timeElapsed;
            if (activeBuildings[i].spawnTimer >= activeBuildings[i].timeBetweenSpawns) {
                activeBuildings[i].spawnTimer = 0;
                var collectableRecord = {
                    xCoord: activeBuildings[i].xCoord,
                    yCoord: activeBuildings[i].yCoord,
                    speed: 0,
                    includesPoint: function (pt) {
                        return ((pt.xCoord >= this.xCoord && pt.xCoord <= this.xCoord + 100)
                        && (pt.yCoord >= this.yCoord && pt.yCoord <= this.yCoord + 100));
                    }
                }
                activeRecords.push(collectableRecord);
                console.log("added a record");
            }
        }
    };

    Update.prototype.buffer = function (timeElapsed) {
        this.levelStartBuffer += timeElapsed;
        if (this.levelStartBuffer > 10) {
            return true;
        }
        else return false;
    };


    Update.prototype.update = function (activeAncestors, activeIndexers, activeProjectiles, activeRecords, activeBuildings, timeElapsed, level, controller, translation) {
        //spawn records and move them
        this.spawnRecord(activeRecords, timeElapsed);
        this.moveRecords(activeRecords, timeElapsed, translation);
        this.spawnRecordsFromBuildings(activeBuildings, activeRecords, timeElapsed);

        if (this.buffer(timeElapsed)) {
            //update ancestors
            this.updateAncestorsPosition(activeAncestors, timeElapsed, translation);
            this.checkDeadAncestors(activeAncestors);
            this.checkAncestorSpawnTimes(level, activeAncestors, timeElapsed);
            //update projectiles
            this.checkShootProjectile(activeIndexers, activeAncestors, activeProjectiles, timeElapsed);
            this.moveProjectiles(activeProjectiles, timeElapsed, translation);
            //this.checkProjectileCollision(activeProjectiles, activeAncestors);
            //check victory conditions
            this.checkVictory(controller, activeAncestors);
            this.checkDefeat(controller, activeAncestors);
        }
    };

    return Update;

});
