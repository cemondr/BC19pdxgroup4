import {BCAbstractRobot, SPECS} from 'battlecode';

const unitbuilding = {};
var pilgrim_count = 0;

unitbuilding.checkPilgrimCount = () =>{

    return pilgrim_count;
}

unitbuilding.incrementPilgrimCount = () =>{
    
    pilgrim_count =pilgrim_count+1;
    return pilgrim_count
}


// This function returns an array with all the same team units with the 
unitbuilding.buildUnitMap = (robot) =>{

    var unitMap = [0,0,0,0,0,0];
    robotlist = robot.getVisibleRobots();

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

export default unitbuilding;