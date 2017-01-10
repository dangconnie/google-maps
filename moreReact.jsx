var passMe = function(str, str2){
	console.log(str);
	console.log(str2);
}

var sendMe = function(theFunction){
	theFunction("BonJour", "Au revoir");
}

// passMe("Hello", "Goodbye")
sendMe(passMe);




//you can return functions but this is dumb
function x(num){
	console.log(num);
	return function(y){
		console.log(num + y);
	}
}
x(2)(2);