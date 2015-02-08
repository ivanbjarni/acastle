#pragma strict
//---------------------Variables--------------------------
var mainPlayer : GameObject;

// ---------||| Enemy Type Variables |||-----------
var melee : boolean;
var ranged: boolean;
var mage : boolean;
var ogre : boolean;
var wolf : boolean;
var rat : boolean;
var scorpion : boolean;
var health : double;
var speed : float;


// ---------||| Combat system variables |||--------
var meleeDist : double;
var rangedWeapon : GameObject;
var spawnedRat : GameObject;
var rangedTimer : float = 1;
var block : float;
var attack : float;
var fireBallCooldown : float = 0;
var magicCooldown : float = 0;

// ---------||| Other variables |||--------
var maxFollowDistance : double;
var destroyable = 1;
var seePlayer;
var isFollowingPath : boolean;
var path : PathDefinition;
var myLayerMask : LayerMask;

// Tells you if enemy is dead
var isDead : boolean = false;
var deathTime : float = 2;

var animator : Animator;

// For kneel before the king
var isKneeling : boolean = false;

var bloodPart : ParticleSystem;
var blockParticles : ParticleSystem;
//-------------------------------------------------------


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//------------------||| Setup & update functions |||---------------------
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function ogreSetup(){
	health = 2.0;
	speed = 120;
}

function ratSetup(){
	health = 1.0;
	speed = 150;
	meleeDist = 0.2;
}

function wolfSetup(){
	health = 3.0;
	speed = 60;
	melee = false;
	ranged = false;
	mage = true;
}

function scorpionSetup(){
	health = 1.0;
	speed = 70;
}

function Start () {
	mainPlayer = GameObject.Find("Player");
	
	//Giving variables their value
	seePlayer = false;
	attack = 0;
	block = 0;	
	animator =  GetComponent("Animator") as Animator;
	bloodPart = transform.Find("BloodParticles").GetComponent(ParticleSystem);
	if(wolf || ogre) blockParticles = transform.Find("BlockParticles").GetComponent(ParticleSystem);
	
	//Find the object for the path
	var pathObject = FindClosestPath();
	if(pathObject != null)
		path = pathObject.GetComponent("PathDefinition") as PathDefinition;
	else if(isFollowingPath)
		print("Enemy is trying to follow Path but no path to be found, did you remember to tag the path?");
		
	if(melee && ranged)ranged = !ranged;
	if(!melee && !ranged)melee = !melee;
	
	if(scorpion)scorpionSetup();
	else if(ogre)ogreSetup();
	else if(rat)ratSetup();
	else if(wolf)wolfSetup();
	else wolfSetup();
}

function FixedUpdate () {
	//-------------||| Timers and cooldowns |||------------------
	if( isDead ){
		rigidbody2D.velocity = Vector3(0,0,0);
		deathTime -= Time.deltaTime;
		if( deathTime < 0 ){
			bloodPart.Stop();
			Destroy(gameObject);
		}
		
		animator.SetBool("isDead", isDead);
		return;
	}
	if(fireBallCooldown > 0) fireBallCooldown -= Time.deltaTime;
	if(magicCooldown > 0) magicCooldown -= Time.deltaTime;
	if(attack < 3 - 0.07) animator.SetBool("isAttacking", false);
	if(block < 0){transform.Find("Bubble").GetComponent(SpriteRenderer).enabled = false;}
	//------------------------------------------------------------
	
	rigidbody2D.angularVelocity = 0;
	seePlayer = canISeePlayer();
	if(seePlayer) attackPlayer();
	else if(isFollowingPath) followPath();	
	
	
	animator.SetFloat("Speed", Mathf.Abs(rigidbody2D.velocity.magnitude));
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//------------------||| Path functions |||---------------------
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// returns Vector3 that is the position he should move towards if he is following path
function getPathPoint()
{
	return path.getNextPosition(transform.position);
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

function pushedBack(){
	rigidbody2D.AddForce(-transform.up * 250 );
	mainPlayer.rigidbody2D.AddForce(-mainPlayer.transform.up * 150);
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//------------------||| Combat functions |||---------------------
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// When hit by kneel before the king the enemy
// starts bleeding and moves slower.
function kneel(kneelSpeed : float ){
	isKneeling = true;
	bloodPart.Play();
	speed = kneelSpeed;
}

// Every time the enemy is hit there is a 1/5 chance of it
// being able to block.
function tryToBlock(){
	var chanceOfBlocking = Random.Range(0, 5);
	if(chanceOfBlocking < 1) {
		transform.Find("Bubble").GetComponent(SpriteRenderer).enabled = true;
		//blockParticles.Play();
		block = 1;
	}
}

// Instant death when enemy does not see player.
// Melee enemies try to block.
function gotHit(){
	if(!seePlayer){	
		bleed();
		isDead = true;
		disapleColliders();
		return;
	}
	if(melee){
		tryToBlock();
		if(block > 0){
			pushedBack(); 
			return;
		}
	}
	health--;
	bleed();
	if(health < 1)
	{
		isDead = true;
		disapleColliders();
		
	}
}

function attackMelee(vecToPlayer : Vector3){
	var direction = vecToPlayer.normalized;
	if(vecToPlayer.magnitude > meleeDist){
		rigidbody2D.AddForce(direction*speed);	
	}
	if(block > 0){
	 	block -= Time.deltaTime;
		return;
	}
	else if(attack > 0){
		attack -= Time.deltaTime;
		return;
	}
	else{
		var decision = Random.Range(0.0,2.0);
		//print(decision);
		if(decision <= 1){
			//TODO Attack function
			rigidbody2D.AddForce(direction*200);
			attack = 1.5;
			animator.SetBool("isAttacking", true);
			return;
		}
	
	
		return;
	}
}

function attackRanged(vecToPlayer : Vector3){
	if(fireBallCooldown <= 0){
		var fireball = Instantiate (rangedWeapon, transform.position, transform.rotation);
		fireBallCooldown = 2;
		animator.SetBool("isAttacking", true);
	}
	else{
	var shouldMove = Random.Range(0, 3);
	if(shouldMove == 0) rigidbody2D.AddForce(transform.up*speed);
	if(shouldMove == 1) rigidbody2D.AddForce(-transform.up*speed);	
	}
	//var FireballShot = Instantiate(Fireball, transform.position, transform.rotation);
	return;
}

function attackMage(vecToPlayer : Vector3){
	if(magicCooldown > 0) return;
	
	if(vecToPlayer.magnitude < 2.5){
		var fireball = Instantiate (rangedWeapon, transform.position, transform.rotation);
		magicCooldown = 1;
		animator.SetBool("isAttacking", true);
	}
	else{
		for(var i = 0; i < 3; i++)
		{
			var spawnedRat = Instantiate (spawnedRat, transform.position, transform.rotation);
		}
		magicCooldown = 10;
		animator.SetBool("isAttacking", true);
	}
	
	
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
	else if(melee) attackMelee(vecToPlayer);
	else if(mage) attackMage(vecToPlayer);
	
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//------------------||| Collision functions |||---------------------
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag == "Player"){
			var player : PlayerBehaviour = mainPlayer.GetComponent(PlayerBehaviour);
			player.collisionWithEnemy(gameObject);
		}
}

function disapleColliders(){
	var coll : BoxCollider2D[];
	coll = gameObject.GetComponents.<BoxCollider2D>();
	for (var c : BoxCollider2D in coll) {
		c.enabled = false;
	}
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//------------------||| Other functions |||---------------------
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function bleed(){
	bloodPart.Play();
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
		if(hitDist < playerDist) return false;
	}
	
	return true;
}




