//import {BCAbstractRobot, SPECS} from 'battlecode';

var SPECS = {"COMMUNICATION_BITS":16,"CASTLE_TALK_BITS":8,"MAX_ROUNDS":1000,"TRICKLE_FUEL":25,"INITIAL_KARBONITE":100,"INITIAL_FUEL":500,"MINE_FUEL_COST":1,"KARBONITE_YIELD":2,"FUEL_YIELD":10,"MAX_TRADE":1024,"MAX_BOARD_SIZE":64,"MAX_ID":4096,"CASTLE":0,"CHURCH":1,"PILGRIM":2,"CRUSADER":3,"PROPHET":4,"PREACHER":5,"RED":0,"BLUE":1,"CHESS_INITIAL":100,"CHESS_EXTRA":20,"TURN_MAX_TIME":200,"MAX_MEMORY":50000000,"UNITS":[{"CONSTRUCTION_KARBONITE":null,"CONSTRUCTION_FUEL":null,"KARBONITE_CAPACITY":null,"FUEL_CAPACITY":null,"SPEED":0,"FUEL_PER_MOVE":null,"STARTING_HP":200,"VISION_RADIUS":100,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[1,64],"ATTACK_FUEL_COST":10,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":50,"CONSTRUCTION_FUEL":200,"KARBONITE_CAPACITY":null,"FUEL_CAPACITY":null,"SPEED":0,"FUEL_PER_MOVE":null,"STARTING_HP":100,"VISION_RADIUS":100,"ATTACK_DAMAGE":0,"ATTACK_RADIUS":0,"ATTACK_FUEL_COST":0,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":10,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":1,"STARTING_HP":10,"VISION_RADIUS":100,"ATTACK_DAMAGE":null,"ATTACK_RADIUS":null,"ATTACK_FUEL_COST":null,"DAMAGE_SPREAD":null},{"CONSTRUCTION_KARBONITE":15,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":9,"FUEL_PER_MOVE":1,"STARTING_HP":40,"VISION_RADIUS":49,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[1,16],"ATTACK_FUEL_COST":10,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":25,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":2,"STARTING_HP":20,"VISION_RADIUS":64,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[16,64],"ATTACK_FUEL_COST":25,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":30,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":3,"STARTING_HP":60,"VISION_RADIUS":16,"ATTACK_DAMAGE":20,"ATTACK_RADIUS":[1,16],"ATTACK_FUEL_COST":15,"DAMAGE_SPREAD":3}]};

export const mining = {};
/*	never used
mining.findClosestCluster = (robot, minemap, terrainmap) => {
    let destdistance = 6000000;
    let destlocation = null;
    var map = minemap;
    var terrainmap = robot.getPassableMap();
    let locations = [{}];
    var i = 0;
    const maplength = map.length;
    for (let y = 0; y <maplength; y++){
        for (let x = 0; x < maplength; x++){
            if(map[y][x] && terrainmap[y][x]){
                var currentDistance = mining.squareDistance({x,y},robot.me);
                if(currentDistance < destdistance && currentDistance > 32){

                    destdistance = currentDistance;    
                    destlocation = {x,y};                
                }
                
            }
        }
    }

    //robot.log("Robot ID: " + robot.me.id + " INSIDEEEEEEE GOALLLLL + " + destlocation.x + ","+ destlocation.y);

    return destlocation;

}
*/

mining.findClosestResource = (robot, minemap, terrainmap) => {

    let destdistance = 6000000;
    let destlocation = null;
    var map = minemap;
    //var terrainmap = robot.getPassableMap();
    let locations = [{}];
    var i = 0;
    const maplength = map.length;
    for (let y = 0; y <maplength; y++){
        for (let x = 0; x < maplength; x++){
            if(map[y][x] && terrainmap[y][x]){
                var currentDistance = mining.squareDistance({x,y},robot.me);
                if(currentDistance < destdistance){

                    destdistance = currentDistance;    
                    destlocation = {x,y};                
                }
                
            }
        }
    }

    //robot.log("Robot ID: " + robot.me.id + " INSIDEEEEEEE GOALLLLL + " + destlocation.x + ","+ destlocation.y);

    return destlocation;
}

mining.countResources = (robot,fuelmap,karbmap) => {

    var total_count = 0;
    var x;
    var y;

    for(y = 0; y < fuelmap.length; y++){
        for(x = 0; x < fuelmap.length; x++){
            if(fuelmap[y][x] && mining.squareDistance({x,y},robot.me) < 64 ){
                total_count++;
            }
        }
    }

    for(y = 0; y < karbmap.length; y++){
        for (x = 0; x < karbmap.length; x++){
            if(karbmap[y][x] && mining.squareDistance({x,y},robot.me) < 64){
                total_count++;
            }
        }
    }

    //robot.log("TOTAL RES: ---------" + total_count);

    return total_count;
}

//mining.checkIfOccupied = (goalx,goaly,robot) => {
mining.checkIfOccupied = (goalx,goaly,robot,visrobots) => {
    //var visrobots = robot.getVisibleRobots();
    var i;

    for (i in visrobots){

        //if (robot.isVisible(visrobots[i]) /*&& visrobots[i].unit === SPECS.PILGRIM */){

            if (visrobots[i].x === goalx && visrobots[i].y === goaly){

                //robot.log("IT'S FULL 0|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
                
                return true;
            }
        //}
    }

    return false;

}

mining.squareDistance = (destination,start) => {

    return Math.pow((destination.x - start.x),2) + Math.pow((destination.y - start.y),2);

}

mining.checkIfResourcesFull = (robot,karblimit,fueLimit) => {

    if (robot.me.karbonite >= karblimit || robot.me.fuel >= fueLimit){

        return true;
    } 

    return false;
}

//mining.returnTargetDump = (robot) =>{
mining.returnTargetDump = (robot,visibleRobots) =>{

    //var visibleRobots = robot.getVisibleRobots();
    var i;
    var targetDump = null;
    var dumpDistance;

    for (i in visibleRobots){

        //if(robot.isVisible(visibleRobots[i])){

            //if (visibleRobots[i].team === robot.me.team && visibleRobots[i].unit === SPECS.CASTLE){
            if (visibleRobots[i].team === robot.me.team 
                && (visibleRobots[i].unit === SPECS.CASTLE || visibleRobots[i].unit === 1)){

                dumpDistance = mining.squareDistance(visibleRobots[i],robot.me);

                if (dumpDistance <= 2){

                    targetDump = visibleRobots[i];
                    return targetDump;
                }
            }

        //}
    }
    return targetDump;
}

mining.readyToMine = (robot,karbLoc,fueLoc) => {

    if (fueLoc && mining.squareDistance(fueLoc,robot.me) === 0){
        if (robot.me.fuel < 100){

            robot.log("----------------- I AM MINING FUEL-----------------------");
            return true;
        }
    }
    else if (karbLoc && mining.squareDistance(karbLoc,robot.me)=== 0){
        if (robot.me.karbonite < 20){

            robot.log("--------------------I AM MINING KARB---------------------------");  
            return true;
        }
    }

    return false;
}


