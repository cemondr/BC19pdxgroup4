import { expect } from 'chai';
import 'mocha';
import {Move} from './Move';
import {mining} from './mining';
import {unitbuilding} from './unitbuilding';
import {pilgrimNavigation} from './pilgrimNavigation';


describe('Move tests', () => {
	it('return 8', () => {
    	expect(Move.dist([4,4], [2,2])).to.equal(8);
	});

	it('returns 0', () => {
		expect(Move.dist([2,2], [2,2])).to.equal(0);
	});
	
	var map = [[0,0,0],[0,0,0],[0,0,0]];
	it('returns true', () => {
		expect(Move.inBounds([1,2], map)).to.be.true;
	});
	
	it('returns false', () => {
		expect(Move.inBounds([4,3], map)).to.be.false;
	});
	
	var stack = [[0,0],[0,0],[0,0]];
	it('returns false', () => {
		expect(Move.isRecentMove([1,2], stack)).to.be.false;
	});
	
	it('returns true', () => {
		expect(Move.isRecentMove([0,0], stack)).to.be.true;
	});

	var grid = [[true,true,true],[true,true,true],[true,true,true]];
	var fuel = 100;
	it('returns [1,1]', () => {
		expect(Move.moveOffense([0,0],[1,1], grid, map, stack,fuel,1)).to.equal([1,1]);
	});
	
	it('returns [2,0]', () => {
		expect(Move.moveOffense([0,0],[0,4], grid, map, stack,fuel,3)).to.equal([2,0]);
	});

	it('returns true', () => {
		expect(Move.withInTarget([4,4], [2,2])).to.equal(true);
	});

	it('returns false', () => {
		expect(Move.withInTarget([14,14], [2,2])).to.equal(false);
	});

});

describe('mining Tests', function() {
	var src = {'x': 2, 'y': 2}
	var dest = {'x': 4,'y': 4}
	
	it('returns (4-2)^2 + (4-2)^2 = 8', () => {
		expect(mining.squareDistance(dest, src)).to.equal(8);
	});
	
	var robot = {'me': {fuel: 0, karbonite: 0} }
	var robot2 = {'me': {fuel: 10, karbonite: 10} }
	it('returns false', () => {
		expect(mining.checkIfResourcesFull(robot, 10, 10)).to.be.false;
	});
	
	it('returns true', () => {
		expect(mining.checkIfResourcesFull(robot2, 10, 10)).to.be.true;
	});
	
	var fuelMap = [[false,false,false,false],[false,false,false,false],[false,false,false,false]];
	var karbMap = [[false,false,false,false],[false,false,false,false],[false,false,false,false]];
	var robot = {'me': {x: 0, y: 0} }
	it('returns 2', () => {
		expect(mining.countResources(robot, fuelMap, karbMap)).to.equal(2);
	});
	
	fuelMap = [[false,true,false,false],[false,false,false,false],[false,false,false,false]];
	karbMap = [[false,false,true,false],[false,false,false,false],[false,false,false,false]];
	robot = {'me': {x: 1, y: 1} }
	it('returns 2', () => {
		expect(mining.countResources(robot, fuelMap, karbMap)).to.equal(2);
	});
	
	var fuelLoc = [1,1];
	var karbLoc = [0,0];
	robot = {'me': {x: 2, y: 2, karb: 0, fuel: 0} }
	it('returns false', () => {
		expect(mining.readyToMine(robot, karbLoc, fuelLoc)).to.be.false;
	});
	
	robot = {'me': {x: 0, y: 0, karb: 0, fuel: 1000} }
	it('returns false', () => {
		expect(mining.readyToMine(robot, karbLoc, fuelLoc)).to.be.false;
	});
	
	robot = {'me': {x: 1, y: 1, karb: 1000, fuel: 0} }
	it('returns false', () => {
		expect(mining.readyToMine(robot, karbLoc, fuelLoc)).to.be.false;
	});
	
	var robot3 = {'me': {x: 1, y: 1} }
	var minemap = [[true,false,false,false],[false,false,false,false],[false,false,false,false]];
	var terrainmap = [[true,false,false,false],[false,false,false,false],[false,false,false,false]];
	var result = {x: 0, y: 0};
	it('returns [0,0]', () => {
		expect(mining.findClosestResource(robot3, minemap, terrainmap)).to.equal(result);
	});
	
	
	var _robot = {'me': {team: 'b', x: 1, y: 1} };
	var _robot2 = {team: 'b', unit: 1, x: 10, y: 10};
	var _robot3 = {team: 'b', unit: 2, x: 10, y: 10 };
	var _robot4 = {team: 'b', unit: 3, x: 10, y: 10 };
	var _robot5 = {team: 'b', unit: 4, x: 10, y: 10 };
	var _robot6 = {team: 'b', unit: 5, x: 10, y: 10 };
	var _robot7 = {team: 'b', unit: 0 ,x: 1, y: 0};
	var visibleRobots = [_robot2,_robot3,_robot4,_robot5,_robot6,_robot7];
	it('returns _robot7', () => {
		expect(mining.returnTargetDump(_robot,visibleRobots)).to.equal(_robot7);
	});
	
	var goalx = 1;
	var goaly = 0;
	
	it('returns true', () => {
		expect(mining.checkIfOccupied(goalx,goaly,robot,visibleRobots)).to.equal(true);
	});
	
	var goaly2 = 1;
	it('returns false', () => {
		expect(mining.checkIfOccupied(goalx,goaly2,robot,visibleRobots)).to.equal(false);
	});
	
});


