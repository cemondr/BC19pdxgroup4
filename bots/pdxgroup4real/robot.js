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
            else {
                return // this.log("Castle health: " + this.me.health);
            }
        }

        /* pilgrim currently checks whether it is at a karbonite location. If it is,it starts mining. 
        Otherwise it starts to move randomly until it lands on a karbonite grid*/
        else if (this.me.unit === SPECS.PILGRIM){

            var karblocation = this.getClosestKarb(this.me,this.getKarboniteMap());
            if (karblocation){
                
                if (this.squareDistance(karblocation,this.me)=== 0){
                    
                    /*THE REPLAY ON BATTLECODE SITE DOESN'T DISPLAY KARONITE CORRECTLY SO
                    THIS IS A GOOD WAY TO TEST THE PILGRIM KARBONITE LEVEL

                    this.log("My Karbonite: " + this.me.karbonite);
                    this.log("--------------------I AM MINING---------------------------");
            
                    */
                    return this.mine();
                }
                
            }
            const choices = [[0,-2], [2, -2], [2, 0], [2, 2], [0, 2], [-2, 2], [-2, 0], [-2, -2]];
            const choice = choices[Math.floor(Math.random()*choices.length)]
            return this.move(...choice);
        }

    }


    getClosestKarb(robot,map){
        const maplength = map.length;
        let destlocation = null;
        let destdistance = 1000000;
        for(let y = 0; y<maplength; y++){
            for (let x = 0; x<maplength; x++){
                if (map[y][x] && this.squareDistance({x,y},robot)<destdistance){

                    destdistance = this.squareDistance({x,y},robot);
                    destlocation = {x,y};
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
