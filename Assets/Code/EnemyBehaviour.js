#pragma strict

var mainPlayer : GameObject;
var speed : double;
var melee : double;
var maxFollowDistance : double;
var destroyable = 1;
var health = 3;
var seePlayer;
var isFollowingPath : boolean;
var path : PathDefinition;

function Start () {
	mainPlayer = GameObject.Find("Player");
	seePlayer = false;
	
	//Find the object for the path
	var pathObject = FindClosestPath();
	if(pathObject != null)
		path = pathObject.GetComponent("PathDefinition") as PathDefinition;
	else if(isFollowingPath)
		print("Enemy is trying to follow Path but no path to be found, did you remember to tag the path?");
}


//returns the closest gameObject tagged as Path
function FindClosestPath () : GameObject 
{
		// Find all game objects with tag Path
		var gos : GameObject[];
		gos = GameObject.FindGameObjectsWithTag("Path"); 
		var closest : GameObject; 
		var distance = Mathf.Infinity; 
		var position = transform.position; 
		// Iterate through them and find the closest one
		for (var go : GameObject in gos)  { 
			var diff = (go.transform.position - position);
			var curDistance = diff.sqrMagnitude; 
			if (curDistance < distance) { 
				closest = go; 
				distance = curDistance; 
			} 
		}
		return closest;	
}

function FixedUpdate () {
	
	seePlayer = canISeePlayer();
	if(seePlayer) attackPlayer();
	else if(isFollowingPath) followPath();	
}

function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag == "Player")
			Destroy(other.gameObject);
	}
	
function gotHit(){
	health--;
	if(health < 1)
	{
		Destroy(gameObject);
	}
}

// returns Vector3 that is the position he should move towards if he is following path
function getPathPoint()
{
	return path.getNextPosition(transform.position);
}

function canISeePlayer()
{
	var vecToPlayer = Vector3(0,0,0);
	if(mainPlayer!=null)
		vecToPlayer =  mainPlayer.transform.position - transform.position;
	
	var angleToPlayer : float = Vector3.Angle(vecToPlayer, transform.up);
	
	if(angleToPlayer < 20.0)
	{
		return true; 
	}
	else
	{
		return false;
	}
}


function attackMelee()
{
	return;
}


function attackPlayer()
{
	var vecToPlayer = Vector3(0,0,0);
	if(mainPlayer!=null)
		vecToPlayer =  mainPlayer.transform.position - transform.position;

	if(vecToPlayer.magnitude > maxFollowDistance)
		return;
	
	if(vecToPlayer.magnitude < melee)
	{
		attackMelee();
		return;
	}
			
	var direction = vecToPlayer.normalized;
	//Get player position
	var playerPos = mainPlayer.transform.position;
	//Calculate the rotation in radians using trigometry
	var AngleRad = Mathf.Atan2(playerPos.y - transform.position.y, playerPos.x - transform.position.x);
	//convert it to degrees, we subtract 180 because of it's original rotation
    var AngleDeg = (180 / Mathf.PI) * AngleRad - 90;
    //set the rotation
    transform.rotation = Quaternion.Euler(0, 0, AngleDeg);
	
	//Stop the guy from spinning
	rigidbody2D.angularVelocity = 0;
	
	rigidbody2D.AddForce(direction*speed);
}

function followPath()
{
	var pathPoint = getPathPoint();
	var vecToPath =  pathPoint - transform.position;
			
	var direction = vecToPath.normalized;
	
	
	var AngleRad = Mathf.Atan2(vecToPath.y, vecToPath.x);
	//convert it to degrees, we subtract 180 because of it's original rotation
    var AngleDeg = (180 / Mathf.PI) * AngleRad - 90;
    //set the rotation
    transform.rotation = Quaternion.Euler(0, 0, AngleDeg);
	
	//Stop the guy from spinning
	rigidbody2D.angularVelocity = 0;
	
	direction.z=0;
	rigidbody2D.AddForce(direction*speed);
}