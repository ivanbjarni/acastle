#pragma strict


var pos : Vector3;

var coolDowns : SpriteRenderer[];
var timers : float[];
var maxTime : float = 1;

function Awake () {
	initializeCooldowns();
}

function LateUpdate () {
	updateTimers();
	renderCooldowns();
	pos = Camera.main.ViewportToWorldPoint(Vector3(0.5,0,0));
	transform.position = pos;
	transform.position.z=0;
}

function updateTimers(){
	for(var i = 1; i < 9; i++ ){
		if( coolDowns[i].enabled ){
			timers[i] -= Time.deltaTime;
			if( timers[i] < 0 ){
				coolDowns[i].enabled = false;
			}
		}
	}
}

function startTimer(i){
	timers[i] = maxTime;
	coolDowns[i].enabled = true;
}

function initializeCooldowns(){
	timers = new float[9];
	coolDowns = new SpriteRenderer[9];
	coolDowns[1] = transform.Find("semiTransparentBox1").GetComponent(SpriteRenderer);
	coolDowns[2] = transform.Find("semiTransparentBox2").GetComponent(SpriteRenderer);
	coolDowns[3] = transform.Find("semiTransparentBox3").GetComponent(SpriteRenderer);
	coolDowns[4] = transform.Find("semiTransparentBox4").GetComponent(SpriteRenderer);
	coolDowns[5] = transform.Find("semiTransparentBoxQ").GetComponent(SpriteRenderer);
	coolDowns[6] = transform.Find("semiTransparentBoxE").GetComponent(SpriteRenderer);
	coolDowns[7] = transform.Find("semiTransparentBoxR").GetComponent(SpriteRenderer);
	coolDowns[8] = transform.Find("semiTransparentBoxF").GetComponent(SpriteRenderer);
	for(var i = 1; i < 9; i++){
		coolDowns[i].enabled = false;
	}
}

function renderCooldowns(){
	for(var i = 1; i < 9; i++){
		if(coolDowns[i].enabled){
			coolDowns[i].transform.localScale = Vector3(1, timers[i]/maxTime, 1);
		}
	}
}