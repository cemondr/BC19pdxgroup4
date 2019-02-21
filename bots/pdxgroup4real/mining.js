import {BCAbstractRobot, SPECS} from 'battlecode';


const mining = {};

mining.findClosestResource = (robot, minemap) => {

    let destdistance = 6000000;
    let destlocation = null;
    var map = minemap;
    const maplength = map.length;
    for (let y = 0; y <maplength; y++){
        for (let x = 0; x < maplength; x++){
            if(map[y][x]){
                var currentDistance = mining.squareDistance({x,y},robot);
                if(currentDistance < destdistance){

                    destdistance = currentDistance;
                    destlocation = {x,y};
                    
                }
            }
        }
    }
    return destlocation;
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

    if (mining.squareDistance(fueLoc,robot.me) === 0){

        if (robot.me.fuel < 100){

            robot.log("----------------- I AM MINING FUEL-----------------------");
            return true;
        }
    }
    else if (mining.squareDistance(karbLoc,robot.me)=== 0){

        if (robot.me.karbonite < 20){

            robot.log("--------------------I AM MINING KARB---------------------------");  
            return true;
        }
    }

    return false;
}

export default mining;