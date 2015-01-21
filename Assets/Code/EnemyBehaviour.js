#pragma strict

var mainPlayer : GameObject;
var speed : double;
var maxFollowDistance : double;
var destroyable = 1;

function Start () {
	mainPlayer = GameObject.Find("Player");
}

function FixedUpdate () {
	var vecToPlayer = Vector3(0,0,0);

	if(mainPlayer!=null)
		vecToPlayer =  mainPlayer.transform.position - transform.position;
	
	if(vecToPlayer.magnitude > maxFollowDistance)
		return;
	
	var direction = vecToPlayer.normalized;
	
	rigidbody2D.AddForce(direction*speed);
}

function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag == "Player")
			Destroy(other.gameObject);
	}