function searchContainerById(json, id) {
	if (!json || !id) return null;

	if (json.id === id) return json;

	for (const container of json.containers) {
		const result = searchContainerById(container, id);
		if (result) return result;
	}

	return null;
}
function searchContainerByComapreFnArray(json, key, compareFns) {
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
  
function searchContainerByCompareFn(json, key, compareFn) {
	/*
	This function searches 
	*/
	if (!json || !key || !compareFn) return [];
  
	let result = [];
	if (json.attr && compareFn(json.attr[key])) result.push(json);
  
	for (const container of json.containers) {
	  result = result.concat(searchContainerByCompareFn(container, key, compareFn));
	}
  
	return result;
  }