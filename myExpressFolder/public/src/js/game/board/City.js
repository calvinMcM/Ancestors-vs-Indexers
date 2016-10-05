/**
 * Created by calvinm2 on 9/20/16.
 */

define(["game/Tile", "game/board/AbstractBoard", "game/board/BoardUtils"], function(Tile, AbsBoard, BoardUtils){

    function City(){
        this.tileArray = [];
    }

    City.prototype = AbsBoard;

    City.prototype.generate = function(levelData){
        if(!levelData.hasOwnProperty("numDBs") || !levelData.hasOwnProperty("numExtraClumps")){
            console.log("Nada!!");
            return [[]];
        }
        console.log("<<CITYBOARD>> lvlDat:", levelData.numDBs, ":", levelData.numExtraClumps);
        var clumps = [];
        var DBsLeft = levelData.numDBs;
        var ClumpsLeft = levelData.numExtraClumps;

        // Generate the blocks for the city center.
        var DBsForCenter = Math.floor(Math.round((DBsLeft + 1)/3));
        var ClumpsForCenter = Math.floor(Math.round((DBsLeft + 1)/6));
        DBsLeft -= DBsForCenter;
        ClumpsLeft -= ClumpsForCenter;
        var i;
        var lim = DBsForCenter + ClumpsForCenter;
        console.log("<<CITYBOARD>> Creating", lim, "City-Center blocks");
        for(i = 0; i < lim; i ++){ // About a third of the DBs and about a sixth of the extraClumps
            clumps.push({array:City.generateCityBlock(8, (DBsForCenter--), (i==0))});
        }

        // Generate the blocks for the suburbs.
        var DBsForSuburbs = Math.floor(Math.round((DBsLeft)/2));
        var ClumpsForSuburbs = Math.floor(Math.round((clumps*2)/5));
        DBsLeft -= DBsForSuburbs;
        ClumpsLeft -= ClumpsForSuburbs;
        lim = DBsForSuburbs + ClumpsForSuburbs;
        console.log("<<CITYBOARD>> Creating", lim, "Suburban blocks");
        for(i = 0; i < lim; i++){
            clumps.push({array:City.generateSuburbBlock(6, (DBsForSuburbs--), false)});
        }

        // Generate the blocks for the country.
        lim = DBsLeft + ClumpsLeft;
        console.log("<<CITYBOARD>> Creating", lim, "Country blocks");
        for(i = 0; i < lim; i++){
            clumps.push({array:City.generateCountryBlock(3, (DBsLeft--), false)});
        }
        
        var arr = BoardUtils.merge(clumps, 0);
        BoardUtils.printArray(arr);
    };

    /**
     * An ease-of-use function for generating city blocks with the outsides marked as roads.
     * @param w
     * @param h
     */
    City.generateBlock = function(w, h = w){
        var arr = BoardUtils.makeBoard(w, h, true);
        for(var i = 0; i < h; i++){
            for(var j = 0; j < w; j++){
                if(i == 0 || (i+1) == h || j == 0 || (j+1) == w){
                    arr[i][j].addType(Tile.FAST);
                    arr[i][j].removeType(Tile.SLOW);
                    arr[i][j].removeType(Tile.NORMAL);
                }
                else if(j == 1 || (j + 2) == w || i == 1 || (i + 2) == h){
                    arr[i][j].addType(Tile.NORMAL);
                }
            }
        }
        return arr;
    };

    City.isGoodNeighbor = function(x, y, arr){
        var neighbors= BoardUtils.getNeighbors(y, x, arr);
        for(var neighbor of neighbors){
            var tile = arr[neighbor.row][neighbor.col];
            // console.log("Checking neighbor", neighbor.row, neighbor.col, ":", tile.type);
            if(tile.hasType(Tile.NORMAL)){
                return true;
            }
        }
        return false;
    };

    City.generateCityBlock = function(fill, hasDB, hasCourthouse){
        var arr = City.generateBlock(7,7);
        switch(Math.floor(Math.random() * 4)){
            case 1:
                arr[4][3].addType(Tile.NORMAL);
                break;
            case 2:
                arr[4][5].addType(Tile.NORMAL);
                break;
            case 3:
                arr[3][4].addType(Tile.NORMAL);
                break;
            case 4:
                arr[5][4].addType(Tile.NORMAL);
                break;
        }
        var limit = 8;
        if(hasDB){--limit;}
        if(hasCourthouse){--limit;}
        fill = (fill <= limit) ? fill : limit;
        var spot;
        for(var i = 0; i < fill; i++){
            spot = City.findHouseSpot(arr);
            arr[spot.row][spot.col].addType(Tile.ENVIRONMENT);
        }
        if(hasDB){
            spot = City.findHouseSpot(arr);
            arr[spot.row][spot.col].addType(Tile.SOURCE);
        }
        if(hasCourthouse){
            spot = City.findHouseSpot(arr);
            arr[spot.row][spot.col].addType(Tile.ENDPOINT);
        }
        City.fillWith(arr, Tile.NORMAL);
        BoardUtils.printArray(arr);
        return arr;
    };

    City.generateSuburbBlock = function(fill, hasDB){
        var arr = City.generateBlock(8,8);
        switch(Math.floor(Math.random() * 4)){
            case 1:
                arr[4][3].addType(Tile.NORMAL);
                break;
            case 2:
                arr[4][5].addType(Tile.NORMAL);
                break;
            case 3:
                arr[3][4].addType(Tile.NORMAL);
                break;
            case 4:
                arr[5][4].addType(Tile.NORMAL);
                break;
        }
        var limit = 8;
        if(hasDB){--limit;}
        fill = (fill <= limit) ? fill : limit;
        var spot;
        for(var i = 0; i < fill; i++){
            spot = City.findHouseSpot(arr);
            arr[spot.row][spot.col].addType(Tile.ENVIRONMENT);
        }
        if(hasDB){
            spot = City.findHouseSpot(arr);
            arr[spot.row][spot.col].addType(Tile.SOURCE);
        }
        City.fillWith(arr, Tile.NORMAL, Tile.SLOW);
        BoardUtils.printArray(arr);
        return arr;
    };

    City.generateCountryBlock = function(fill, hasDB){
        var arr = City.generateBlock(9,9);
        switch(Math.floor(Math.random() * 4)){
            case 1:
                arr[4][3].addType(Tile.NORMAL);
                break;
            case 2:
                arr[4][5].addType(Tile.NORMAL);
                break;
            case 3:
                arr[3][4].addType(Tile.NORMAL);
                break;
            case 4:
                arr[5][4].addType(Tile.NORMAL);
                break;
        }
        var limit = 8;
        if(hasDB){--limit;}
        fill = (fill <= limit) ? fill : limit;
        var spot;
        for(var i = 0; i < fill; i++){
            spot = City.findHouseSpot(arr);
            arr[spot.row][spot.col].addType(Tile.ENVIRONMENT);
        }
        if(hasDB){
            spot = City.findHouseSpot(arr);
            arr[spot.row][spot.col].addType(Tile.SOURCE);
        }
        City.fillWith(arr, Tile.NORMAL, Tile.SLOW , Tile.SLOW); // Gives it a 2/3 chance of being a slow tile.
        BoardUtils.printArray(arr);
        return arr;
    };

    City.findHouseSpot = function(arr){
        do{
            var y = Math.floor((Math.random() * (arr.length - 4)) + 2);
            var x = Math.floor((Math.random() * (arr[y].length - 4)) + 2);

            if(BoardUtils.isOnBoard(y, x, arr)){
                if(arr[y][x].hasType(Tile.NONE)){
                    if(City.isGoodNeighbor(x, y, arr)){
                        return BoardUtils.genPair(x,y);
                    }
                }
            }
        }while(1);
    };

    City.fillWith = function(arr, ...fillTypes){
        var i = 0;
        for(i; i < arr.length; i++){
            var j = 0;
            for(j; j < arr[i].length; j++){
                if(BoardUtils.isOnBoard(i,j,arr) && arr[i][j].hasType(Tile.NONE)){
                    if(fillTypes.length > 1) {
                        arr[i][j].addType(fillTypes[0]);
                    }
                    else{
                        arr[i][j].addType(fillTypes[Math.floor(Math.random() * fillTypes.length)]);
                    }
                }
            }
        }
    };

    return City;
});