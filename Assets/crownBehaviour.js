var onmove : boolean = true;
var speed : float;
var direction : Vector3;
var mainPlayer : GameObject;
var explodingTime : float;
var angle : float;

var isActive : boolean = true;

var animator : Animator;

function Start () {
	speed = 3;
	direction = transform.up.normalized;
	angle = 0;
	rigidbody2D.angularVelocity = 360;
	rigidbody2D.velocity = direction * speed;
}

function FixedUpdate () {
}

function stop(){
	rigidbody2D.angularVelocity = 0;
	rigidbody2D.velocity = direction * 0;
	isActive = false;
}

function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag == "Player"){
			if( isActive ){
				return;
			}
			else{
				other.gameObject.GetComponent(PlayerBehaviour).addCrown();
				Destroy(gameObject);
			}
		}else if(other.gameObject.tag == "Enemy"){
			if( isActive ){
				stop();
				var enemy : EnemyBehaviour = other.gameObject.GetComponent(EnemyBehaviour);
				enemy.gotHit();
			}else{
				return;
			}
		}else if(other.gameObject.tag == "ObsDecor" || other.gameObject.tag == "Weapon" || other.gameObject.tag == "Crown" || other.gameObject.tag == "Fireball"){
			return;
		}else{
			stop();
		}
}