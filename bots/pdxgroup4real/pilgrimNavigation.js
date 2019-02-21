import {BCAbstractRobot, SPECS} from 'battlecode';
import mining from './mining.js';
export const pilgrimNavigation ={};

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
        
        if (robot.karbonite > robot.fuel){

            goal = fueLocation;
        }
        else{
            goal = karbLocation;
        }
         
       // robot.log("Goal.x: " + goal.x + "goal.y: " + goal.y);

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

        
        robot.log("ID: "+ robot.me.id + " Moving in direction: " + direction.x + "," + direction.y);
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
/*

pilgrimNavigation.dealWithImpassibleTerrain = (robot,dest) =>{

    var terrainMap = robot.map;
    var dist = 600000;
    var robotx = robot.me.x;
    var roboty = robot.me.y
    var robotxplus = (robot.me.x)+1;
    var robotyplus = (robot.me.y)+1;
    var robotxminus = (robot.me.x)-1;
    var robotyminus = (robot.me.y)-1;
    var i;
    var index;

    const choices = [[robotx,robotyminus],[robotxplus,robotyminus],[robotxplus,roboty],[robotxplus,robotyplus],
    [robotx,robotyplus],[robotxminus,robotyplus],[robotxminus,roboty],[robotxminus,robotyminus]];

    for (i = 0; i < choices.length; i++){

        y = choices[i][1];
        x = choices[i][0];
        if (terrainMap[x][y]){
            
            if (mining.squareDistance(dest,{x,y}) < dist){
                dist = mining.squareDistance(dest,{x,y});

                index = choices[i];
            }
        }
    }

    var choice = index;

    return robot.move(choice[0]-robotx,choice[1]-roboty);
}
*/


//export default pilgrimNavigation;