
import {BCAbstractRobot, SPECS} from 'battlecode';
import {Move} from './Move.js';
//const Move = import('Move');
import {mining} from './mining.js'
import {unitbuilding} from './unitbuilding.js'
import {pilgrimNavigation} from './pilgrimNavigation.js';

var step = -1;
var CRUSADER_ATK_MIN = 1;
var CRUSADER_ATK_MAX = 16
var PROPHET_ATK_MIN = 16;
var PROPHET_ATK_MAX = 64;
const TRAIL = 30;

var enemyCastle = [];
var pendingCastleLoc = null ;   //have to send over two turns, this is for when we have only sent half a castle loc...castle talk


class MyRobot extends BCAbstractRobot {
    constructor(){
        super();

        this.stack= [[0,0]];
        this.unitCountMap = [0,0,0,0,0,0];  
        this.isPilgrimKarb = 1;             
        this.partialCastleLocReceived = {}
        this.pilgrimStack = [{}];
        this.dest = null;
        this.flip = false;
    }

    turn() {
        step++;
        var MAP = this.map;

        if (this.me.unit === SPECS.CRUSADER) {
            
            var visible = this.getVisibleRobots();
            var map = this.getPassableMap();
            var target = 0;
            var castle = 0;
            var count = 0;

            var i;
            for(i in visible)
            {
                if(this.me.team == visible[i].team )
                {
                    if(visible[i].unit === SPECS.CRUSADER)
                    count++;

                    if(visible[i].unit === SPECS.CASTLE)
                        castle = visible[i];
                }

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
           var start = [this.me.y, this.me.x];
           var end = [];

           
           // buddy system, needs 1 other crusader to move
           if(count < 2 )
           {
               this.log("DEFENDING!!!!!!");
               var mov = [0,0];

               // leave room for pilgrims to mine and castle to build
               if(castle !== 0 && this.squareDistance(castle, this.me) < 5)
               {
                   const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                   const choice = choices[Math.floor(Math.random()*choices.length)]
                   mov = choice;
                   return this.move(...mov);
               }

               // create grid to allow movement between stationary units
               if(this.me.x % 2 != 0 || this.me.y % 2 != 0)
               {
                   const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                   const choice = choices[Math.floor(Math.random()*choices.length)]
                   mov = choice;
                   return this.move(...mov);
               }

               return this.move(...mov)
           }
           

           this.log("RUSH!!!!!!!!!!!!!!");

           // if unit has no destination
           if(this.dest === null)
            {
                var tmp = 0;
                // check reflectivity and set destination to other side of map
                if(this.isHorizontal(map))
                {
                    tmp = Math.abs(map.length-1 - this.me.x);
                    this.dest = [this.me.y, tmp];
                }
                else
                {
                    
                    tmp = Math.abs(map.length-1 - this.me.y);
                    this.dest = [tmp, this.me.x];
                }
            }
            // if close enough to target location, calculate new one
            // will use opposite reflection of before
            // ex: head toward horizontal reflection then vertical
            else if(Move.withInTarget(start, this.dest) === true)
            {
                this.flip = true;
                var tmp = 0;
                if(this.isHorizontal(map))
                {
                    tmp = Math.abs(map.length-1 - this.me.y);
                    this.dest = [tmp, this.me.x];
                }
                else
                {
                    tmp = Math.abs(map.length-1 - this.me.x);
                    this.dest = [this.me.y, tmp];   
                    
                }
            }
           
            // if no enemy in sight, head toward destination
           if(target === 0)
               end = this.dest;
           else
               end = [target.y, target.x];
           
           this.tmpStack = this.stack;
           var mov = Move.moveOffense(start, end, map, robotMap, this.tmpStack,this.fuel,SPECS.CRUSADER);
           if(this.stack.length > TRAIL)
               this.stack.shift();

           var nl = [mov[0]+start[1],mov[1]+start[0]];
           this.stack.push(nl);
           this.log(this.stack);

           this.log("moving: " + mov);
           
           return this.move(...mov);
        }
        else if (this.me.unit === SPECS.PREACHER) {
            var visible = this.getVisibleRobots();
            var map = this.getPassableMap();
            var target = 0;
            var castle = 0;

            var i;
            
            for(i in visible)
            {
                if(this.me.team == visible[i].team && visible[i].unit === SPECS.CASTLE)
                {
                    castle = visible[i];
                }
                
                if(this.me.team != visible[i].team && this.isVisible(visible[i]))
                {
                   var dist = this.squareDistance(visible[i],this.me);
                   
                    // if target in range, attack
                    if( dist <= 16)
                    {
                        this.log("Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }
                    // seen but not in att range
                    target = visible[i];
                }
            }

            // Attack
            /*
                this.log("RUSH!!!!!!!!!!!!!!");
                // rush
                var robotMap = this.getVisibleRobotMap();
                var start = [this.me.y, this.me.x];
                var end = [];
    
                if(this.dest === null)
                {
                    var tmp = 0;
                    if(this.isHorizontal(map))
                    {
                        tmp = Math.abs(map.length-1 - this.me.x);
                        this.dest = [this.me.y, tmp];
                    }
                    else
                    {
                        
                        tmp = Math.abs(map.length-1 - this.me.y);
                        this.dest = [tmp, this.me.x];
                    }
                }
                else if(Move.withInTarget(start, this.dest) === true)
                {
                    this.flip = true;
                    var tmp = 0;
                    if(this.isHorizontal(map))
                    {
                        tmp = Math.abs(map.length-1 - this.me.y);
                        this.dest = [tmp, this.me.x];
                    }
                    else
                    {
                        tmp = Math.abs(map.length-1 - this.me.x);
                        this.dest = [this.me.y, tmp];   
                        
                    }
                }
                
                if(target === 0)
                    end = this.dest;
                else
                    end = [target.y, target.x];
                
                this.tmpStack = this.stack;
                var mov = Move.moveOffense(start, end, map, robotMap, this.tmpStack,this.fuel,SPECS.PREACHER);
                if(this.stack.length > TRAIL)
                    this.stack.shift();
    
                var nl = [mov[0]+start[1],mov[1]+start[0]];
                this.stack.push(nl);
                this.log(this.stack);
    
    
    
                this.log("moving: " + mov);
                
                return this.move(...mov);
*/
            // defend the castle
                this.log("DEFENDING!!!!!!");
                var mov = [0,0];

                 // leave room for pilgrims to mine and castle to build
                if(castle !== 0 && this.squareDistance(castle, this.me) < 5)
                {
                    const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                    const choice = choices[Math.floor(Math.random()*choices.length)]
                    mov = choice;
                    return this.move(...mov);
                }

                 // create grid to allow movement between stationary units
                if(this.me.x % 2 != 0 || this.me.y % 2 != 0)
                {
                    const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                    const choice = choices[Math.floor(Math.random()*choices.length)]
                    mov = choice;
                    return this.move(...mov);
                }

                return this.move(...mov)

        }

        else if (this.me.unit === SPECS.PROPHET) {

            var visible = this.getVisibleRobots();
            var map = this.getPassableMap();
            var target = 0;
            var castle = 0;

            var i;
            for(i in visible)
            {
                if(this.me.team == visible[i].team && visible[i].unit === SPECS.CASTLE)
                {
                    castle = visible[i];
                }
                
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

            // attack
        /*
           var robotMap = this.getVisibleRobotMap();
           var start = [this.me.y, this.me.x];
           var end = [];

           if(this.dest === null)
            {
                var tmp = 0;
                if(this.isHorizontal(map))
                {
                    tmp = Math.abs(map.length-1 - this.me.x);
                    this.dest = [this.me.y, tmp];
                }
                else
                {
                    
                    tmp = Math.abs(map.length-1 - this.me.y);
                    this.dest = [tmp, this.me.x];
                }
            }
            else if(Move.withInTarget(start, this.dest) === true)
            {
                this.flip = true;
                var tmp = 0;
                if(this.isHorizontal(map))
                {
                    tmp = Math.abs(map.length-1 - this.me.y);
                    this.dest = [tmp, this.me.x];
                }
                else
                {
                    tmp = Math.abs(map.length-1 - this.me.x);
                    this.dest = [this.me.y, tmp];   
                    
                }
            }
           
           if(target === 0)
               end = this.dest;
           else
               end = [target.y, target.x];
           
           this.tmpStack = this.stack;
           var mov = Move.moveOffense(start, end, map, robotMap, this.tmpStack,this.fuel,SPECS.PROPHET);
           if(this.stack.length > TRAIL)
               this.stack.shift();

           var nl = [mov[0]+start[1],mov[1]+start[0]];
           this.stack.push(nl);
           this.log(this.stack);



           this.log("moving: " + mov);
           
           return this.move(...mov);
        */

                // leave room for pilgrims to mine and castle to build
                this.log("DEFENDING!!!!!!");
                var mov = [0,0];
                if(castle !== 0 && this.squareDistance(castle, this.me) < 5)
                {
                    const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                    const choice = choices[Math.floor(Math.random()*choices.length)]
                    mov = choice;
                    return this.move(...mov);
                }

                // create grid to allow movement between stationary units
                if(this.me.x % 2 != 0 || this.me.y % 2 != 0)
                {
                    const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                    const choice = choices[Math.floor(Math.random()*choices.length)]
                    mov = choice;
                    return this.move(...mov);
                }

                return this.move(...mov)
        }
        //CASTLE
        else if (this.me.unit === SPECS.CASTLE) {
            var unitMaps = unitbuilding.buildUnitMap(this); // DONT DELETE... (... means more lines coming)
            var visible = this.getVisibleRobots();
            var map = this.getPassableMap();
            var target = 0;

            var resourceCount = mining.countResources(this,this.fuel_map,this.karbonite_map);
             for(i in visible)
            {
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

            if(this.unitCountMap[2]< resourceCount){  // DON'T DELETE...

                this.log("Building a pilgrim at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PILGRIM, choice[0], choice[1]);
            }  //... DON"T DELETE until here
            else
            {
                this.log("Building a crusader at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.CRUSADER, choice[0], choice[1]);
            }
        }
        
        else if (this.me.unit === SPECS.PILGRIM){

            this.castleTalk(this.me.x)
            //this.log("pilgrim castle talk value: " + this.me.x);

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

    isHorizontal(map)
    {
        var i = 0;
        var len = map.length;
        for(i = 0; i < len; i++)
        {
            if(map[i][10] !== map[i][len-11])
                return false;
        }

        return true;
    }
}

var robot = new MyRobot();