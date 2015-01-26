#pragma strict

var speed : float;
var animator : Animator;

var run : float;
var walk : float;
var isUsingJoyStick : boolean;
enum JoyType {ps3, xbox};
var joystick : JoyType;
var RightStickPos : Vector2;


function Start () {
	animator =  GetComponent("Animator") as Animator;
}

function setSpeed() {
	speed = 0;
	if(Input.GetAxis("Horizontal")||Input.GetAxis("Vertical"))
		speed = walk;
	if (Input.GetKey(KeyCode.LeftShift)||Input.GetKey(KeyCode.JoystickButton9))
		speed = run;
}

function FixedUpdate () {
	setSpeed();
	//Add force to the the rigid body component to make the object move
		rigidbody2D.AddForce(Vector3(Input.GetAxis("Horizontal"),Input.GetAxis("Vertical"),0) * speed);
	
	//Tell the animator to attack by modifying the Attack parameter
	if (Input.GetMouseButton(0)||Input.GetKey(KeyCode.JoystickButton8))
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
	else
	{
		if(Input.GetAxis("RightVertical")||Input.GetAxis("RightHorizontal"))
			RightStickPos = Vector2(Input.GetAxis("RightHorizontal"),Input.GetAxis("RightVertical"));
		AngleRad = Mathf.Atan2(RightStickPos.y, RightStickPos.x);
		//convert it to degrees, we subtract 180 because of it's original rotation
	    AngleDeg = (180 / Mathf.PI) * AngleRad - 90;    
	}
	
	//set the rotation
	transform.rotation = Quaternion.Euler(0, 0, AngleDeg);
}