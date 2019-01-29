
import {BCAbstractRobot, SPECS} from 'battlecode';

var step = -1;

var CRUSADER_ATK_MIN = 1;
var CRUSADER_ATK_MAX = 16;
var PROPHET_ATK_MIN = 16;
var PROPHET_ATK_MAX = 64;

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
            
                    var dist = (visible[i].x - this.me.x)*(visible[i].x - this.me.x) 
                        + (visible[i].y - this.me.y)*(visible[i].y - this.me.y);
                    

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

        else if (this.me.unit === SPECS.PROPHET) {
            var visible = this.getVisibleRobots();

            var i;
            for(i in visible)
            {
                if(this.isVisible(visible[i]))
                {
                    var dist = (visible[i].x - this.me.x)*(visible[i].x - this.me.x) 
                        + (visible[i].y - this.me.y)*(visible[i].y - this.me.y);

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

        else if (this.me.unit === SPECS.CASTLE) {
            if(this.me.turn % 10 === 0)
            {
                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]

                this.log("Building a crusader at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.CRUSADER, choice[0], choice[1]);
            }
            else if(this.me.turn % 25 === 0)
            {
                const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
                const choice = choices[Math.floor(Math.random()*choices.length)]
                
                this.log("Building a prophet at " + (this.me.x+choice[0]) + ", " + (this.me.y+choice[1]));
                return this.buildUnit(SPECS.PROPHET, choice[0], choice[1]);

            }
            else {
                return 
                // this.log("Castle health: " + this.me.health);

            }
        }

    }
}

var robot = new MyRobot();
