#pragma strict

var mainPlayer : GameObject;
var speed : float;
var melee : double;
var maxFollowDistance : double;
var destroyable = 1;
var health = 3;
var seePlayer;
var isFollowingPath : boolean;
var path : PathDefinition;
var myLayerMask : LayerMask;

// Tells you if enemy is dead
var isDead : boolean = false;
var deathTime : float = 3;

var animator : Animator;

// For kneel before the king
var isKneeling : boolean = false;

var bloodPart : ParticleSystem;

function Start () {
	mainPlayer = GameObject.Find("Player");
	seePlayer = false;
	
	animator =  GetComponent("Animator") as Animator;
	
	bloodPart = transform.Find("BloodParticles").GetComponent(ParticleSystem);
	
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

function kneel(kneelSpeed : float ){
	isKneeling = true;
	bloodPart.Play();
	speed = kneelSpeed;
}

function FixedUpdate () {
	if( isDead ){
		deathTime -= 0.016;
		if( deathTime < 0 ){
			bloodPart.Stop();
			Destroy(gameObject);
		}
		
		animator.SetBool("isDead", isDead);
		return;
	}
	
	rigidbody2D.angularVelocity = 0;
	seePlayer = canISeePlayer();
	if(seePlayer) attackPlayer();
	else if(isFollowingPath) followPath();	
	
	
	animator.SetFloat("Speed", Mathf.Abs(rigidbody2D.velocity.magnitude));
}

function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag == "Player"){
			var player : PlayerBehaviour = mainPlayer.GetComponent(PlayerBehaviour);
			player.collisionWithEnemy(gameObject);
		}
}
	
function gotHit(){
	health--;
	bleed();
	if(health < 1)
	{
		isDead = true;
	}
}

function bleed(){
	bloodPart.Play();
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
	
	
	if(angleToPlayer > 50.0) return false;
	
	
	//var hit : RaycastHit2D = Physics2D.Raycast(transform.position, mainPlayer.transform.position, 50, myLayerMask);
	
	//print(hit.transform.tag);
	
	
	var hit: RaycastHit2D = Physics2D.Raycast(transform.position, vecToPlayer,100, myLayerMask);

	if (hit.collider != null) {
		// Calculate the distance from the surface and the "error" relative
		// to the floating height.
		
		var hitDist = Mathf.Pow(hit.point.y - transform.position.y, 2) + Mathf.Pow(hit.point.x - transform.position.x, 2);
		var playerDist = Mathf.Pow(mainPlayer.transform.position.y - transform.position.y, 2) + Mathf.Pow(mainPlayer.transform.position.x - transform.position.x, 2);
		
		//print(hitDist);
		//print(playerDist);
		
		
		
		
		if(hitDist < playerDist) return false;
	
		
		
		//var distance = Vector3(0, 0, 0);
		//print(hit.transform.position);
		//print(transform.position);
		//distance = hit.transform.position - transform.position;
		//print(hit.transform.position);
		//print(distance);
		//if(distance.sqrMagnitude < vecToPlayer.sqrMagnitude) return false;
	}
	
	return true;
	
	/*
	if (Physics2D.Raycast (transform.position, vecToPlayer, hit, 500)) {
		print(hit.distance);
	}
	
	
	return true;

	if(angleToPlayer < 20.0)
	{
		return true; 
	}
	else
	{
		return false;
	}*/
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