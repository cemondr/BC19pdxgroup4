import {BCAbstractRobot, SPECS} from 'battlecode';

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

pilgrimNavigation.getGoal = (robot,fueLocation,karbLocation) => {

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

        var visibleRobots = robot.getVisibleRobots();
        var i;

        for (i in visibleRobots){

            if(robot.isVisible(visibleRobots[i])){
    
                if (visibleRobots[i].team === robot.me.team && visibleRobots[i].unit === SPECS.CASTLE){
    
                    goal = visibleRobots[i];

                    return goal;
                }
    
            }
        }

    }
    return goal;
}

pilgrimNavigation.pilgrimMove = (robot,fueLocation,karbLocation) => {

    
    var destination = pilgrimNavigation.getGoal(robot,fueLocation,karbLocation);
    var direction = null;

    if(destination){

        direction = pilgrimNavigation.getDirection(robot,destination);
    }
    else{
        robot.log("NO DESTINATION CURRENTLY FOUND FOR PILGRIM");
    }

    if (direction){
        var isPassableMap = robot.getPassableMap();
        var goalx = robot.me.x + direction.x;
        var goaly = robot.me.y + direction.y;

        robot.log("ID: "+ robot.me.id +" My Location: "+ robot.me.x + ","+robot.me.y + " My Goal:  " + destination.x+
        "," + destination.y + " Moving in direction: " + direction.x + "," + direction.y);


        if((isPassableMap[goaly][goalx] === false) || mining.checkIfOccupied(goalx,goaly,robot)){

           // robot.log(" 777777777777777777777 IDENTIFYING IMPASSABLE TERRAIN 777777777777777777777777777777777777777777777");

            return pilgrimNavigation.dealWithImpassibleTerrain(robot,destination);

            
        }
        return robot.move(direction.x,direction.y)
        
    }
    else{
        robot.log("NO DIRECTION CURRENTLY FOUND FOR PILGRIM");
        robot.log("MOVING RANDOMLY");

        const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
        const choice = choices[Math.floor(Math.random()*choices.length)]
        return robot.move(...choice);

    }
}
pilgrimNavigation.dealWithImpassibleTerrain = (robot,dest) =>{

    var terrainMap = robot.getPassableMap();;
    var dist = 600000000;
    var robotx = robot.me.x; //0
    var roboty = robot.me.y  //0
    var robotxplus = (robot.me.x)+1; 
    var robotyplus = (robot.me.y)+1;
    var robotxminus = (robot.me.x)-1;
    var robotyminus = (robot.me.y)-1;
    var i;
    var index = null;

    const choices = [[robotx,robotyminus],[robotxplus,robotyminus],[robotxplus,roboty],[robotxplus,robotyplus],
    [robotx,robotyplus],[robotxminus,robotyplus],[robotxminus,roboty],[robotxminus,robotyminus]];

   robot.log(" CHOICESZZZZZ" + choices[0][0] + "," + choices[0][1])

    for (i = 0; i < choices.length; i++){

        var y = choices[i][1];
        var x = choices[i][0];

        //robot.log(" CHOICESZZZZZ " + x + "," + y + " i: " + i);
        if ((terrainMap[y][x]) === true && (mining.checkIfOccupied(x,y,robot)) === false){

            //obot.log(" CHOICESZZZZZ " + x + "," + y + " i: " + i);


            if (mining.squareDistance(dest,{x,y}) < dist){
                dist = mining.squareDistance(dest,{x,y});
                index = {x,y};


              //  robot.log(" CHOICESZZZZZhalallolo" + index.x + "," + index.y);


            }
        }
    }

   // robot.log("IMPASSABLE TERRAIN MOVE: " + index.x +"," + index.y);

    if (index != null){
    
        return robot.move(index.x-robotx,index.y-roboty);
    }
}
