
import {BCAbstractRobot, SPECS} from 'battlecode';

var step = -1;

var CRUSADER_ATK_MIN = 1;
var CRUSADER_ATK_MAX = 16;
var PROPHET_ATK_MIN = 16;
var PROPHET_ATK_MAX = 64;
//hi
class MyRobot extends BCAbstractRobot {

    turn() {
        step++;

        var MAP = this.map;

        if (this.me.unit === SPECS.CRUSADER) {
            var visible = this.getVisibleRobots();

            var i;
            for(i in visible)
            {
                if(this.isVisible(visible[i]))
                {
            
                   var dist = this.squareDistance(visible[i],this.me);

                    // if target in range, attack
                    if(this.me.team != visible[i].team && dist <= CRUSADER_ATK_MAX && dist >= CRUSADER_ATK_MIN)
                    {
                        this.log("Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }
                }
            }

            // no visible enemies or enemies not in range, move
            const choices = [[0,-2], [2, -2], [2, 0], [2, 2], [0, 2], [-2, 2], [-2, 0], [-2, -2]];
            const choice = choices[Math.floor(Math.random()*choices.length)]
            return this.move(...choice);
        }

        //CASTLE
        else if (this.me.unit === SPECS.CASTLE) {
            // build preacher and prohpet first
            // keep trying to build for the first 10 turns
            if (this.me.turn < 10 && this.karbonite > 70) {    //This code is building the unit preacher...
                this.log("Building a preacher at " + (this.me.x+1) + ", " + (this.me.y+1));
                return this.buildUnit(SPECS.PREACHER, 1, 1);
            }
            else if(this.me.turn < 10 && this.karbonite > 60)
            {
                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]
                
                this.log("Building a prophet at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PROPHET, choice[0], choice[1]);

            }

            // keep flows of crusaders after 10 turns
            else if (this.karbonite >= 15 && this.me.turn % 10 === 0) {    
                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]

                this.log("Building a crusader at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.CRUSADER, choice[0], choice[1]);
            }
            else if (this.karbonite >= 15 && this.me.turn < 10 ){

                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]

                this.log("Building a pilgrim at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PILGRIM, choice[0], choice[1]);
                
            } 
            else {
                return // this.log("Castle health: " + this.me.health);
            }
        }

        // PREACHER
        else if (this.me.unit === SPECS.PREACHER) {
            this.log("PREACHER health: " + this.me.health);
            var visible = this.getVisibleRobots();
                //get attacable robot...
            var r;
            for(r in visible)
            {
                if(this.isVisible(visible[r]))
                {
                    var dist = this.squareDistance(visible[r],this.me);

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
        
        else if (this.me.unit === SPECS.PROPHET) {
            var visible = this.getVisibleRobots();

            var i;
            for(i in visible)
            {
                if(this.isVisible(visible[i]))
                {
                    var dist = this.squareDistance(visible[i],this.me);

                    if(this.me.team != visible[i].team && dist <= PROPHET_ATK_MAX && dist >= PROPHET_ATK_MIN)
                    {
                        this.log("Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }
                }
            }

            const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
            const choice = choices[Math.floor(Math.random()*choices.length)]
            return this.move(...choice);
        }
        
        /* PILGRIM first checks if there is resource to dump, if so it dumps, otherwise checks if its
        on a fuel or karb location, if so mines it, otherwise randomly moves*/
        else if (this.me.unit === SPECS.PILGRIM){

            //check if there is resource to dump
            if ((this.me.karbonite <= 20 && this.me.karbonite >=10) ||  (this.me.fuel<=100 && this.me.fuel >= 50)){ //minor fix

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
                                this.log("---------------DUMPING RESOURCES------------------------");

                                return this.give(targetDump.x - this.me.x,targetDump.y - this.me.y,this.me.karbonite,
                                this.me.fuel);
                            }
                        }
                    }
                }
            }
            //check if resource locations exist, if so mine
            var karblocation = this.retClosestKarbLocation(this.me);
            var fuellocation = this.retClosestFuelLocation(this.me);

            if (fuellocation || karblocation){

                if (this.squareDistance(fuellocation,this.me) === 0){

                    if (this.fuel < 300 && this.me.fuel < 50){

                        this.log("----------------- I AM MINING FUEL-----------------------");
                        return this.mine();
                    }
                }
                else if (this.squareDistance(karblocation,this.me)=== 0){

                    if (this.karbonite< 500 && this.me.karbonite < 10){

                        this.log("--------------------I AM MINING KARB---------------------------");                    
                        return this.mine();
                    }
                }
            }
            
            const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
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

    retClosestFuelLocation(robot){
        let destdistance = 6000000;
        let destlocation = null;
        var map = this.fuel_map;
        const maplength = map.length;

        for (let y = 0; y <maplength; y++){
            for (let x = 0; x < maplength; x++){
                if(map[y][x]){
                    var currentDistance = this.squareDistance({x,y},robot);

                    if(currentDistance < destdistance){
                        destdistance = currentDistance;
                        destlocation = {x,y};
                    }
                }
            }
        }

        return destlocation;
    }

    squareDistance(destination, start){

        return Math.pow((destination.x - start.x),2) + Math.pow((destination.y - start.y),2);
    }

}

var robot = new MyRobot();