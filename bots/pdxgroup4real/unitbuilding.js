//import {BCAbstractRobot, SPECS} from 'battlecode';

var SPECS = {"COMMUNICATION_BITS":16,"CASTLE_TALK_BITS":8,"MAX_ROUNDS":1000,"TRICKLE_FUEL":25,"INITIAL_KARBONITE":100,"INITIAL_FUEL":500,"MINE_FUEL_COST":1,"KARBONITE_YIELD":2,"FUEL_YIELD":10,"MAX_TRADE":1024,"MAX_BOARD_SIZE":64,"MAX_ID":4096,"CASTLE":0,"CHURCH":1,"PILGRIM":2,"CRUSADER":3,"PROPHET":4,"PREACHER":5,"RED":0,"BLUE":1,"CHESS_INITIAL":100,"CHESS_EXTRA":20,"TURN_MAX_TIME":200,"MAX_MEMORY":50000000,"UNITS":[{"CONSTRUCTION_KARBONITE":null,"CONSTRUCTION_FUEL":null,"KARBONITE_CAPACITY":null,"FUEL_CAPACITY":null,"SPEED":0,"FUEL_PER_MOVE":null,"STARTING_HP":200,"VISION_RADIUS":100,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[1,64],"ATTACK_FUEL_COST":10,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":50,"CONSTRUCTION_FUEL":200,"KARBONITE_CAPACITY":null,"FUEL_CAPACITY":null,"SPEED":0,"FUEL_PER_MOVE":null,"STARTING_HP":100,"VISION_RADIUS":100,"ATTACK_DAMAGE":0,"ATTACK_RADIUS":0,"ATTACK_FUEL_COST":0,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":10,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":1,"STARTING_HP":10,"VISION_RADIUS":100,"ATTACK_DAMAGE":null,"ATTACK_RADIUS":null,"ATTACK_FUEL_COST":null,"DAMAGE_SPREAD":null},{"CONSTRUCTION_KARBONITE":15,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":9,"FUEL_PER_MOVE":1,"STARTING_HP":40,"VISION_RADIUS":49,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[1,16],"ATTACK_FUEL_COST":10,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":25,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":2,"STARTING_HP":20,"VISION_RADIUS":64,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[16,64],"ATTACK_FUEL_COST":25,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":30,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":3,"STARTING_HP":60,"VISION_RADIUS":16,"ATTACK_DAMAGE":20,"ATTACK_RADIUS":[1,16],"ATTACK_FUEL_COST":15,"DAMAGE_SPREAD":3}]};


export const unitbuilding = {};
var pilgrim_count = 0;

unitbuilding.checkPilgrimCount = () =>{

    return pilgrim_count;
}

unitbuilding.incrementPilgrimCount = () =>{
    
    pilgrim_count =pilgrim_count+1;
    return pilgrim_count
}


// This function returns an array with all the same team units with the 
//unitbuilding.buildUnitMap = (robot) =>{
unitbuilding.buildUnitMap = (robot, robotlist) =>{
    var unitMap = [0,0,0,0,0,0];
    //var robotlist = robot.getVisibleRobots();

    var i;

    for (i in robotlist){

        

        if(robotlist[i].team === robot.me.team){

            if(robotlist[i].unit === SPECS.CASTLE){
             unitMap[0]++;
            }
            else if(robotlist[i].unit ===SPECS.CHURCH){
                unitMap[1]++;
            }
            else if(robotlist[i].unit === SPECS.PILGRIM){
                unitMap[2]++;
            }
            else if (robotlist[i].unit === SPECS.CRUSADER){
                unitMap[3]++;
            }
            else if (robotlist[i].unit === SPECS.PROPHET){
                unitMap[4]++;
            }
            else if (robotlist[i].unit === SPECS.PREACHER){
                unitMap[5]++;
            }
        }
        
    }

    return unitMap;
}

// Helper function that I ocassionally use to test certain features. Currently not being called from anywhere.
/*
unitbuilding.countthepilgrims = (robot) =>{

    var visibleRobots = robot.getVisibleRobots();
    var pilgrimnum = 0;
    var i;

    for (i in visibleRobots){
        
        if(visibleRobots[i].team === robot.me.team){

            if(visibleRobots[i].unit === SPECS.PILGRIM){
                pilgrimnum++;
            }

        }
    }

    return pilgrimnum;

}
*/
