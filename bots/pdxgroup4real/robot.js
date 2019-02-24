import {BCAbstractRobot, SPECS} from 'battlecode';
import {Move} from './Move.js';
import {mining} from './mining.js'
import {unitbuilding} from './unitbuilding.js'
import {pilgrimNavigation} from './pilgrimNavigation.js';


var step = -1;

//const moveChoices = [[0,1], [1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1]];

var PROPHET_ATK_MIN = 16;
var PROPHET_ATK_MAX = 64;

var index = 0;
var flag = false;
var enemyCastle = [];
var pendingCastleLoc = null ;//have to send over two turs, this is for when we have only sent half a castle loc...castle talk
var partialCastleLocReceived = {};

class MyRobot extends BCAbstractRobot {
    constructor(){
        super();

        this.stack= [[0,0]];
        this.unitCountMap = [0,0,0,0,0,0];  //cem code
        this.isPilgrimKarb = 1;             //cem code
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
                if (visible[i].signal != -1)   //If robot doesn't sent any signal
                {
                    //read out castle loc
                    this.log("preacher visible robot signal: " + visible[i].signal);
                    var loc = [(visible[i].signal % 2**8, Math.floor(visible[i].signal >> 8))];  // 2**8 because we are reading 8 bits of x and y coorinates.
                    //var loc = (visible[i].x, visible[i].y);
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
                         // need to cram two numbers < 64 into 16 bit.
                         // in the form of 00yyyyyy00xxxxxx
                            
                            var message = visible[i].y << 4 + visible[i].x;
                            this.log("message: " + message)
                            var maxx = Math.max(this.me.x, 63 - this.me.x);
                            
                            var maxy = Math.max(this.me.y, 63 - this.me.y);
                            this.log("preacher maxx, maxy: " + (maxx + maxy));
                            this.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!max : " +Math.pow(maxx,2) + Math.pow(maxy,2))
                            this.signal(message, Math.pow(maxx, 2) + Math.pow(maxy, 2));
                            this.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11111!!!!!!!.........PREACHER IS signaling castle loc :" + String((visible[i].x, visible[i].y)));
                            //this.log("signal value: " + (maxx**2 + maxy**2));
                            this.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!....Sent message to castle.....!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                            
                        }
                        this.log("Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }

                    target = visible[i];
                }
            }
            // no visible enemies, move to opposite corner
            var robotMap = this.getVisibleRobotMap();
            this.log("preacher map length : " + map.length)
            var dirChoices = [[9,9],[9,map.length-8],[map.length-8,map.length-9],[map.length-9,8]];
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
            this.log("moving toword: " + mov);
            
