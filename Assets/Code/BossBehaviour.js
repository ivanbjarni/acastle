#pragma strict

//variables that are used
var chargePoint : Vector3 = Vector3(0,0,0);
var chargeTimer : double;
var mainPlayer : GameObject;
var stunned : double;
var chargeCount : int;

//constants to fine tune behaviour
var chargeInterval : double;
var chargeSpeed : double;
var stunTime : double;
var maxChargeCount : int;


function Start () {
	mainPlayer = GameObject.Find("Player");
	chargeTimer = chargeInterval;
}

function FixedUpdate () {
	chargeTimer -= Time.deltaTime;
	stunned -= Time.deltaTime;
	
	if(chargeCount >= maxChargeCount)
	{
		stunned = stunTime;
		chargeCount = 0;
		transform.Find("BlueKnightShield").GetComponent(SpriteRenderer).enabled = false;
	}
	
	chargePoint = mainPlayer.transform.position;
	if(stunned<0)
		setRotation();
	
	
	if(chargeTimer<0 && stunned <0)
	{
		transform.Find("BlueKnightShield").GetComponent(SpriteRenderer).enabled = true;
		chargeCount++;
		chargeTimer = chargeInterval;
		rigidbody2D.AddForce((chargePoint-transform.position).normalized*chargeSpeed);
	}
	
	
}


function setRotation()
{
	var AngleRad : float;
	var AngleDeg : float;
		//Get mouse position
		var mousePos = chargePoint;
		//Calculate the rotation in radians using trigometry
		AngleRad = Mathf.Atan2(mousePos.y - transform.position.y, mousePos.x - transform.position.x);
		//convert it to degrees, we subtract 180 because of it's original rotation
	    AngleDeg = (180 / Mathf.PI) * AngleRad + 90;
	    //set the rotation
		transform.rotation = Quaternion.Euler(0, 0, AngleDeg);
}