#pragma strict

//variables that are used
var chargePoint : Vector3 = Vector3(0,0,0);
var chargeTimer : double;
var mainPlayer : GameObject;
var stunned : double;
var chargeCount : int;
var health : int;
var hasShield : boolean;

//constants to fine tune behaviour
var c_chargeInterval : double;
var c_chargeSpeed : double;
var c_stunTime : double;
var c_maxChargeCount : int;
var c_maxHealth : int ;

//===============================
//			Start
//===============================
function Start () {
	mainPlayer = GameObject.Find("Player");
	chargeTimer = c_chargeInterval;
	health = c_maxHealth;
}


//===============================
//			Update
//===============================
function FixedUpdate () {
	chargeTimer -= Time.deltaTime;
	stunned -= Time.deltaTime;
	
	if(chargeCount >= c_maxChargeCount)
	{
		stunned = c_stunTime;
		chargeCount = 0;
		setShield(false);
	}
	
	chargePoint = mainPlayer.transform.position;
	if(stunned<0)
		setRotation();
	
	
	if(chargeTimer<0 && stunned <0)
	{
		setShield(true);
		chargeCount++;
		chargeTimer = c_chargeInterval;
		rigidbody2D.AddForce((chargePoint-transform.position).normalized*c_chargeSpeed);
	}
	
	
}

function setShield(toggle : boolean)
{
	hasShield = toggle;
	transform.Find("BlueKnightShield").GetComponent(SpriteRenderer).enabled = toggle;
}

//===============================
//			Movement
//===============================
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

//===============================
//			Collisions
//===============================
function OnTriggerEnter2D (other : Collider2D) {
		if(other.gameObject.tag == "Player" && stunned <0){
			var player : PlayerBehaviour = mainPlayer.GetComponent(PlayerBehaviour);
			player.collisionWithBoss(gameObject);
		}
}

function gotHit()
{
	if(!hasShield)
	{
		health--;
		print(health);
		setShield(true);
	}
		
	if(health <= 0)
		stunned = 600;
}