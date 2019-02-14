
import {BCAbstractRobot, SPECS} from 'battlecode';
import mining from './mining.js'
import unitbuilding from './unitbuilding.js'
import pilgrimNavigation from './pilgrimNavigation.js'
import Move from './Move.js';

var step = -1;

const moveChoices = [[0,1], [1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1]];

var CRUSADER_ATK_MIN = 1;
var CRUSADER_ATK_MAX = 16;
var PROPHET_ATK_MIN = 16;
var PROPHET_ATK_MAX = 64;

var index = 0;
var flag = false;


class MyRobot extends BCAbstractRobot {
    constructor(){
        super();
        this.unitCountMap = [0,0,0,0,0,0];
        this.isPilgrimKarb = 1;
        this.stack= [[0,0]];
    }

    turn() {
        step++;

        if (this.me.unit === SPECS.CRUSADER) {
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
                    if( dist <= CRUSADER_ATK_MAX && dist >= CRUSADER_ATK_MIN)
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
            var dirChoices = [[7,7],[7,map.length-8],[map.length-8,map.length-8],[map.length-8,7]];
            var start = [this.me.y, this.me.x];
            var end = [];
            
            if(target === 0)
                end = dirChoices[this.getIndex(dirChoices[index])];
            else
                end = [target.y, target.x];
            
            this.log(index);
            
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

        if (this.me.unit === SPECS.PROPHET) {
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
            
            this.log(index);
            
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


        //CASTLE
        else if (this.me.unit === SPECS.CASTLE) {
            // build preacher and prohpet first
            // keep trying to build for the first 10 turns

            /*
            if(this.karbonite > 70 && this.me.turn % 10 === 0)
            {
                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]
                
                this.log("Building a preacher at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PREACHER, choice[0], choice[1]);
            }

            else if(this.karbonite > 30 && this.me.turn % 5 === 0)
            {
                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]
                
                this.log("Building a prophet at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PROPHET, choice[0], choice[1]);
            }
            */
            // keep flows of crusaders after 10 turns
            /*
            if (this.karbonite >= 15 && this.me.turn % 25 === 0) {    
                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]

                this.log("Building a crusader at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.CRUSADER, choice[0], choice[1]);
            }
            */
           /*
            else if (this.karbonite >= 15 && this.me.turn % 25 === 0 ){

                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]

                this.log("Building a pilgrim at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PILGRIM, choice[0], choice[1]);
                
            } 
            */
           var unitMaps = unitbuilding.buildUnitMap(this);

            //this.log("PILGRIM: "+ unitMaps[2])

            if (unitMaps[2]>this.unitCountMap[2]){
                this.unitCountMap[2]++;
            }
            else if(unitMaps[3]>this.unitCountMap[3]){
                this.unitCountMap[3]++;
            }
            else if(unitMaps[4]> this.unitCountMap[4]){
                this.unitCountMap[4]++;
            }
            else if(unitMaps[5]> this.unitCountMap[5]){
                this.unitCountMap[5]++;
            }
            const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
            const choice = choices[Math.floor(Math.random()*choices.length)]

            if(this.unitCountMap[2]< 2){

                this.log("Building a pilgrim at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PILGRIM, choice[0], choice[1]);
            }
            /*
            else if(this.unitCountMap[3]< 2){

                this.log("Building a crusader at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.CRUSADER, choice[0], choice[1]);
            }
            */
            else if (this.unitCountMap[5]<1){
                this.log("Building a preacher at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PREACHER, choice[0], choice[1]);
            }
            else if (this.unitCountMap[4]< 1 ){
                
                this.log("Building a prophet at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PROPHET, choice[0], choice[1]);

            }
            else {
                return // this.log("Castle health: " + this.me.health);
            }
        }

        
        else if (this.me.unit === SPECS.PILGRIM){

            //check if there is resource to dump
            if (mining.checkIfResourcesFull(this,20,100)){ //minor fix
                var targetDump = mining.returnTargetDump(this);
                if(targetDump){

                    this.log("Team Karbonite: " + this.karbonite);
                    this.log("---------------DUMPING RESOURCES------------------------");

                    return this.give(targetDump.x - this.me.x,targetDump.y - this.me.y,this.me.karbonite,this.me.fuel);                
                }
            }
            //check if resource locations exist, if so mine
            var karblocation = mining.findClosestResource(this.me,this.karbonite_map);
            var fuellocation = mining.findClosestResource(this.me,this.fuel_map);

            if (fuellocation || karblocation){

                if(mining.readyToMine(this,karblocation,fuellocation)){

                    //this.log("-----------------------------I'm MINING------------------------------");
                    return this.mine();
                }
            }
            /*
            const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
            const choice = choices[Math.floor(Math.random()*choices.length)]
            return this.move(...choice);
            */
            return pilgrimNavigation.pilgrimMove(this,fuellocation,karblocation);
        }
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