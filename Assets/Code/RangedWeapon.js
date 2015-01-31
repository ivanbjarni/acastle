#pragma strict

var onmove : boolean;
var speed : float;
var direction : Vector3;
var mainPlayer : GameObject;

function Start () {
	onmove = true;
	speed = 1;
	direction = transform.up.normalized;
}

function FixedUpdate () {
	rigidbody2D.AddForce(direction*speed);

}

function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag != "Enemy"){
			Destroy(gameObject);		
		}
		if(other.gameObject.tag == "Player"){
			var player : PlayerBehaviour = other.gameObject.GetComponent(PlayerBehaviour);
			player.collisionWithEnemy(gameObject);
		}	
}