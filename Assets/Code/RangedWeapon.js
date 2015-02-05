#pragma strict

var onmove : boolean;
var speed : float;
var direction : Vector3;
var mainPlayer : GameObject;
var isExploding : boolean;
var explodingTime : float;

var animator : Animator;

function Start () {
	onmove = true;
	speed = 1;
	direction = transform.up.normalized;
	animator =  GetComponent("Animator") as Animator;
	isExploding = false;
	explodingTime = 0.5;
}

function FixedUpdate () {
	if(isExploding){
		updateTimer();
	}
	rigidbody2D.AddForce(direction*speed);
}

function updateTimer(){
	explodingTime -= Time.deltaTime;
	if(explodingTime < 0){
		explodingTime = 0.5;
		Destroy(gameObject);
	}
}

function boom(){
	speed = 0;
	rigidbody2D.velocity = Vector3(0,0,0);
	animator.SetBool("isFinished", isExploding );
}

function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag == "Player"){
			var player : PlayerBehaviour = other.gameObject.GetComponent(PlayerBehaviour);
			if( player.collisionWithRanged(gameObject) ){
				isExploding = true;
				boom();
			}
			return;
		}else if( other.gameObject.tag == "Fireball" ){
			return;
		}
		else if(other.gameObject.tag != "Enemy"){
			isExploding = true;
			boom();
		}	
}