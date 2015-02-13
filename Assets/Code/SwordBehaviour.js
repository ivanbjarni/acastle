#pragma strict

var wallsEntered = 0;
var enemyScript : EnemyBehaviour;

function Start () {

}

function Update () {
	if(cooldown > 0) cooldown -= Time.deltaTime;
	
}

function OnTriggerEnter2D (other : Collider2D) {
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

function OnTriggerExit2D (other : Collider2D) {
		if(other.gameObject.tag == "Obstacle"){
			wallsEntered--;
		}
	}