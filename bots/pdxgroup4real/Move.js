
export class Move {
    
    static dist(destination, start){
        return Math.pow((destination[1] - start[1]),2) + Math.pow((destination[0] - start[0]),2);
    
    }

    static withInTarget(loc, goal)
    {
        //var radius = dist[loc, goal];
        var radius = Math.pow((goal[1] - loc[1]),2) + Math.pow((goal[0] - loc[0]),2);
        if(radius <= 9)
            return true;
        else
            return false;
    }

    static flip(loc)
    {
        loc[0] = loc[0]*(-1);
        loc[1] = loc[1]*(-1);

        return loc;
    }

    static inBounds(loc, map)
    {
        var bound = map.length;
        if(loc[0] >= bound || loc[0] < 0 || loc[1] >= bound || loc[1] < 0)
            return false;
        
        return true;
    }

    static isRecentMove(loc, stack)
    {
        var flag;
        var tmpStack = [];
        var i, length = stack.length-1;
        //for(i in stack)
        for(i = length; i >= 0; i--)
        {
            //var prev = stack.pop();
            //tmpStack.push(prev);
            var prev = stack[i];

            if(prev[1] == loc[0] && prev[0] == loc[1])
            {
                flag = true;
                //return false;
                break;
            }
        }

/*
        var j;
        //for(j in tmpStack)
        while(tmpStack.length != 0)
        {
            var x = tmpStack.pop();
            if(x != [])
                stack.push(x);
        }

*/
        if(flag === true)
            return true;
        else    
            return false;
    }

    static moveOffense(start, goal, grid, robotGrid, stack,fuel, unitType)
    {
        // bug algorithm
        // [1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]
        // const dirChoices = [[-1,0], [-1,-1], [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1]];
        var dirChoices;
        if(fuel > 75 && unitType === 3) //crusader type is 3
        {
            dirChoices =  [
                                [3,0],[0,-3],[-3,0],[0,3],
                                [2,0],[2,-2],[0,-2],[-2,-2],[-2,0],[-2,2],[0,2],[2,2],
                                [1,-2],[-1,-2],[-1,2],[1,2],
                                [2,-1],[-2,-1],[-2,1],[2,1],
                                [1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]
                            ];
        }
        else
        {
            dirChoices = [[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]];
        }
        //const dirChoices = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];

        const begin = start;
        var current = begin;

        var minDist = this.dist(start, goal);
        var mov = [0,0];
        var nextSpot;

        // move in direction of target
        var i;
        for(i in dirChoices)
        {
            var next = [current[0]+dirChoices[i][0], current[1]+dirChoices[i][1]];

            if(this.inBounds(next, grid) === true && grid[next[0]][next[1]] === true && robotGrid[next[0]][next[1]] === 0 )
            {
                var d = this.dist(next, goal);
                
                if(d < minDist && this.isRecentMove(next, stack) === false)
                    //&& !this.isRecentMove(begin, next, stack))
                //if(d < minDist)
                {
                    minDist = d;
                    mov = dirChoices[i];
                    nextSpot = next;
                }
            }
        }

        // hit something, move around it
        if(mov[0] === 0 && mov[1] === 0)
        {
        /*
        if(!this.inBounds(nextSpot, grid) || grid[nextSpot[0]][nextSpot[1]] === false 

           || robotGrid[nextSpot[0]][nextSpot[1]] != 0 || this.isRecentMove(begin, nextSpot, stack))
         {
             */
            var j;
            for(j in dirChoices)
            {
                var next = [current[0]+dirChoices[j][0], current[1]+dirChoices[j][1]];

                if(this.inBounds(next, grid) && grid[next[0]][next[1]] === true 
                    && robotGrid[next[0]][next[1]] === 0 && this.isRecentMove(next, stack) === false)
                    //&& !this.isRecentMove(begin, next, stack))
                {
                    mov = dirChoices[j];
                    break;
                }
            }
        }
        
        return [mov[1], mov[0]];
    }
}

export default Move


//TODO: put directions into array to shorten up code
        /*
        // s
        if(map[current[0]+1][current[1]] === true && robotMap[current[0]+1][current[1]] === 0 )
        {
            var next = [current[0]+1, current[1]];
            var d = this.dist(next, goal);
            if(d < minDist && last !== next)
            {
                minDist = d;
                mov = [1,0];
            }
        }

        // sw
        if(map[current[0]+1][current[1]-1] === true && robotMap[current[0]+1][current[1]-1] === 0  )
        {
            var next = [current[0]+1, current[1]-1];
            var d = this.dist(next, goal);
            if(d < minDist && last !== next)
            {
                minDist = d;
                mov = [1,-1];
            }
        }

        // w
        if(map[current[0]][current[1]-1] === true && robotMap[current[0]][current[1]-1] === 0 )
        {
            var next =[current[0], current[1]-1];
            var d = this.dist(next, goal);
            if(d < minDist && last !== next)
            {
                minDist = d;
                mov = [0,-1];
            }
         }

         // nw 
         if(map[current[0]-1][current[1]-1] === true && robotMap[current[0]-1][current[1]-1] === 0)
        {
            var next = [current[0]-1, current[1]-1];
            var d = this.dist(next, goal);
            if(d < minDist && last !== next)
            {
                minDist = d;
                mov = [-1,-1];
            }
        }

        // n
        if(map[current[0]-1][current[1]] === true && robotMap[current[0]-1][current[1]] === 0 )
        {
            var next =[current[0]-1, current[1]];
            var d = this.dist(next, goal);
            if(d < minDist && last !== next)
            {
                minDist = d;
                mov = [-1,0];
            }
        }

        // ne
        if(map[current[0]-1][current[1]+1] === true && robotMap[current[0]-1][current[1]+1] === 0)
        {
            var next = [current[0]-1, current[1]+1];
            var d = this.dist(next, goal);
            if(d < minDist && last !== next)
            {
                minDist = d;
                mov = [-1,1];
            }
        }

        //e
        if(map[current[0]][current[1]+1] === true && robotMap[current[0]][current[1]+1] === 0)
        {
            var next = [current[0], current[1]+1];
            var d = this.dist(next, goal);
            if(d < minDist && last !== next)
            {
                minDist = d;
                mov = [0,1];
            }
        }

        //se
        if(map[current[0]+1][current[1]+1] === true && robotMap[current[0]+1][current[1]+1] === 0)
        {
            var next = [current[0]+1, current[1]+1];
            var d = this.dist(next, goal);
            if(d < minDist && last !== next)
            {
                minDist = d;
                mov = [1,1];
            }
        }

        stack.push(last);
        stack.push([mov[1], mov[0]]);
        
        return [mov[1], mov[0]];
        */

