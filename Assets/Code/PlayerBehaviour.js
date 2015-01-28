#pragma strict

var speed : float;
var animator : Animator;

var run : float;
var walk : float;
var isUsingJoyStick : boolean;
enum JoyType {ps3, xbox};
var joystick : JoyType;
var RightStickPos : Vector2;

// Particle system
var partSystem : ParticleSystem;

// For charge powerup
var playerIsCharging : boolean = false;
var chargeTime : float;
var chargeTimer : float;
var chargeSpeed : float;
var chargeDir : Vector3;

//========================================
//	Things to do when object is created
//========================================
function Start () {
	animator =  GetComponent("Animator") as Animator;
	fetchFromMaster();
	partSystem = GameObject.Find("ChargeParticles").GetComponent(ParticleSystem);
}

function fetchFromMaster()
{
	var master : GameObject = GameObject.Find("masterGameObject");
	if(master == null)
	{
		Debug.Log("Warning: No master game object found, if you did not start the game from menu then this is normal. You could add it to your worklevel");
		return;
	}
	var masterBehav : masterBehaviour = master.GetComponent("masterBehaviour") as masterBehaviour;
	
}

//========================================
//			General behaviour
//========================================

//sets the speed of player depending on if he is running or walking
function setSpeed() {
	speed = 0;
	if(Input.GetAxis("Horizontal")||Input.GetAxis("Vertical"))
		{speed = walk;
	if (Input.GetKey(KeyCode.LeftShift)										 // By default you use shift
		||(Input.GetKey(KeyCode.JoystickButton11) && joystick==JoyType.ps3)  // Ps3 uses button 11(L1)
		||(Input.GetKey(KeyCode.JoystickButton4) && joystick==JoyType.xbox)) // Xbox uses button 4(Lb)
		speed = run;}
}

//sets the rotation towards mouse or joystick depending on
//	preference
function setRotation()
{
	var AngleRad : float;
	var AngleDeg : float;
	if(!isUsingJoyStick)
	{
		//Get mouse position
		var mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
		//Calculate the rotation in radians using trigometry
		AngleRad = Mathf.Atan2(mousePos.y - transform.position.y, mousePos.x - transform.position.x);
		//convert it to degrees, we subtract 180 because of it's original rotation
	    AngleDeg = (180 / Mathf.PI) * AngleRad - 90;
	}
	else if (joystick == JoyType.ps3)
	{
		if(Input.GetAxis("RightVerticalps3")||Input.GetAxis("RightHorizontalps3"))
			RightStickPos = Vector2(Input.GetAxis("RightHorizontalps3"),Input.GetAxis("RightVerticalps3"));
		AngleRad = Mathf.Atan2(RightStickPos.y, RightStickPos.x);
		//convert it to degrees, we subtract 180 because of it's original rotation
	    AngleDeg = (180 / Mathf.PI) * AngleRad - 90;    
	}
	else if (joystick == JoyType.xbox)
	{
		if(Input.GetAxis("RightVerticalxbox")||Input.GetAxis("RightHorizontalxbox"))
			RightStickPos = Vector2(Input.GetAxis("RightHorizontalxbox"),Input.GetAxis("RightVerticalxbox"));
		AngleRad = Mathf.Atan2(RightStickPos.y, RightStickPos.x);
		//convert it to degrees, we subtract 180 because of it's original rotation
	    AngleDeg = (180 / Mathf.PI) * AngleRad - 90;    
	}
	
	//set the rotation
	transform.rotation = Quaternion.Euler(0, 0, AngleDeg);
}

function checkForPowers(){
	if (Input.GetKey('q') && !playerIsCharging){
		playerIsCharging = true;
		chargeDir = Camera.main.ScreenToWorldPoint(Input.mousePosition) - transform.position;
		chargeDir.z = 0;
		chargeDir = chargeDir.normalized;
		chargeTimer = Time.time;
		partSystem.Play();
	}
}

function charge () {
	rigidbody2D.AddForce(chargeDir * chargeSpeed);
	var time = Time.time - chargeTimer;
	if( time > chargeTime ){
		rigidbody2D.velocity = Vector3(0,0,0);
		print("stop");
		playerIsCharging = false;
		partSystem.Stop();
		speed = 0;
	}
}

//========================================
//			Update function
//========================================
function FixedUpdate () {
	checkForPowers();
	if( playerIsCharging )
		charge();
	else{
		// Sets the speed of the player and adds a force to the rigid body
		setSpeed();
		rigidbody2D.AddForce(Vector3(Input.GetAxis("Horizontal"),Input.GetAxis("Vertical"),0) * speed);
	}
	
	//Tell the animator to attack by modifying the Attack parameter
	if (Input.GetMouseButton(0)										 // By default you use shift
		||(Input.GetKey(KeyCode.JoystickButton10) && joystick==JoyType.ps3)  // Ps3 uses button 11(L1)
		||(Input.GetKey(KeyCode.JoystickButton5) && joystick==JoyType.xbox)) // Xbox uses button 4(Lb)
		animator.SetBool("Attack", true );
	else
		animator.SetBool("Attack", false );
	
	setRotation();
	
	//Stop the guy from spinning
	rigidbody2D.angularVelocity = 0;
	
	animator.SetFloat("Speed", Mathf.Abs(speed));
		
	
	// Prints a joystick name if movement is detected.
		// requires you to set up axes "Joy0X" - "Joy3X" and "Joy0Y" - "Joy3Y" in the Input Manger
		//for (var i : int = 0; i < 4; i++) {
		//	if (Mathf.Abs(Input.GetAxis("Joy"+i+"X")) > 0.2 
		//		|| Mathf.Abs(Input.GetAxis("Joy"+i+"Y")) > 0.2)
		//		Debug.Log (Input.GetJoystickNames()[i]+" is moved");}
}

function collisionWithEnemy(){
	
}
