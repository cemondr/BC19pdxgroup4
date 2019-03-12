import { expect } from 'chai';
import 'mocha';
import {Move} from './Move';
import {mining} from './mining';
import {unitbuilding} from './unitbuilding';
import {pilgrimNavigation} from './pilgrimNavigation';

describe('Move', () => {
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
	it('returns [1,1]', () => {
		expect(Move.moveOffense([0,0],[1,1], grid, map, stack)).to.equal([1,1]);
	});

<<<<<<< HEAD
	it('returns 8', () => {
		expect(Move.withInTarget([4,4], [2,2])).to.equal(8);
	});

=======
>>>>>>> master
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
	
	/*
	var map
	var karb = [0,0];
	var fuel = [1,1];
	var robot4 = {'me': {x: 0, y: 0, map: [[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]}, getVisibleRobots(){return me.map} }
	var end4 = [0,0];
	it('returns 1,1', () => {
		expect(pilgrimNavigation.getGoal(robot, fuel, karb)).to.equal(end4);
	});
*/
});

describe('unitbuilding Tests', function() {

	it('returns 0', () => {
		expect(unitbuilding.checkPilgrimCount()).to.equal(0);
	});
	
	it('returns 1', () => {
		expect(unitbuilding.incrementPilgrimCount()).to.equal(1);
	});
});
