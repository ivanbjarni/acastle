#pragma strict

var wallsEntered = 0;

function Start () {

}

function Update () {
	
}

function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag == "Obstacle")
			wallsEntered++;
		if(other.gameObject.tag == "Enemy" && wallsEntered==0)
			Destroy(other.gameObject);
	}

function OnTriggerExit2D (other : Collider2D) {
		if(other.gameObject.tag == "Obstacle")
			wallsEntered--;
	}