//import {BCAbstractRobot, SPECS} from 'battlecode';
var SPECS = {"COMMUNICATION_BITS":16,"CASTLE_TALK_BITS":8,"MAX_ROUNDS":1000,"TRICKLE_FUEL":25,"INITIAL_KARBONITE":100,"INITIAL_FUEL":500,"MINE_FUEL_COST":1,"KARBONITE_YIELD":2,"FUEL_YIELD":10,"MAX_TRADE":1024,"MAX_BOARD_SIZE":64,"MAX_ID":4096,"CASTLE":0,"CHURCH":1,"PILGRIM":2,"CRUSADER":3,"PROPHET":4,"PREACHER":5,"RED":0,"BLUE":1,"CHESS_INITIAL":100,"CHESS_EXTRA":20,"TURN_MAX_TIME":200,"MAX_MEMORY":50000000,"UNITS":[{"CONSTRUCTION_KARBONITE":null,"CONSTRUCTION_FUEL":null,"KARBONITE_CAPACITY":null,"FUEL_CAPACITY":null,"SPEED":0,"FUEL_PER_MOVE":null,"STARTING_HP":200,"VISION_RADIUS":100,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[1,64],"ATTACK_FUEL_COST":10,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":50,"CONSTRUCTION_FUEL":200,"KARBONITE_CAPACITY":null,"FUEL_CAPACITY":null,"SPEED":0,"FUEL_PER_MOVE":null,"STARTING_HP":100,"VISION_RADIUS":100,"ATTACK_DAMAGE":0,"ATTACK_RADIUS":0,"ATTACK_FUEL_COST":0,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":10,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":1,"STARTING_HP":10,"VISION_RADIUS":100,"ATTACK_DAMAGE":null,"ATTACK_RADIUS":null,"ATTACK_FUEL_COST":null,"DAMAGE_SPREAD":null},{"CONSTRUCTION_KARBONITE":15,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":9,"FUEL_PER_MOVE":1,"STARTING_HP":40,"VISION_RADIUS":49,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[1,16],"ATTACK_FUEL_COST":10,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":25,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":2,"STARTING_HP":20,"VISION_RADIUS":64,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[16,64],"ATTACK_FUEL_COST":25,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":30,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":3,"STARTING_HP":60,"VISION_RADIUS":16,"ATTACK_DAMAGE":20,"ATTACK_RADIUS":[1,16],"ATTACK_FUEL_COST":15,"DAMAGE_SPREAD":3}]};

export const pilgrimNavigation ={};

import {mining} from './mining.js';

pilgrimNavigation.getDirection = (robot,goal) =>{

    var giveDirection = null;
    var x = 0;
    var y = 0;

    if (goal.x -robot.me.x === 0){

        x = 0;
    }
    else if(goal.x - robot.me.x > 0){
        x = 1;
    }
    else if (goal.x - robot.me.x < 0){
        x = -1;
    }


    if(goal.y - robot.me.y === 0){

        y = 0;
    }
    else if (goal.y - robot.me.y > 0){
        y = 1;
    }
    else if (goal.y - robot.me.y < 0){
        y = -1;
    }

    giveDirection = {x,y};

    return giveDirection;

}

//pilgrimNavigation.getGoal = (robot,fueLocation,karbLocation) => {
pilgrimNavigation.getGoal = (robot,fueLocation,karbLocation,visibleRobots) => {

    var goal = null;
    if (robot.me.karbonite < 20 && robot.me.fuel < 100){
        if (mining.checkIfOccupied(fueLocation.x,fueLocation.y,robot) === false && 
        mining.checkIfOccupied(karbLocation.x,karbLocation.y,robot) === false){

            if (mining.squareDistance(fueLocation,robot.me) < mining.squareDistance(karbLocation,robot.me)){
                goal = fueLocation;
            }
            else{
                goal = karbLocation;
            }
        }
        else if(mining.checkIfOccupied(fueLocation.x,fueLocation.y,robot)===false){
            goal = fueLocation
        }
        else if (mining.checkIfOccupied(karbLocation.x,karbLocation.y,robot)=== false){
            goal = karbLocation;
        }
        return goal;
    }
    else{

        //var visibleRobots = robot.getVisibleRobots();
        var i;

        for (i in visibleRobots){

           // if(robot.isVisible(visibleRobots[i])){
    
                if (visibleRobots[i].team === robot.me.team && visibleRobots[i].unit === SPECS.CASTLE){
    
                    goal = visibleRobots[i];

                    return goal;
                }
    
            //}
        }

    }
    return goal;
}

