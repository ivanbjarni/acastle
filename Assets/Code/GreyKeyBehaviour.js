#pragma strict

var AngleDeg : int;

function Start() {
	this.AngleDeg = 0;
}

function FixedUpdate () {

	//set the rotation
	this.AngleDeg += 1;
	this.transform.rotation = Quaternion.Euler(0, 0, this.AngleDeg);

}

function OnTriggerEnter2D (other : Collider2D) {
		var greyDoors : GameObject[];
		
		greyDoors = GameObject.FindGameObjectsWithTag("greyDoor");
		
		for(var i = 0; i< greyDoors.length; i++){
		
			Destroy(greyDoors[i]);
			
		}
		
		this.Destroy(gameObject);
	
}