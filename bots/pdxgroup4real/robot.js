import {BCAbstractRobot, SPECS} from 'battlecode';
import {Move} from './Move.js';

var step = -1;

const moveChoices = [[0,1], [1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1]];

// var CRUSADER_ATK_MIN = 1;
// var CRUSADER_ATK_MAX = 16;
var PROPHET_ATK_MIN = 16;
var PROPHET_ATK_MAX = 64;

var index = 0;
var flag = false;


class MyRobot extends BCAbstractRobot {
    constructor(){
        super();

        this.stack= [[0,0]];
    }

    turn() {
        step++;

        if (this.me.unit === SPECS.PREACHER) {
            var visible = this.getVisibleRobots();
            var map = this.getPassableMap();
            var target = 0;

            var i;
            for(i in visible)
            {
                if(this.me.team != visible[i].team && this.isVisible(visible[i]))
                {
                   var dist = this.squareDistance(visible[i],this.me);
                    
                    // if target in range, attack
                    if( dist <= 16)
                    {
                        this.log("Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }

                    target = visible[i];
                }
            }
          
            var robotMap = this.getVisibleRobotMap();
            this.log("preacher : " + map.length)
            var dirChoices = [[9,9],[9,map.length-8],[map.length-8,map.length-9],[map.length-9,8]];
            var start = [this.me.y, this.me.x];
            var end = [];
            
            if(target === 0)
                end = dirChoices[this.getIndex(dirChoices[index])];
            else
                end = [target.y, target.x];
            
            this.log("preacher index" + index);
            
            this.tmpStack = this.stack;
            var mov = Move.moveOffense(start, end, map, robotMap, this.tmpStack);

            if(this.stack.length > 10)
                this.stack.shift();

            var nl = [mov[0]+start[1],mov[1]+start[0]];
            this.stack.push(nl);
            this.log(this.stack);
            this.log("moving: " + mov);
            
            return this.move(...mov);
        }


        else if (this.me.unit === SPECS.PROPHET) {
            var visible = this.getVisibleRobots();
            var map = this.getPassableMap();
            var target = 0;

            var i;
            for(i in visible)
            {
                if(this.me.team != visible[i].team && this.isVisible(visible[i]))
                {
                   var dist = this.squareDistance(visible[i],this.me);
                    
                    // if target in range, attack
                    if( dist <= PROPHET_ATK_MAX && dist >= PROPHET_ATK_MIN)
                    {
                        this.log("Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }

                    // seen but not in att range
                    target = visible[i];
                }
            }

            // no visible enemies, move to opposite corner
            var robotMap = this.getVisibleRobotMap();
            //var dirChoices = [[4,4],[4,map.length-5],[map.length-5,4],[map.length-4,map.length-4]];
            var dirChoices = [[5,5],[5,map.length-6],[map.length-6,map.length-6],[map.length-6,5]];
            var start = [this.me.y, this.me.x];
            var end = [];
            
            if(target === 0)
                end = dirChoices[this.getIndex(dirChoices[index])];
            else
                end = [target.y, target.x];
            
            this.log("prophet index" +index);
            
            this.tmpStack = this.stack;
            var mov = Move.moveOffense(start, end, map, robotMap, this.tmpStack);

            if(this.stack.length > 10)
                this.stack.shift();

            var nl = [mov[0]+start[1],mov[1]+start[0]];
            this.stack.push(nl);
            this.log(this.stack);



            this.log("moving: " + mov);
            
            return this.move(...mov);
        }
        
        //CASTLE
        else if (this.me.unit === SPECS.CASTLE) {
            // build preacher and prohpet first
            // keep trying to build for the first 10 turns
            
            if(this.karbonite > 30 && this.me.turn % 10 === 0)
            {
                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]
                
                this.log("Building a prophet at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PROPHET, choice[0], choice[1]);
            }
            
            // keep flows of crusaders after 10 turns
            
            else if (this.karbonite >= 15 && this.me.turn % 25 === 0 ){

                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]

                this.log("Building a pilgrim at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PILGRIM, choice[0], choice[1]);
                
            } 
            else if (this.me.turn < 10 && this.karbonite > 70) {    //This code is building the unit preacher...
                this.log("Building a preacher at " + (this.me.x+1) + ", " + (this.me.y+1));
                return this.buildUnit(SPECS.PREACHER, 1, 1);
            }
            
            else {
                return // this.log("Castle health: " + this.me.health);
                }
            }
        
        
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

    getIndex(goal)
    {
        var loc = [this.me.y, this.me.x];
        var d = Move.dist(loc, goal);

        if(d < 9)
            index++;

        if(index > 3)
            index = 0;
        
        return index;
    }
}

var robot = new MyRobot();