//pilgrimNavigation.pilgrimMove = (robot,fueLocation,karbLocation) => {
pilgrimNavigation.pilgrimMove = (robot,fueLocation,karbLocation,visibleRobots,isPassableMap) => {

    
    //var destination = pilgrimNavigation.getGoal(robot,fueLocation,karbLocation);
    var destination = pilgrimNavigation.getGoal(robot,fueLocation,karbLocation,visibleRobots);
    var direction = null;

    if(destination){

        direction = pilgrimNavigation.getDirection(robot,destination);
    }
    else{
       // robot.log("NO DESTINATION CURRENTLY FOUND FOR PILGRIM");
    }

    if (direction){
        //var isPassableMap = robot.getPassableMap();
        var goalx = robot.me.x + direction.x;
        var goaly = robot.me.y + direction.y;

/*
        robot.log("ID: "+ robot.me.id +" My Location: "+ robot.me.x + ","+robot.me.y + " My Goal:  " + destination.x+
        "," + destination.y + " Moving in direction: " + direction.x + "," + direction.y);
*/

        //if((isPassableMap[goaly][goalx] === false) || mining.checkIfOccupied(goalx,goaly,robot)){
        if((isPassableMap[goaly][goalx] === false) || mining.checkIfOccupied(goalx,goaly,robot,visibleRobots)){

           // robot.log(" 777777777777777777777 IDENTIFYING IMPASSABLE TERRAIN 777777777777777777777777777777777777777777777");

            //return pilgrimNavigation.dealWithImpassibleTerrain(robot,destination);
            return pilgrimNavigation.dealWithImpassibleTerrain(robot,destination,isPassableMap);

            
        }
        //return robot.move(direction.x,direction.y)
        return [direction.x,direction.y];
        
    }
    else{
       // robot.log("NO DIRECTION CURRENTLY FOUND FOR PILGRIM");
       // robot.log("MOVING RANDOMLY");

        const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
        const choice = choices[Math.floor(Math.random()*choices.length)]
        return choice;

    }
}

//pilgrimNavigation.dealWithImpassibleTerrain = (robot,dest) =>{
pilgrimNavigation.dealWithImpassibleTerrain = (robot,dest,terrainMap) =>{

    //var terrainMap = robot.getPassableMap();;
    var dist = 600000000;
    var robotx = robot.me.x; //0
    var roboty = robot.me.y  //0
    var robotxplus = (robot.me.x)+1; 
    var robotyplus = (robot.me.y)+1;
    var robotxminus = (robot.me.x)-1;
    var robotyminus = (robot.me.y)-1;
    var i;
    var index = {};

    const choices = [[robotx,robotyminus],[robotxplus,robotyminus],[robotxplus,roboty],[robotxplus,robotyplus],
    [robotx,robotyplus],[robotxminus,robotyplus],[robotxminus,roboty],[robotxminus,robotyminus]];

  // robot.log(" CHOICESZZZZZ" + choices[0][0] + "," + choices[0][1])

    for (i = 0; i < choices.length; i++){

        var y = choices[i][1];
        var x = choices[i][0];

        //robot.log(" CHOICESZZZZZ " + x + "," + y + " i: " + i);
        if ((terrainMap[y][x]) === true && (mining.checkIfOccupied(x,y,robot)) === false){

            if ((mining.squareDistance(dest,{x,y}) < dist) /*&& robot.pilgrimStack.includes({x,y} === false)*/){
                dist = mining.squareDistance(dest,{x,y});
                index = {x,y};


            }
        }
    }


    if (index != null){

        //robot.pilgrimStack.push(index);
        //return robot.move(index.x-robotx,index.y-roboty);
        return [index.x-robotx,index.y-roboty];
    }
}
