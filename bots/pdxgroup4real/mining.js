import {BCAbstractRobot, SPECS} from 'battlecode';

export const mining = {};

mining.findClosestResource = (robot, minemap, terrainmap) => {

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

mining.checkIfOccupied = (goalx,goaly,robot) => {

    var visrobots = robot.getVisibleRobots();
    var i;

    for (i in visrobots){

        if (robot.isVisible(visrobots[i]) /*&& visrobots[i].unit === SPECS.PILGRIM */){

            if (visrobots[i].x === goalx && visrobots[i].y === goaly){

                //robot.log("IT'S FULL 0|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
                
                return true;
            }
        }
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

mining.returnTargetDump = (robot) =>{

    var visibleRobots = robot.getVisibleRobots();
    var i;
    var targetDump = null;
    var dumpDistance;

    for (i in visibleRobots){

        if(robot.isVisible(visibleRobots[i])){

            if (visibleRobots[i].team === robot.me.team && visibleRobots[i].unit === SPECS.CASTLE){

                dumpDistance = mining.squareDistance(visibleRobots[i],robot.me);

                if (dumpDistance <= 2){

                    targetDump = visibleRobots[i];
                    return targetDump;
                }
            }

        }
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


