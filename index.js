var jp = require('jsonpath');
var db = {
	"id": "c5f30da5-dd52-4114-9bcc-1b806310145d",
	"key": "70ba33708cbfb103f1a8e34afef333ba7dc021022b2d9aaa583aabb8058d8d67",
	"home_attr": {
		"name": "bobo"
	},
	"containers": [
		{
			"id": "52ce978a-0b97-4a34-ad44-ade4d7cf366b",
			"attr": {
				"name": "Bobosus",
				"type.size": "XL"
			},
			"containers": []
		},
		{
			"id": "4bdb7473-f64a-4b7d-a392-a541d8eb9394",
			"attr": {
				"name": "Spak",
				"type.size": "Medium"
			},
			"containers": [
				{
					"id": "d07f1229-2b16-470f-a839-3ae4991579e6",
					"attr": {
						"name": "Spak",
						"type.size": "Small"
					},
					"containers": []
				}
			]
		},
		{
			"id": "f35435fe-1b81-4156-8be8-806bad84dc55",
			"attr": {
				"name": "Spak",
				"type.size": "Big"
			},
			"containers": []
		}
	]
}
var json = db;
var search = '52ce978a-0b97-4a34-ad44-ade4d7cf366b'
var namequery = `$.containers[?(@.attr.name == 'Max')]`
var names = jp.query(db, `$.containers..[?(@.id=="${search}")]`);
const valueExists = json.containers.some(container => container.attr.name == 'Spk');
function greaterThan3(name) {
	return typeof name === "string" && name.length > 3;
}

  

  const key = "name";
  const compareFn = (name) => typeof name === "string" ? name.includes('a') : false;
  const containers = searchContainerByCompareFn(json, key, compareFn);
  
  console.log(containers);
  

