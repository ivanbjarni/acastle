#pragma strict
//---------------------Variables--------------------------
var mainPlayer : GameObject;

var speed : float;
var meleeDist : double;
var melee : boolean;
var ranged: boolean;
var rangedWeapon : GameObject;

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
//-------------------------------------------------------

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
		
	if(melee && ranged)ranged = !ranged;
	if(!melee && !ranged)melee = !melee;
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
	//Get the vector to player and calculate the distance
	//The field of vision is depending on the distance to player. When the player
	//is very close the angle is 3x larger.
	var vecToPlayer = Vector3(0,0,0);
	if(mainPlayer!=null)
		vecToPlayer =  mainPlayer.transform.position - transform.position;
	var distanceToPlayer = vecToPlayer.magnitude;
	//print(distanceToPlayer);
	var angleToPlayer : float = Vector3.Angle(vecToPlayer, transform.up);
	if(distanceToPlayer > 3.0 && angleToPlayer > 50.0) return false;
	if(distanceToPlayer < 3.0 && angleToPlayer > 150.0) return false;
	
	//Raycasting to check if the enemy can see the player (nothing in between them).
	//myLayerMask makes sure that enemies only raycast on the layer "walls".
	var hit: RaycastHit2D = Physics2D.Raycast(transform.position, vecToPlayer,5, myLayerMask);
	if (hit.collider != null) {
		// Calculate the distance from the surface and the "error" relative
		// to the floating height.	
		var hitDist = Mathf.Pow(hit.point.y - transform.position.y, 2) + Mathf.Pow(hit.point.x - transform.position.x, 2);
		var playerDist = Mathf.Pow(mainPlayer.transform.position.y - transform.position.y, 2) + Mathf.Pow(mainPlayer.transform.position.x - transform.position.x, 2);
		//print(hitDist);
		//print(playerDist);
		if(hitDist < playerDist) return false;
	}
	
	return true;
}


function attackMelee()
{
	return;
}

function attackRanged(vecToPlayer){
	var fireball = Instantiate (rangedWeapon, transform.position, transform.rotation);
	
	//var FireballShot = Instantiate(Fireball, transform.position, transform.rotation);
	return;
}


function attackPlayer()
{
	var vecToPlayer = Vector3(0,0,0);
	if(mainPlayer!=null)
		vecToPlayer =  mainPlayer.transform.position - transform.position;

	if(vecToPlayer.magnitude > maxFollowDistance)
		return;
			
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
	
	if(ranged)attackRanged(vecToPlayer);
	if(melee) rigidbody2D.AddForce(direction*speed);
	
	if(vecToPlayer.magnitude < meleeDist)
	{
		attackMelee();
		return;
	}
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