// First Commit
import {BCAbstractRobot, SPECS} from 'battlecode';

var step = -1;

var CRUSADER_ATK_RANGE = 16;

class MyRobot extends BCAbstractRobot {
    turn() {
        step++;

        if (this.me.unit === SPECS.CRUSADER) {
            var visible = this.getVisibleRobots();

            var i;
            for(i in visible)
            {
                if(this.isVisible(visible[i]))
                {
                    var dist = (visible[i].x - this.me.x)*(visible[i].x - this.me.x) 
                        + (visible[i].y - this.me.y)*(visible[i].y - this.me.y);

                    if(this.me.team != visible[i].team && dist <= CRUSADER_ATK_RANGE)
                    {
                        this.log("Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }
                }
            }

            // this.log("Crusader health: " + this.me.health);
            const choices = [[0,-2], [2, -2], [2, 0], [2, 2], [0, 2], [-2, 2], [-2, 0], [-2, -2]];
            const choice = choices[Math.floor(Math.random()*choices.length)]
            return this.move(...choice);
        }
        else if (this.me.unit === SPECS.PREACHER) {
            this.log("PREACHER health: " + this.me.health);
            var visible = this.getVisibleRobots();
                //get attacable robot...
            var r;
            for(r in visible)
            {
                if(this.isVisible(visible[r]))
                {
                    var dist = this.squareDistance(visible[r]);

                    if(this.me.team != visible[r].team && dist <= 16)
                    {
                        this.log("Attacking: " + visible[r].id);
                        return this.attack(visible[r].x - this.me.x, visible[r].y - this.me.y);
                    }
                }
            }
            const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
            const choice = choices[Math.floor(Math.random()*choices.length)];
            return this.move(...choice);
        }
        else if (this.me.unit === SPECS.CASTLE) {
            if (this.karbonite > 55) {    //for first 10 steps
                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]

                this.log("Building a crusader at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.CRUSADER, choice[0], choice[1]);
            }
            else if (this.karbonite > 35 && this.karbonite<=55){

                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]

                this.log("Building a pilgrim at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PILGRIM, choice[0], choice[1]);
                
            } 
            else if (this.karbonite >= 30) {    //This code is building the unit preacher...
                this.log("Building a preacher at " + (this.me.x+1) + ", " + (this.me.y+1));
                return this.buildUnit(SPECS.PREACHER, 1, 1);
            }
            else {
                return // this.log("Castle health: " + this.me.health);
            }
        }

        /* pilgrim currently checks whether it is at a karbonite location. If it is,it starts mining. 
        Otherwise it starts to move randomly until it lands on a karbonite grid*/
        else if (this.me.unit === SPECS.PILGRIM){

            var karblocation = this.retClosestKarbLocation(this.me);
            if (karblocation && this.me.karbonite < 10){
                
                if (this.squareDistance(karblocation,this.me)=== 0){
                    
                    /*THE REPLAY ON BATTLECODE SITE DOESN'T DISPLAY KARONITE CORRECTLY SO
                    THIS IS A GOOD WAY TO TEST THE PILGRIM KARBONITE LEVEL

                    this.log("My Karbonite: " + this.me.karbonite);
                    this.log("--------------------I AM MINING---------------------------");
                    */
                    return this.mine();
                }
                
            }
            else if (this.me.karbonite <= 20 && this.me.karbonite >=10){

                var visibleRobots = this.getVisibleRobots();
                var i;
                var targetDump;
                var dumpDistance;
                
                for (i in visibleRobots){
                
                    if (this.isVisible(visibleRobots[i])){

                        if (visibleRobots[i].team === this.me.team && visibleRobots[i].unit === SPECS.CASTLE){
                            
                            dumpDistance = this.squareDistance(visibleRobots[i],this.me);

                            if (dumpDistance <= 2){

                                targetDump = visibleRobots[i];
                                
                                this.log("Team Karbonite: " + this.karbonite);
                                this.log("---------------DUMPING CARB------------")

                                return this.give(targetDump.x - this.me.x,targetDump.y - this.me.y,this.me.karbonite,
                                this.me.fuel);
                    
                            }
                        }
                    }
                }
            }
            const choices = [[0,-2], [2, -2], [2, 0], [2, 2], [0, 2], [-2, 2], [-2, 0], [-2, -2]];
            const choice = choices[Math.floor(Math.random()*choices.length)]
            return this.move(...choice);
        }

    }
    /* Returns the closest karbonite location from the current robot  */
    retClosestKarbLocation(robot){
        let destdistance = 6000000;
        let destlocation = null;
        var map = this.karbonite_map;
        const maplength = map.length; 

        for(let y = 0; y<maplength; y++){   // all 2D grid array maps structured ass arr[y][x]
            for (let x = 0; x<maplength; x++){
                if (map[y][x]){
                    
                    var currentDistance = this.squareDistance({x,y},robot);

                    if (currentDistance< destdistance)
                    {
                        destdistance = currentDistance;
                        destlocation = {x,y};
                    }
                }
            }
        }
        return destlocation;
    }

    squareDistance(destination, start){

        return Math.pow((destination.x - start.x),2) + Math.pow((destination.y- start.y),2);
    }

}

var robot = new MyRobot();
