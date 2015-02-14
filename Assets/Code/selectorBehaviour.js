#pragma strict
 
 var canMove = 0;
 var selected = 0;
 var masterBehav : masterBehaviour;
 
function Start () 
{
	var master : GameObject = GameObject.Find("masterGameObject");
	if(master == null)
	{
		Debug.Log("Warning: No master game object found, if you did not start the game from menu then this is normal. You could add it to your worklevel");
		return;
	}
	masterBehav = master.GetComponent("masterBehaviour") as masterBehaviour;
}

function FixedUpdate () {
	canMove++;
	
	if(canMove>20 && Input.GetAxis("Vertical"))
	{
		canMove=0;
		selected -= Mathf.Sign(Input.GetAxis("Vertical"));
		selected = Mathf.Max(selected % 3,(3+selected) % 3);
		transform.position = Vector3(0,-2-selected,0);
		
	}
	
	if(masterBehav != null)
	{
		//temporary control change
		if(Input.GetKeyDown(KeyCode.Alpha1))
			masterBehav.isUsingJoystick = false;
			
		if(Input.GetKeyDown(KeyCode.Alpha2))
		{masterBehav.isUsingJoystick = true;
		 masterBehav.JoyType = "ps3";}
		 
		 if(Input.GetKeyDown(KeyCode.Alpha3))
		{masterBehav.isUsingJoystick = true;
		 masterBehav.JoyType = "xbox";}
	}
		

		
	if(Input.GetKeyDown(KeyCode.Return) && selected==0)
		Application.LoadLevel(2);
	if(Input.GetKeyDown(KeyCode.Return) && selected==1)
		Application.LoadLevel(1);
	if(Input.GetKeyDown(KeyCode.Return) && selected==2)
		Application.Quit();			
}