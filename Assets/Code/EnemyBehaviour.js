#pragma strict

var mainPlayer : GameObject;
var speed : double;
var melee : double;
var maxFollowDistance : double;
var destroyable = 1;
var health = 3;
var seePlayer;

function Start () {
	mainPlayer = GameObject.Find("Player");
	seePlayer = false;
}

function FixedUpdate () {
	
	seePlayer = canISeePlayer();
	if(seePlayer) attackPlayer();	
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