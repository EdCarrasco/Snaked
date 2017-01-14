class GameObjectsHandler {
	constructor() {
		this.dictionary = {};
		this.keys = [];

		this.keyset1 = ["CURSOR","SNAKE"];
		this.keyset2 = ["FOOD"];
	}

	add(obj) {
		// If an array of that object type doesnt exist in the dictionary, create an array for it
		if (this.dictionary[obj.type] === undefined) {
			this.dictionary[obj.type] = [];
		}
		this.dictionary[obj.type].push(obj); 		// Add the object to the dictionary in the corresponding array
		this.keys = Object.keys(this.dictionary); // Update array of keys
	}

	remove(obj) {
		// If the object is in an array, get the index; otherwise, index is -1
		var index = this.dictionary[obj.type].indexOf(obj);
		if (index >=  0) {
			this.dictionary[obj.type].splice(index,1); // Only remove that obj from the array
			this.keys = Object.keys(this.dictionary);  // Update array of keys
			return true;
		}
		return false;
	}

	getObjectsByType(type) {
		if (this.dictionary[type] != undefined)
			return this.dictionary[type];
		return null;
	}

	findObject(obj) {
		var index = this.dictionary[obj.type].indexOf(obj);
		if (index >= 0)
			this.dictionary[obj.type].splice(index,1);
		else
			console.log("Object not found...");
	}

	update() {
		// Call the update function for the objects in each of the arrays in the dictionary
		for (var type in this.dictionary) {
			for (var i = 0; i < this.dictionary[type].length; i++) {
				this.dictionary[type][i].update();
			}
		}
		this.collisionScan();
	}

	display() {
		// Display all the objects in each of the arrays in the dictionary
		for (var type in this.dictionary) {
			for (var i = 0; i < this.dictionary[type].length; i++) {
				this.dictionary[type][i].display();
			}
		}
	}

	displayDEBUG() {
		// Display all the debugging graphics of the objects in each of the arrays in the dictionary
		for (var type in this.dictionary) {
			for (var i = 0; i < this.dictionary[type].length; i++) {
				this.dictionary[type][i].displayDEBUG();
			}
		}
	}

	collisionScan() {
		for (var k = 0; k < this.keyset1.length; k++) {
			for (var l = 0; l < this.keyset2.length; l++) {
				var arrayA = this.dictionary[ this.keyset1[k] ];
				var arrayB = this.dictionary[ this.keyset2[l] ];
				if (arrayA != undefined && arrayB != undefined) {
					for (var i = 0; i < arrayA.length; i++) {
						for (var j = 0; j < arrayB.length; j++) {
							var objA = arrayA[i];
							var objB = arrayB[j];

							if (objA != objB && this.checkDistance(objA,objB)) {
								objA.collisionWith(objB);
								objB.collisionWith(objA);
							}
						}
					}
				}
			}
		}
	}

	checkDistance(objA, objB) {
		var distX;
		if (objA.x <= objB.x) distX = floor(objB.x - objB.size/2) - floor(objA.x + objA.size/2);
		else distX = floor(objA.x - objA.size/2) - floor(objB.x + objB.size/2);
		var distY;
		if (objA.y <= objB.y) distY = floor(objB.y - objB.size/2) - floor(objA.y + objA.size/2);
		else distY = floor(objA.y - objA.size/2) - floor(objB.y + objB.size/2);

		if (distX < 0 && distY < 0) return true;
		else return false;
	}

	length() {
		var total_length = 0;
		for (var type in this.dictionary) {
			total_length += this.dictionary[type].length;
		}
		return total_length;
	}
}