            return this.move(...mov);
        }


        else if (this.me.unit === SPECS.PROPHET) {
            var visible = this.getVisibleRobots();
            var map = this.getPassableMap();
            var target = 0;

            var i;
            for(i in visible)
            {
                //this.log("probhet visible robot: "  + visible[i]);
                if (visible[i].signal != -1)
                {
                    //read out castle loc
                    var loc = [(visible[i].signal % 2**8, visible[i].signal >> 8)];  // 2**8 brcause we are reading 8 bits of x and y coorinates.
                    this.log("Phophet signal received : " + String(loc));
                }

                if(this.me.team != visible[i].team && this.isVisible(visible[i]))
                {
                   var dist = this.squareDistance(visible[i],this.me);
                    
                    // if target in range, attack
                    if( dist <= PROPHET_ATK_MAX && dist >= PROPHET_ATK_MIN)
                    {
                        var cord = (visible[i].x, visible[i].y);
                        if ((visible[i].unit == 0) && (enemyCastle.includes(cord) == false))
                        {
                         // need to cram two numbers < 64 into 16 bit.
                         // in the form of 00yyyyyy00xxxxxx
                            
                            var message = visible[i].y << 4 + visible[i].x;
                            this.log("message" + message);
                            var maxx = Math.max(this.me.x, 63 - this.me.x);
                            var maxy = Math.max(this.me.y, 63 - this.me.y);
                            this.signal(message, Math.pow(maxx, 2) + Math.pow(maxy, 2));
                            this.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11111!!!!!!!.........PROPHET is signaling castle yloc :" + String((visible[i].x, visible[i].y)));
                            //this.log("signal value: " + (maxx**2 + maxy**2));
                            this.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!....Sent message to castle.....!!!!!!!!!!!!!!!!!!!!!!!!!!!111");
                            
                        }
                        this.log("Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }
                    
                    // seen but not in att range
                    target = visible[i];
                    
                        //found enemy castle! tell whole team.

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
            this.log("prophet stack" + this.stack);



            this.log("moving: " + mov);
            
            return this.move(...mov);
        }
        
        //CASTLE
        else if (this.me.unit === SPECS.CASTLE) {
        
            var visible = this.getVisibleRobots();
            var map = this.getPassableMap();
            var target = 0;

            var i;

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
            // else if(this.unitCountMap[3]< 2){

            //     this.log("Building a crusader at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
            //     return this.buildUnit(SPECS.CRUSADER, choice[0], choice[1]);
            // }
            else if (this.unitCountMap[4]< 1 ){
                
                this.log("Building a prophet at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PROPHET, choice[0], choice[1]);

            }
            else if (this.unitCountMap[5]<1){
                this.log("Building a preacher at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PREACHER, choice[0], choice[1]);
            }

            for(i in visible)
            {

                if ((visible[i].castleTalk !== null) && (visible[i].castleTalk > 0))
                {
                    //read out castle loc
                    var coord = visible[i].castleTalk;
                    if (visible[i].id in this.partialCastleLocReceived)
                    {
                        // must be y cord, now have full loc
                        this.log("?????????????????????????????????????????????????????????????partial castle: " + this.partialCastleLocReceived);
                        var xloc = this.partialCastleLocReceived(visible[i].id);
                        var yloc = coord;
                        this.log("*************************************************Inside Castle castleTalk signal received : " + String(xloc, yloc));
                        if (this.enemyCastle.includes((xloc, yloc)) == false)
                        {
                            this.enemyCastle.push(xloc, yloc);
                            this.log("array enemyCastle: " + this.enemyCastle);
                        } 
                    } 
                    else
                    {
                    // new castle xloc, save until know yloc
                        this.partialCastleLocReceived[visible[i].id] = coord

                    }
                }
                if(this.me.team != visible[i].team && this.isVisible(visible[i]))
                {
                   var dist = this.squareDistance(visible[i],this.me);
                    
                    // if target in range, attack
                    if( dist <= 64)
                    {
                        var cord = (visible[i].x, visible[i].y)
                        if ((visible[i].unit == 0) && (this.enemyCastle.includes(cord) == false))
                        {
                            this.enemyCastle.push(cord)
                            if (this.pendingCastleLoc != null)
                            {
                                
                                this.log("************************************************************************************signaling castle Talk yloc :" + String(this.pendingCastleLoc));
                                this.castleTalk(this.pendingCastleLoc);
                                this.pendingCastleLoc = null;
                            }
                            this.log("***********************************************************************************8*****signaling castle Talk xloc :" + String((visible[i].x, visible[i].y)));
                            this.castleTalk(visible[i].x);
                            this.pendingCastleLoc = visible[i].y
                            
                        }
                        // var xloc = i.castleTalk;
                        // this.log("***************************************************************************************************************************Castle talk Signal Received: " + String(xloc));
                        this.log("Castle Attacking: " + visible[i].id);
                        return this.attack(visible[i].x - this.me.x, visible[i].y - this.me.y);
                    }

                    target = visible[i];
                }
            }

            
        }
        
        
        else if (this.me.unit === SPECS.PILGRIM){
        
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

        if(d < 9)    // checks to see if the bot is with in 9 square blocks of the goal location 
            index++;

        if(index > 3)  //checks it see if the bot has made it to each corner and if it does, repeat
            index = 0;
        
        return index;
    }
}


var robot = new MyRobot();