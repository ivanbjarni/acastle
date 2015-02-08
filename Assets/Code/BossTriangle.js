#pragma strict

var mainPlayer : GameObject;


function Start () 
{
	mainPlayer = GameObject.Find("Player");
	rigidbody2D.AddForce(10*Vector3(Random.Range(-10.0, 10.0),Random.Range(-10.0, 10.0),0));
}

function Update () {

}


function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag == "Player"){
			var player : PlayerBehaviour = mainPlayer.GetComponent(PlayerBehaviour);
			player.collisionWithEnemy(gameObject);
		}
		if(other.gameObject.tag == "Boss"){
			setCollider(false);
		}
}

function OnTriggerExit2D (other : Collider2D) {
		if(other.gameObject.tag == "Boss"){
			setCollider(true);
		}
}

function setCollider(toggle : boolean)
{
		var coll : CircleCollider2D[];
		coll = gameObject.GetComponents.<CircleCollider2D>();
		for (var c : CircleCollider2D in coll) 
		{
			if(!c.isTrigger)
			c.enabled = toggle;
		}
}
