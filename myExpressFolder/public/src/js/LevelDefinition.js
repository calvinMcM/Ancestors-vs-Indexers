define(['model/IAncestor','ancestors/NamelessAncestor', 'ancestors/FamilyMember'],function(IAncestor, Nameless, FamilyMember) {

    function LevelDefinition() {
      this.rowHeight = 600/6;
      this.rowWidth = 900;
      this.topMargin = 105;
    }

    LevelDefinition.prototype.getScene = function(levelNum, sceneNum, eightGenerations)
    {
        var levelData = LevelDefinition.parseScene(levelNum, sceneNum, eightGenerations);

        this.setXYCoordinates(levelData, levelNum);
        return levelData;
    };

    LevelDefinition.prototype.getLevelStructure = function(actNum)
    {
        var levelStructure = [];
        var offset = 150;
        for (var i = 0; i < actNum; i++)
        {
            var trianglesForGeneration = [];
            var numTriangles = i * 2 + 1;
            var type = "alpha";
            var xCoord = i * 300;
            var yCoord = - i * 150 + offset;
            for (var j = 0; j < numTriangles; j++)
            {
                var tempTriangle = {};
                tempTriangle.xCoord = xCoord;
                tempTriangle.yCoord = yCoord;
                tempTriangle.type = type;
                trianglesForGeneration.push(tempTriangle);
                yCoord += 150;
                if (type == "alpha")
                {
                  type = "beta";
                }
                else
                {
                  type = "alpha";
                }
            }
            levelStructure.push(trianglesForGeneration);
        }

        return levelStructure;
    };

    LevelDefinition.prototype.getNodeStructure = function(levelNum)
    {
        var nodeStructure = [];
        var offset = 300;
        for (var i = 0; i < levelNum + 1; i++)
        {
            var type = "alpha";
            var nodesForGeneration = [];
            var numNodes = i * 2 + 1;
            var xCoord = i * 300;
            var yCoord = - i * 150 + offset;
            for (var j = 0; j < numNodes; j++)
            {
                if (type == "alpha")
                {
                    var tempNode = {};
                    tempNode.xCoord = xCoord;
                    tempNode.yCoord = yCoord;
                    tempNode.occupied = false;
                    nodesForGeneration.push(tempNode);
                }
                yCoord += 150;
                if (type == "alpha")
                {
                  type = "beta";
                }
                else
                {
                  type = "alpha";
                }
            }
            nodeStructure.push(nodesForGeneration);
        }
        return nodeStructure;
    };

    LevelDefinition.prototype.setXYCoordinates = function(levelData, levelNum) {
        var numNodes = levelNum;
        var firstNodeYCoord = -numNodes * 150 + 300;
        for (var i = 0; i < levelData.length; i++) {
            var occupiedNodes = [];
            for (var j = 0; j < levelData[i].length; j++) {
                // Select a random unoccupied node.
                var randNode;
                do{
                    randNode = Math.floor(Math.random() * (numNodes + 1));
                }while(occupiedNodes.indexOf(randNode) != -1);
                occupiedNodes.push(randNode);
                // Draw up coordinates
                var y_coord = firstNodeYCoord + randNode * 300;
                var x_coord = (levelNum) * 300;
                levelData[i][j].xCoord = x_coord;
                levelData[i][j].yCoord = y_coord;
                levelData[i][j].currentGeneration = levelNum;
            }
        }
    };

    LevelDefinition.addFamilyMember = function(lvl, scene, eightGenerations)
    {
        var availableAtGen = [];

        for (var i = 0; i < eightGenerations.length; i++)
        {
            if (eightGenerations[i].data.display.ascendancyNumber >= (Math.pow(2, lvl)) &&
                eightGenerations[i].data.display.ascendancyNumber < (Math.pow(2,lvl + 1)))
                {
                    availableAtGen.push(eightGenerations[i]);
                }
        }
        if (availableAtGen.length == 0)
        {
            return new FamilyMember();
        }
        var length = availableAtGen.length;
        var random = Math.floor(Math.random() * length);
        var personInfo = availableAtGen[random];

        var familyMember = new FamilyMember();
        familyMember.name = personInfo.data.display.name;
        familyMember.data = personInfo;
        return familyMember;
    };

    LevelDefinition.parseScene = function(lvl, scene, eightGenerations){
        var self = this;
        var level = [];
        var act_scheme = LevelDefinition.levels[lvl];               // Grab the act
        if(act_scheme){
            if(act_scheme.hasOwnProperty(scene)){                   // Look for the scene
                var scene_scheme = act_scheme[scene];               // Grab the scene
                for(var i in scene_scheme){                         // for each sub array
                    var wave_scheme = scene_scheme[i];
                    var wave = [];                                  // create space for a wave
                    for(var j in wave_scheme){                      // for each element in the subarray
                        switch(wave_scheme[j]){                     //  -push the correct ancestor type
                            case 'a':
                                wave.push(new IAncestor(j));
                                break;
                            case 'n':
                                wave.push(new Nameless(j));
                                break;
                            case 'f':
                                wave.push(self.addFamilyMember(lvl, scene, eightGenerations));
                            default:
                        }
                    }
                    level.push(wave);
                }
            }
            return level;
        }
        return null;
    };

    LevelDefinition.getNextSceneInfo = function(act, scene){
        var numActs = Object.keys(LevelDefinition.levels).length;
        var numScenes = Object.keys(LevelDefinition.levels[act]).length;

        if(scene < numScenes){
            scene++;
            return {'act': act, 'scene': scene};
        }
        else{
            act++;
            return {'act': act, 'scene': 1}; // Super broken - doesn't handle ultimate win conditions. So just don't win.
        }
    };

    LevelDefinition.levels = {
        1: { // Max of two per wave
            1: [['f'],['f']], // a(2)
            2: [['a', 'a'], ['f']] // a(3)
        },
        2: { // Max of three per wave
            1:[
                ['a', 'a'], ['a'], ['a', 'f', 'a'] // a(6)
            ],
            2:[
                ['a', 'a'], ['a','a'], ['a','a','a'],['f','a'] // a(9)
            ],
            3:[
                ['a'],['a','a'],['f','a','a'],['a','a'],['a','a','a'],['f','a'] // a(13)
            ]
        },
        3: { // Max of four per wave
            1: [
                ['f', 'a'], ['f','a'], ['a','a','a'],['f','a'] // a(9)
            ],
            2: [
                ['f', 'a'], ['f','a'], ['a','a','a','a'], ['a','n','a'] // a(7) n(2)
            ],
            3: [
                ['a', 'a'], ['a','n','a'], ['a','a','a','a'],['a','n'],['a','n','n'] // a(9) n(4)
            ]
        },
        4: { // Max of 5 per wave
            1: [ // a(19) n(4)
                ['a','a'],
                ['a', 'n', 'a'],
                ['a', 'a', 'a', 'a', 'a'],
                ['a', 'a', 'n', 'a'],
                ['a', 'a', 'a', 'a'],
                ['a', 'a', 'a', 'n', 'n']
            ],
            2: [ // a(18) n(6)
                ['a','a'],
                ['a', 'n', 'a'],
                ['a', 'a', 'a', 'n'],
                ['a', 'a', 'n', 'a', 'a'],
                ['a', 'a', 'a', 'a', 'n'],
                ['a', 'a', 'a', 'n', 'n']
            ],
            3: [ // a(19) n(10)
                ['a','a'],
                ['a', 'n', 'a'],
                ['a', 'a', 'a', 'n'],
                [],
                [],
                ['a', 'a', 'n', 'a', 'a'],
                ['a', 'n', 'a', 'a', 'n'],
                ['n', 'a', 'a', 'n', 'n'],
                ['a', 'n', 'a', 'n', 'a']
            ],
            4:[
                ['a','a'],
                ['a', 'n', 'a'],
                ['a', 'a', 'a', 'n'],
                [],
                [],
                ['a', 'a', 'n', 'a', 'a'],
                ['a', 'n', 'a', 'a', 'n'],
                ['n', 'a', 'a', 'n', 'n'],
                [],
                ['n', 'n', 'a', 'n', 'a'],
                ['n', 'n', 'a', 'n', 'a'],
                ['a', 'n', 'n', 'n', 'n']
            ]
        }
    };

    return LevelDefinition;
});
