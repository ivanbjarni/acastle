#pragma strict

var isUsingJoystick = false;
var JoyType : String;

// Make this game object and all its transform children
// survive when loading a new scene.
function Awake () {
	DontDestroyOnLoad (transform.gameObject);
}

function Update () {

}

