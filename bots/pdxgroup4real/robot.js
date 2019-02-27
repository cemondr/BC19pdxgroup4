
import {BCAbstractRobot, SPECS} from 'battlecode';
import {Move} from './Move.js';
//const Move = import('Move');
import {mining} from './mining.js'
import {unitbuilding} from './unitbuilding.js'
import {pilgrimNavigation} from './pilgrimNavigation.js';

var step = -1;
var PROPHET_ATK_MIN = 16;
var PROPHET_ATK_MAX = 64;

var index = 0;
var flag = false;
var enemyCastle = [];
var pendingCastleLoc = null ;   //have to send over two turns, this is for when we have only sent half a castle loc...castle talk


class MyRobot extends BCAbstractRobot {
    constructor(){
        super();

        this.stack= [[0,0]];
        this.unitCountMap = [0,0,0,0,0,0];  
        this.isPilgrimKarb = 1;             
        this.partialCastleLocReceived = {}

    }

    turn() {
        step++;
        var MAP = this.map;
        if (this.me.unit === SPECS.PREACHER) {
            var visible = this.getVisibleRobots();
            var map = this.getPassableMap();
            var target = 0;

            var i;
            
            for(i in visible)
            {
                this.castleTalk(visible[i].x);
                if (visible[i].signal != -1)   //If robot doesn't sent any signal
                {
                    //read out castle loc
                    var loc = [(visible[i].signal % 2**4, Math.floor(visible[i].signal >> 4))];  // 2**4 because we are reading 4 bits of x and y coorinates.
                    this.log("PREACHER signal received : " + String(loc));
                }
                if(this.me.team != visible[i].team && this.isVisible(visible[i]))
                {
                   var dist = this.squareDistance(visible[i],this.me);
                   
                    // if target in range, attack
                    if( dist <= 16)

                    {
                        var cord = (visible[i].x, visible[i].y)
                        if ((visible[i].unit == 0) && (enemyCastle.includes(cord) == false))
                        {
                         // need to cram two numbers < 64 into 4 bit.
                         // in the form of 00yy00xx
                            var message = visible[i].y << 4 + visible[i].x;
                            this.log("message: " + message)
                            var maxx = Math.max(this.me.x, 10 - this.me.x);
                            
                            var maxy = Math.max(this.me.y, 10 - this.me.y);
                            // this.signal(message, maxx + maxy);
                            this.log("range1: " + maxx + maxy);
                            this.signal(message, maxx + maxy);
                            this.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!.!!!!!!!!!!!!!!!!!!!!!!!!!111........PREACHER IS signaling castle yloc :" + String((visible[i].x, visible[i].y)));
                            this.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!....Sent message to castle.....!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                            
                            enemyCastle.push(cord)
                            if (this.pendingCastleLoc != null)
                            {
                                
                                this.log("*****************************************************************signaling castle Talk yloc :" + String(this.pendingCastleLoc));
                                this.castleTalk(this.pendingCastleLoc);
                                this.pendingCastleLoc = null;
                            }
                            this.log("*****************************************************************signaling castle Talk xloc :" + String((visible[i].x, visible[i].y)));
                            this.castleTalk(visible[i].x);
                            this.pendingCastleLoc = visible[i].y
                        }
                        this.log("Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }
                    // seen but not in att range
                    target = visible[i];
                }
            }
            // no visible enemies, move to opposite corner
            var robotMap = this.getVisibleRobotMap();
            //this.log("preacher map length : " + map.length)
            //var dirChoices = [[9,9],[9,map.length-7],[map.length-7,map.length-9],[map.length-9,7]];
            var dirChoices = [[9,9],[9,map.length-10],[map.length-10,map.length-9],[map.length-9,10]];
            var start = [this.me.y, this.me.x];
            var end = [];
            
            if(target === 0)
                end = dirChoices[this.getIndex(dirChoices[index])];
            else
                end = [target.y, target.x];
            
            this.log("preacher index: " + index);
            
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
                this.castleTalk(visible[i].x);
                if (visible[i].signal != -1)
                {
                    //read out castle loc
                    var loc = [(visible[i].signal % 2**4, visible[i].signal >> 4)];  // 2**4 brcause we are reading 4 bits of x and y coorinates.
                    this.log("Prophet signal received : " + String(loc));
                }

                if(this.me.team != visible[i].team && this.isVisible(visible[i]))
                {
                   var dist = this.squareDistance(visible[i],this.me);
                    
                    // if target in range, attack
                    if( dist <= PROPHET_ATK_MAX && dist >= PROPHET_ATK_MIN)
                    {
                        var cord = (visible[i].x, visible[i].y);
                        //this.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ enemyCastle ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^" + enemyCastle);
                        if ((visible[i].unit == 0) && (enemyCastle.includes(cord) == false))
                        {
                         // need to cram two numbers < 64 into 4 bit.
                         // in the form of 00yy00xx
                            
                            var message = visible[i].y << 4 + visible[i].x;
                            this.log("message" + message);
                            var maxx = Math.max(this.me.x, 20 - this.me.x);
                            var maxy = Math.max(this.me.y, 20 - this.me.y);
                            this.log("range: " + maxx + maxy);
                            //this.log("range1: " + (63 - this.me.x) + (63 - this.me.y));
                            this.signal(message, maxx);

                            this.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11!!!.........PROPHET is signaling castle yloc :" + String((visible[i].x, visible[i].y)));
                            this.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!...Sent message to castle.....!!!!!!!!!!!!!!!!!!!!!!!!!!!111");

                            //this.castleTalk(visible[i].y);
                        
                            enemyCastle.push(cord)
                            if (this.pendingCastleLoc != null)
                            {
                                
                                this.log("************************************************************signaling castle Talk yloc :" + String(this.pendingCastleLoc));
                                this.castleTalk(this.pendingCastleLoc);
                                //this.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$CASTLE TALK VALUE......." + this.pendingCastleLoc);
                                this.pendingCastleLoc = null;
                            }
                            else
                            {

                                this.log("*****************************************************signaling castle Talk xloc :" + String((visible[i].x, visible[i].y)));
                                this.castleTalk(visible[i].x);
                                this.pendingCastleLoc = visible[i].y
                            }
                        }
                    
                        this.log("Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }
                    
                    // seen but not in att range
                    target = visible[i];
                }
            }

            // no visible enemies, move to opposite corner
            var robotMap = this.getVisibleRobotMap();
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
            this.log("prophet stack" + this.stack);
            this.log("moving: " + mov);
            
            return this.move(...mov);
        }
        //CASTLE
        else if (this.me.unit === SPECS.CASTLE) {
            var unitMaps = unitbuilding.buildUnitMap(this); // DONT DELETE... (... means more lines coming)
            var visible = this.getVisibleRobots();
            var map = this.getPassableMap();
            var target = 0;

            var i;

             for(i in visible)
            {
                //this.castleTalk(visible[i].x);
                //this.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$CASTLE TALK VALUE......." + visible[i].x);
                if ((visible[i].castle_talk !== null) && (visible[i].castle_talk > 0))
                {
                    //read out castle loc
                    var coord = visible[i].castle_talk;
                    var dict_str = '';
                    if (visible[i].id in this.partialCastleLocReceived)
                    {
                        // must be y cord, now have full loc

                        var xloc = this.partialCastleLocReceived[visible[i].id];
                        var yloc = coord;
                        this.log("**********************************************Inside-Castle: castleTalk signal received : " + String(xloc, yloc));
                        this.castleTalk(xloc);
                        
                        if (enemyCastle.includes((xloc, yloc)) == false)
                        {
                            enemyCastle.push(xloc, yloc);  
                        } 
                    } 
                    else
                    {
                        this.partialCastleLocReceived[visible[i].id] = coord;         //new castle xloc, save until know yloc  
                    }
                }
                
                if(this.me.team != visible[i].team && this.isVisible(visible[i]))
                {
                   var dist = this.squareDistance(visible[i],this.me);
                    
                    // if target in range, attack
                    if( dist <= 64)
                    {
                        this.log("Castle Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }
                    target = visible[i];
                }
            } 

            if (unitMaps[2]>this.unitCountMap[2]){  // DON'T DELETE..
                this.unitCountMap[2]++;  // DON'T DELETE...
            } // DON'T DELETE...
            // else if(unitMaps[3]>this.unitCountMap[3]){
            //     this.unitCountMap[3]++;
            // }
            else if(unitMaps[4]> this.unitCountMap[4]){
                this.unitCountMap[4]++;
            }
            else if(unitMaps[5]> this.unitCountMap[5]){
                this.unitCountMap[5]++;
            }
            
            const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
            const choice = choices[Math.floor(Math.random()*choices.length)]

            if(this.unitCountMap[2]< 4){  // DON'T DELETE...

                this.log("Building a pilgrim at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PILGRIM, choice[0], choice[1]);
            }  //... DON"T DELETE until here
             //
            
            /*
            else if(this.unitCountMap[3]< 2){

                this.log("Building a crusader at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.CRUSADER, choice[0], choice[1]);
            }
            */
            else if (this.unitCountMap[4]< 3 ){
                
                this.log("Building a prophet at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PROPHET, choice[0], choice[1]);

            }
            else if (this.unitCountMap[5]< 3){
                this.log("Building a preacher at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PREACHER, choice[0], choice[1]);
            }

            
        }
        
        else if (this.me.unit === SPECS.PILGRIM){

            this.castleTalk(this.me.x)
            this.log("pilgrim castle talk value: " + this.me.x);
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
            var karblocation = mining.findClosestResource(this,this.karbonite_map,this.map);
            var fuellocation = mining.findClosestResource(this,this.fuel_map,this.map);

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

    squareDistance(destination, start)
    {

        return Math.pow((destination.x - start.x),2) + Math.pow((destination.y - start.y),2);
    }

    getIndex(goal)
    {
        var loc = [this.me.y, this.me.x];
        var d = Move.dist(loc, goal);

        if(d < 9)        // checks to see if the bot is with in 9 square blocks of the goal location 
            index++;

        if(index > 3)   //checks to see if the bot has made it to each corner and if it does, repeat
            index = 0;
        
        return index;
    }
}

var robot = new MyRobot();