describe('pilgrimNavigation Tests', function() {

	var robot = {'me': {x: 10, y: 10} }
	var goal = {x: 0, y: 0}
	var end = {x: -1, y: -1} 

	it('returns -1,-1', () => {
		expect(pilgrimNavigation.getDirection(robot, goal)).to.equal(end);
	});
	
	var robot2 = {'me': {x: 0, y: 0} }
	var goal2 = {x: 0, y: 0}
	var end2 = {x: 0, y: 0} 
	it('returns 0,0', () => {
		expect(pilgrimNavigation.getDirection(robot2, goal2)).to.equal(end2);
	});
	
	var robot3 = {'me': {x: 0, y: 0} }
	var goal3 = {x: 10, y: 10}
	var end3 = {x: 1, y: 1} 
	it('returns 1,1', () => {
		expect(pilgrimNavigation.getDirection(robot3, goal3)).to.equal(end3);
	});
	
	var robot4 = {'me': {x: 0, y: 5} }
	var goal4 = {x: 5, y: 0}
	var end4 = {x: 1, y: -1} 

	it('returns 1,-1', () => {
		expect(pilgrimNavigation.getDirection(robot4, goal4)).to.equal(end4);
	});
	
	var robot5 = {'me': {x: 5, y: 0} }
	var goal5 = {x: 0, y: 5}
	var end5 = {x: -1, y: 1} 

	it('returns -1,1', () => {
		expect(pilgrimNavigation.getDirection(robot5, goal5)).to.equal(end5);
	});
	
	var _robot = {'me': {team: 'b', x: 1, y: 1, karbonite: 0, fuel: 0} };
	var _robot2 = {team: 'b', unit: 1, x: 10, y: 10};
	var _robot3 = {team: 'b', unit: 2, x: 10, y: 10 };
	var _robot4 = {team: 'b', unit: 3, x: 10, y: 10 };
	var _robot5 = {team: 'b', unit: 4, x: 10, y: 10 };
	var _robot6 = {team: 'b', unit: 5, x: 10, y: 10 };
	var _robot7 = {team: 'b', unit: 0 ,x: 1, y: 0};
	var fueLocation = {x: 0, y: 0};
	var karbLocation = {x: 1, y: 1};
	var visibleRobots = [_robot2,_robot3,_robot4,_robot5,_robot6,_robot7];
	it('returns [1,1]', () => {
		expect(pilgrimNavigation.getGoal(_robot,fueLocation,karbLocation,visibleRobots)).to.equal(karbLocation);
	});
	
	var terrainMap = [[true,true,true,true],[true,true,true,true],[true,true,true,true]];
	var dest = {x: 0, y: 0}  
	
	it('returns [-1,-1]', () => {
		expect(pilgrimNavigation.dealWithImpassibleTerrain(_robot,dest,terrainMap)).to.equal([-1,-1]);
	});
	
	var visibleRobots2 = [];
	var fueLocation = [1,1];
	var karbLocation = [0,0];
	
	it('returns [0,0]', () => {
		expect(pilgrimNavigation.pilgrimMove(_robot,fueLocation,karbLocation,visibleRobots2,terrainMap)).to.equal([0,0]);
	});
	
	var fueLocation2 = [2,2];
	var karbLocation2 = [0,0];
	
	it('returns [0,0]', () => {
		expect(pilgrimNavigation.pilgrimMove(_robot,fueLocation2,karbLocation2,visibleRobots2,terrainMap)).to.equal([0,0]);
	});
	
	var fueLocation3 = [2,2];
	var karbLocation3 = [5,5];
	
	it('returns [0,0]', () => {
		expect(pilgrimNavigation.pilgrimMove(_robot,fueLocation3,karbLocation3,visibleRobots2,terrainMap)).to.equal([0,0]);
	});
	
});

describe('unitbuilding Tests', function() {

	it('returns 0', () => {
		expect(unitbuilding.checkPilgrimCount()).to.equal(0);
	});
	
	it('returns 1', () => {
		expect(unitbuilding.incrementPilgrimCount()).to.equal(1);
	});
	var robot = {'me': {team: 'b'} };
	var robot2 = {team: 'b', unit: 1 };
	var robot3 = {team: 'b', unit: 2 };
	var robot4 = {team: 'b', unit: 3 };
	var robot5 = {team: 'b', unit: 4 };
	var robot6 = {team: 'b', unit: 5 };
	var robot7 = {team: 'b', unit: 0 };
	var robotlist = [robot2,robot3,robot4,robot5,robot6,robot7];
	
	it('returns [1,1,1,1,1,1]', () => {
		expect(unitbuilding.buildUnitMap(robot, robotlist)).to.equal([1,1,1,1,1,1]);
	});
	
});
