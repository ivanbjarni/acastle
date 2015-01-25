#pragma strict

var points : Transform[];
enum FollowTypes { ThereAndBack, Loop };
var followType : FollowTypes;
var atPoint=0;
var maxDistFromPoint=0.1;
var direction = 1;

function Start () {
}

function Update () {

}

// Input: position of path follower as Vector3
// Output: position he should be moving towards
function getNextPosition(positionOfFollower : Vector3)
{
	//if there are no or just 1 point just return the current position
	if(!points || points.length<2)
		return positionOfFollower;
	
	positionOfFollower.z=0;
	points[atPoint].position.z=0;
	//if we are close enough to the position we were going for, find a new one
	if((positionOfFollower-points[atPoint].position).magnitude < maxDistFromPoint)
		increment();
	
	//return the position of the point we want to go towards
	return points[atPoint].position;
}

//Updates the atPoint when a new point is needed
function increment()
{
	if( atPoint==points.length-1 && followType==FollowTypes.Loop)
		{atPoint = 0; return;}
		
	if( atPoint==points.length-1 && followType==FollowTypes.ThereAndBack)
		direction = -1;
		
	if( atPoint==0 && followType==FollowTypes.ThereAndBack)
		direction = 1;
		
	atPoint += direction;
}


//draw the lines on the scene editor
function OnDrawGizmos() 
{	
	//if we have 0 or 1 points we don't want to draw anything
	if(!points || points.length<2)
		return;
	
	// draw lines through the points to appear in the scene editor
	for(var i=1; i<points.length;i++)
	{
		Gizmos.DrawLine(points[i-1].position, points[i].position);
	}
	
	//if the followtype is loop then connect the first and last point
	if(followType == FollowTypes.Loop && points.length>2)
	{
		Gizmos.DrawLine(points[0].position, points[points.length-1].position);
	}
}