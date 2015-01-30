#pragma strict

function Awake () {

}

function LateUpdate () {
	var pos = Camera.main.ViewportToWorldPoint(Vector3(0.5,0,0));
	transform.position = pos;
	transform.position.z=0;

}