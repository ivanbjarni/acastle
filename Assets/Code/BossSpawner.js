#pragma strict

var boss : GameObject;
var bossHealthBar : GameObject;

var closingWall : GameObject;

function OnTriggerEnter2D (other : Collider2D) {
		var bossInstance = Instantiate( boss, Vector3( 12,258, 0), Quaternion.Euler(0, 0, 0));
		var bossHealth = Instantiate( bossHealthBar, Vector3( 12,258, 0), Quaternion.Euler(0, 0, 0));
		
		
		var closed = Instantiate( closingWall, Vector3( -1.15, 240.74, 0), Quaternion.Euler(0, 0, 0));
		this.Destroy(gameObject);
	
}