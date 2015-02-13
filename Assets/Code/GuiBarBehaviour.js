#pragma strict

var timer : float = 10;
var pos : Vector3;

function Awake () {

}

function fixedUpdate(){
	updateTimers();
}

function LateUpdate () {
	pos = Camera.main.ViewportToWorldPoint(Vector3(0.5,0,0));
	transform.position = pos;
	transform.position.z=0;
}

function updateTimers(){
	timer -= Time.deltaTime;
}