function searchContainerById(json, id) {
	if (!json || !id) return null;

	if (json.id === id) return json;

	for (const container of json.containers) {
		const result = searchContainerById(container, id);
		if (result) return result;
	}

	return null;
}
function addContainer(json /*DB Data*/, parentId /*uuid of the parent container*/, newContainer /*new container object*/) {
	//Add container
	if (!json || !parentId || !newContainer) return json;

	if (json.id === parentId) {
		json.containers.push(newContainer);
		return json;
	}

	for (const container of json.containers) {
		addContainer(container, parentId, newContainer);
	}

	return json;
}
function moveContainer(global_json,json /*DB Data*/,  thisId /*uuid of the container you want to move*/, newParentId /*uuid of the new container object*/) {
	//Add container
	if (!json || !thisId || !newParentId) return json;
	var thisContainer = searchContainerById(global_json, thisId)
	console.log("INIT---------",thisContainer)
	if(thisContainer !== null && thisContainer !== undefined){
		console.log("THIS CONTAINER GUT",json.id)
		if (json.id === newParentId) {
			
			console.log("FINDED", json)
			json.containers.push(thisContainer);
			console.log("PUSHED", json.containers)
			deleteContainerById(global_json, thisId);
			return json;
		}
		else{
			for (const container of json.containers) {
				moveContainer(global_json,container, thisId, newParentId);
			}
		}
	
		return json;
	}
	else {
		console.log("NULL ERROR",thisContainer)
		return null
	}
	
}
function editContainerAttrById(json, id, attr){
	//Add container
	if (!json || !id|| !attr) return json;
	if (json.id === id) {
		json.attr = attr;
		return json;
	}
	else {
		for (const container of json.containers) {
			editContainerAttrById(container, id, attr);
		}
	}

	return json;
}
function deleteContainerById(json, id) {
	if (!json || !id) return json;
  
	if (json.id === id) {
	  return null;
	}
  
	for (let i = 0; i < json.containers.length; i++) {
	  const container = json.containers[i];
	  const result = deleteContainerById(container, id);
	  if (result === null) {
		json.containers.splice(i, 1);
		return json;
	  }
	}
  
	return json;
  }
  
function searchContainerByCompareFnArray(json, key, compareFns) {
	/*
	This function searches
	*/
	if (!json || !key || !compareFns || !compareFns.length) return [];

	let result = [];
	if (json.attr && compareFns.every((compareFn) => compareFn(json.attr[key]))) {
		result.push(json);
	}

	for (const container of json.containers) {
		result = result.concat(searchContainerByComapreFnArray(container, key, compareFns));
	}

	return result;
}

function searchContainerByCompareFn(json /* db data */, key /* key to search */, compareFn /*Compiration functunction eg. `(x)=>x>2`*/) {
	//Search Containers
	if (!json || !key || !compareFn) return [];

	let result = [];
	if (json.attr && compareFn(json.attr[key])) result.push(json);

	for (const container of json.containers) {
		result = result.concat(searchContainerByCompareFn(container, key, compareFn));
	}

	return result;
}
var core = {
	searchContainerByCompareFn: searchContainerByCompareFn,
	searchContainerByCompareFnArray: searchContainerByCompareFnArray,
	searchContainerById: searchContainerById,
	addContainer: addContainer,
	deleteContainerById: deleteContainerById,
	moveContainer: moveContainer,
	editContainerAttrById, editContainerAttrById
}
module.exports = core;