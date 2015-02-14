#pragma strict

var healthMax : int;
var pos : Vector3;

function Awake () {
	var boss = GameObject.FindGameObjectWithTag("Boss");
	if(boss != null)
	healthMax = boss.GetComponent(BossBehaviour).c_maxHealth;
	transform.localScale = Vector3(1,0.5,1);
}

function LateUpdate () {
	pos = Camera.main.ViewportToWorldPoint(Vector3(0.5,1,0));
	transform.position = pos;
	transform.position.z=0;
}


function updateHealth(health : int){
	transform.Find("bossHealthLayer2").localScale = Vector3(1.0 * health/healthMax,1,1);
}