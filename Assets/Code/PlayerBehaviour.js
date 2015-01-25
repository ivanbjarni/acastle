#pragma strict

var speed : float;
var animator : Animator;

var run : float;

function Start () {
	speed = 0;
	run = 90;
	animator =  GetComponent("Animator") as Animator;
}

function WalkOrRun() {
	
	if (Input.GetKey("w") || Input.GetKey("s") || Input.GetKey("a") || Input.GetKey("d")) {
		if (Input.GetKey(KeyCode.LeftShift)) {
		 	speed = run;
		} else speed = 60;
	} else speed = 0; 
}

function FixedUpdate () {
	//Add force to the the rigid body component to make the object move
	if (Input.GetKey ("w"))
		rigidbody2D.AddForce(Vector3(0,1,0) * speed);
	if (Input.GetKey ("s"))
		rigidbody2D.AddForce(Vector3(0,-1,0) * speed);
	if (Input.GetKey ("d"))
		rigidbody2D.AddForce(Vector3(1,0,0) * speed);
	if (Input.GetKey ("a"))
		rigidbody2D.AddForce(Vector3(-1,0,0) * speed);
	
	//Tell the animator to attack by modifying the Attack parameter
	if (Input.GetMouseButton(0))
		animator.SetBool("Attack", true );
	else
		animator.SetBool("Attack", false );
	
	//Get mouse position
	var mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
	//Calculate the rotation in radians using trigometry
	var AngleRad = Mathf.Atan2(mousePos.y - transform.position.y, mousePos.x - transform.position.x);
	//convert it to degrees, we subtract 180 because of it's original rotation
    var AngleDeg = (180 / Mathf.PI) * AngleRad - 90;
    //set the rotation
    transform.rotation = Quaternion.Euler(0, 0, AngleDeg);
	
	//Stop the guy from spinning
	rigidbody2D.angularVelocity = 0;
	
	WalkOrRun();
		
	animator.SetFloat("Speed", Mathf.Abs(speed));
		
	
	// Prints a joystick name if movement is detected.
		// requires you to set up axes "Joy0X" - "Joy3X" and "Joy0Y" - "Joy3Y" in the Input Manger
		//for (var i : int = 0; i < 4; i++) {
		//	if (Mathf.Abs(Input.GetAxis("Joy"+i+"X")) > 0.2 
		//		|| Mathf.Abs(Input.GetAxis("Joy"+i+"Y")) > 0.2)
		//		Debug.Log (Input.GetJoystickNames()[i]+" is moved");}
}