const express = require('express')
const app = express()
const port = 1237


var jp = require('jsonpath');
var fs = require('fs');
var db = JSON.parse(fs.readFileSync('db.json'))
var core = require('./core');
var securekey = 'beti35'
var json = db[0];
var search = 'bobo'
function greaterThan3(name) {
	return typeof name === "string" && name.length > 3;
}
function getKeyPathById(json, id, path = []) {
	if (!json || !id) return [];
  
	if (json.id === id) return path;
  
	for (const container of json.containers) {
	  const result = getPathById(container, id, [...path, json.id]);
	  if (result.length) return result;
	}
  
	return [];
  }
function getKeyPathById(json, id, path = [], key) {
	if (!json || !id) return [];
  
	if (json.id === id) return path;
  
	for (const container of json.containers) {
	  const result = getPathById(container, id, [...path, json.attr[key]], key);
	  if (result.length) return result;
	}
  
	return [];
  }
  
app.get('/', (req, res) => {
	res.send('use key')
})
app.get('/:key', (req, res) => {
	req.params.key === securekey ? res.send(json) : res.sendStatus(403) 
})
app.get('/:key/id/:id', (req, res) => {
	req.params.key === securekey ? res.send(core.searchContainerById(json, req.params.id)) : res.sendStatus(403) 
})
app.get('/:key/search/:skey/:fn', (req, res) => {
	var fn = eval(req.params.fn)
	req.params.key === securekey ? res.send(core.searchContainerByCompareFn(json, req.params.skey, fn)) : res.sendStatus(403) 
})
app.get('/:key/multi/:skey/:fn', (req, res) => {
	var fn = eval(req.params.fn)
	console.log(req.params.fn)
	req.params.key === securekey ? res.send(core.searchContainerByCompareFn(json, req.params.skey, fn)) : res.sendStatus(403) 
})
app.listen(port, () => {
	console.log(`Example app listening on localhost:${port}/`)
})