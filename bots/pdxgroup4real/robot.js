
import {BCAbstractRobot, SPECS} from 'battlecode';
import mining from './mining.js'
import unitbuilding from './unitbuilding.js'
import pilgrimNavigation from './pilgrimNavigation.js';

var step = -1;

var CRUSADER_ATK_MIN = 1;
var CRUSADER_ATK_MAX = 16;
var PROPHET_ATK_MIN = 16;
var PROPHET_ATK_MAX = 64;

class MyRobot extends BCAbstractRobot {

    constructor(){
        super();
        this.unitCountMap = [0,0,0,0,0,0];
        this.isPilgrimKarb = 1;
    }

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
            else if(this.unitCountMap[3]< 2){

                this.log("Building a crusader at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.CRUSADER, choice[0], choice[1]);
            }
            else if (this.unitCountMap[4]< 1 ){
                
                this.log("Building a prophet at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PROPHET, choice[0], choice[1]);

            }
            else if (this.unitCountMap[5]<1){
                this.log("Building a preacher at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PREACHER, choice[0], choice[1]);
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
        on a fuel or karb location, if so mines it, otherwise  moves*/
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
}
var robot = new MyRobot();