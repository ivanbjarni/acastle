#pragma strict

var onmove : boolean;
var speed : float;
var direction : Vector3;
var parentEnemy : GameObject;
var targetedEnemy : GameObject;
var isExploding : boolean;
var explodingTime : float;
var lifeTime : float = 5;

var animator : Animator;

function Start () {
	onmove = true;
	speed = 1;
	//direction = transform.up.normalized;
	//animator =  GetComponent("Animator") as Animator;
	//isExploding = false;
	//explodingTime = 0.5;
}

function setup(parent, target){
	parentEnemy = parent;
	targetedEnemy = target;
}

function FixedUpdate () {
	var vecToTarget : Vector3;
	try{
		vecToTarget =  targetedEnemy.transform.position - transform.position;
	}
	catch (MissingReferenceException){
		vecToTarget = transform.up;
		lifeTime -= Time.deltaTime;
	}
	direction = vecToTarget.normalized; 
	rigidbody2D.AddForce(direction*speed);
}


function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag == "Player"){
			return;
			/*var player : PlayerBehaviour = other.gameObject.GetComponent(PlayerBehaviour);
			if( player.collisionWithRanged(gameObject) ){
				isExploding = true;
				boom();
			}*/
		}
		else if(other.gameObject.tag == "Enemy"){
			if(other.gameObject == parentEnemy) return;
			else{
				other.gameObject.GetComponent(EnemyBehaviour).armoredSphere();
				Destroy(gameObject);
			} 
	}	
}