#pragma strict

var wallsEntered = 0;
var enemyScript : EnemyBehaviour;
var cooldown = 1.0;

function Start () {

}

function Update () {
	cooldown -= 0.1;
	
}

function OnTriggerEnter2D (other : Collider2D) {
	if(cooldown < 0)
	{
		if(other.gameObject.tag == "Obstacle")
			wallsEntered++;
		if(other.gameObject.tag == "Enemy" && wallsEntered==0)
		{
			var enemy : GameObject = other.gameObject;
			enemy.GetComponent(EnemyBehaviour).gotHit();
			cooldown = 2;
		}
	}
}

function OnTriggerExit2D (other : Collider2D) {
		if(other.gameObject.tag == "Obstacle")
			wallsEntered--;
	}