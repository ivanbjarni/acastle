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
var knockPartSystem : ParticleSystem;
var kneelPartSystem : ParticleSystem;

// For charge powerup
var playerIsCharging : boolean = false;
var chargeTime : float;
var chargeTimer : float;
var chargeSpeed : float;
var chargeDir : Vector3;

var isAlive : boolean;
var health : int;
//========================================
//	Things to do when object is created
//========================================
function Start () {
	isAlive = true;
	health = 3;
	animator =  GetComponent("Animator") as Animator;
	fetchFromMaster();
	initializeParticleSystems();
}

function initializeParticleSystems(){
	partSystem = GameObject.Find("ChargeParticles").GetComponent(ParticleSystem);
	knockPartSystem = GameObject.Find("KnockParticles").GetComponent(ParticleSystem);
	kneelPartSystem = GameObject.Find("KneelParticles").GetComponent(ParticleSystem);
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
	
	isUsingJoyStick = masterBehav.isUsingJoystick;
	if(masterBehav.JoyType.Equals("ps3")) { joystick = JoyType.ps3;}
	if(masterBehav.JoyType.Equals("xbox")) { joystick = JoyType.xbox;}
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
	if ( Input.GetKey('e') ){
		kneelBeforeTheKing();
	}
}

function kneelBeforeTheKing(){
	var maxDist = 12;
	// Find all game objects with tag Enemy
	var enemies : GameObject[];
	enemies = GameObject.FindGameObjectsWithTag("Enemy"); 
	var enemyPos : Vector3;
	var position = transform.position; 
	// Iterate through them and find the closest one
	for (var enemy : GameObject in enemies)  { 
		enemyPos = enemy.transform.position;
		enemyPos.z = 0;
		var diff = (enemyPos - position);
		var curDistance = diff.sqrMagnitude; 
		if (curDistance < maxDist) { 
			enemy.GetComponent(EnemyBehaviour).kneel(5);
		} 
	}
	kneelPartSystem.Play();
}

function charge () {
	rigidbody2D.AddForce(chargeDir * chargeSpeed);
	var time = Time.time - chargeTimer;
	if( time > chargeTime ){
		stopCharge();
	}
}

function stopCharge(){
	rigidbody2D.velocity = Vector3(0,0,0);
	playerIsCharging = false;
	partSystem.Stop();
	speed = 0;
	pushEnemies();
}

function pushEnemies(){
	// Find all game objects with tag Enemy
	var enemies : GameObject[];
	enemies = GameObject.FindGameObjectsWithTag("Enemy"); 
	var enemyPos : Vector3;
	var position = transform.position; 
	var maxDist = 5;
	// Iterate through them and find the closest one
	for (var enemy : GameObject in enemies)  { 
		enemyPos = enemy.transform.position;
		enemyPos.z = 0;
		var diff = (enemyPos - position);
		var curDistance = diff.sqrMagnitude; 
		if (curDistance < maxDist) { 
			enemy.rigidbody2D.AddForce(diff.normalized * ( 3000 - 2000 * curDistance/maxDist ) );
		} 
	}
	knockPartSystem.Play();
}

function collisionWithEnemy(object : GameObject){
	if( !playerIsCharging ){
		//Destroy(gameObject);
		health--;
		if(health < 1) isAlive = false;
	}else if( playerIsCharging ){
		if( object != null )
			object.GetComponent(EnemyBehaviour).gotHit();
		stopCharge();
	}
}

function collisionWithBoss(object : GameObject){
	if( !playerIsCharging ){
		//Destroy(gameObject);
		health--;
		if(health < 1) isAlive = false;
	}
}

//========================================
//			Update function
//========================================
function FixedUpdate () {
	
	if(!isAlive) return;

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


