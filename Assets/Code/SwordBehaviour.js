#pragma strict

var wallsEntered = 0;
var enemyScript : EnemyBehaviour;
var mainPlayer : GameObject;

function Start () {
	mainPlayer = GameObject.Find("Player");

}

function Update () {
	
}

function OnTriggerEnter2D (other : Collider2D) {
	var canAttack = true;
	if(mainPlayer != null)
	{
		var playerBehaviour : PlayerBehaviour = mainPlayer.GetComponent(PlayerBehaviour);
		var playerAnimator = playerBehaviour.animator;
		canAttack = playerAnimator.GetBool("Attack");
	}
	if(canAttack){
		if(other.gameObject.tag == "Obstacle"){
			wallsEntered++;
		}
		if(other.gameObject.tag == "Enemy" && wallsEntered<=0)
		{
			var enemy : GameObject = other.gameObject;
			enemy.GetComponent(EnemyBehaviour).gotHit();
			
			
		}
		if(other.gameObject.tag == "Boss" && wallsEntered<=0)
		{
			var boss : GameObject = other.gameObject;
			boss.GetComponent(BossBehaviour).gotHit();
			
		}
	}
}

function OnTriggerExit2D (other : Collider2D) {
		if(other.gameObject.tag == "Obstacle"){
			wallsEntered--;
		}
	}