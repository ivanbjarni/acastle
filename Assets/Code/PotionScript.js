#pragma strict

var healthPotion : boolean;
var lifeTime : float;

function Start () {
	lifeTime = 60;
}

function Update () {
	lifeTime -= Time.deltaTime;
}

function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag == "Player"){
			var player : PlayerBehaviour = other.gameObject.GetComponent(PlayerBehaviour);
			player.heal();
			Destroy(gameObject);
		}
}