#pragma strict

var mainPlayer : GameObject;

function Start () {
	mainPlayer = GameObject.Find("Player");
}

function Update () {
	if(mainPlayer!=null)
		transform.position = mainPlayer.transform.position + Vector3(0,0,-1);
}