#pragma strict

var mainPlayer : GameObject;
var speed : double;
var maxFollowDistance : double;
var destroyable = 1;

function Start () {
	mainPlayer = GameObject.Find("Player");
}

function FixedUpdate () {
	var vecToPlayer =  mainPlayer.transform.position - transform.position;
	
	if(vecToPlayer.magnitude > maxFollowDistance)
		return;
	
	var direction = vecToPlayer.normalized;
	
	rigidbody2D.AddForce(direction*speed);
}