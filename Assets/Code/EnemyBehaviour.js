#pragma strict

var mainPlayer : GameObject;
var speed : double;
var melee : double;
var maxFollowDistance : double;
var destroyable = 1;
var health = 3;

function Start () {
	mainPlayer = GameObject.Find("Player");
}

function attackMelee()
{
	return;
}

function FixedUpdate () {
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
	
	rigidbody2D.AddForce(direction*speed);
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