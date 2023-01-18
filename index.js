const express = require('express')
const lang = require('./lang.json')
const app = express()
const port = 1237
const { v4: uuidv4 } = require('uuid');
var cookieParser = require('cookie-parser')
var jp = require('jsonpath');
var fs = require('fs');
var db = JSON.parse(fs.readFileSync('db.json'))
var core = require('./core');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
class Translate {
	constructor(locale, strings) {
		this.locale = locale;
		this.strings = strings;
	}
	t(key) {
		var r;
		this.strings[this.locale][key] !== undefined ? r = this.strings[this.locale][key] : r = key;
		return r;
	}
	setLocale(locale) {
		this.locale = locale;
	}
}

function getPathById(json, id, path = []) {
	if (!json || !id) return [];

	if (json.id === id) return path;

	for (const container of json.containers) {
		const result = getPathById(container, id, [...path, json.id]);
		if (result.length) return result;
	}

	return [];
}
function getKeyPathById(json, id, key, path = []) {
	if (!json || !id || !key) return [];

	if (json.id === id) return path;

	for (const container of json.containers) {
		if (container.attr && container.attr[key]) {
			const result = getKeyPathById(container, id, key, [...path, container.attr[key]]);
			if (result.length) return result;
		}
	}

	return [];
}

app.get('/', (req, res) => {
	//TODO: LOGIN PAGE ==> ADDS SCRIPT TO SAVE KEY COOKIE AND RECIDECT TO HOME PAGE
	var l = new Translate('en', lang)
	var sl = req.acceptsLanguages('pl', 'en')
	sl == false ? l.setLocale('en') : l.setLocale(sl)
	console.log(sl)
	const object = db.find(obj => obj.key === req.cookies.skey);
	if (object !== undefined) {
		res.render('pages/home', { title: object.key, object: object, l: l})
	}
	else {
		res.send({ 'error': 'Wrong Key' })
	}
})
app.get('/style.css', (req, res) => {
	res.sendFile(`${__dirname}/views/pages/style.css`)
})
app.get('/qr-scanner.min.js', (req, res) => {
	res.sendFile(`${__dirname}/qr-scanner.min.js`)
})
app.get('/qr-scanner-worker.min.js', (req, res) => {
	res.sendFile(`${__dirname}/qr-scanner-worker.min.js`)
})
app.get('/:akey', (req, res) => {
	const object = db.find(obj => obj.key === req.params.akey);
	object !== undefined ? res.send(object) : res.send({ 'error': 'Wrong Key' })
})
app.get('/:akey/path/:id', (req, res) => {
	const object = db.find(obj => obj.key === req.params.akey);
	object !== undefined ? res.send(getPathById(object, req.params.id)) : res.sendStatus(403)
})
app.get('/:akey/keypath/:id/:skey', (req, res) => {
	const object = db.find(obj => obj.key === req.params.akey);
	object !== undefined ? res.send(getKeyPathById(object, req.params.id, req.params.skey)) : res.sendStatus(403)
})
app.get('/:akey/id/:id', (req, res) => {
	const object = db.find(obj => obj.key === req.params.akey);
	object !== undefined ? res.send(core.searchContainerById(object, req.params.id)) : res.sendStatus(403)
})
app.get('/:akey/search/:skey/:fn', (req, res) => {
	var fn = eval(req.params.fn)
	const object = db.find(obj => obj.key === req.params.akey);
	object !== undefined ? res.send(core.searchContainerByCompareFn(object, req.params.skey, fn)) : res.sendStatus(403)
})
app.get('/:akey/multi/:skey/:fn', (req, res) => {
	var fn = eval(req.params.fn)
	console.log(req.params.fn)
	const object = db.find(obj => obj.key === req.params.akey);
	object !== undefined ? res.send(core.searchContainerByCompareFn(object, req.params.skey, fn)) : res.sendStatus(403)
})
app.post('/:akey/add/:id', (req, res) => {
	//console.log(req.body)
	//res.send('aaaaaaaa')
	const object = db.find(obj => obj.key === req.params.akey);
	var newContainer = {
		id: uuidv4(),
		attr: {},
		containers: []
	};
	newContainer.attr = { ...req.body };
	if (object !== undefined) {
		core.addContainer(object, req.params.id, newContainer)
		db[db.findIndex(obj => obj.key === req.params.akey)] = object;
		save()//fs.writeFileSync('db.json', JSON.stringify(db))
		res.send({
			status: 'success',
			newContainer: newContainer,
			id: newContainer.id
		})
	}
	else {
		res.sendStatus(401).send({ status: 'Bad Key' })
	}
})
app.delete('/:akey/delete/:id', (req, res) => {
	var object = db.find(obj => obj.key === req.params.akey);
	if (object !== undefined) {
		var object = core.deleteContainerById(object, req.params.id)
		db[db.findIndex(obj => obj.key === req.params.akey)] = object;
		save()//fs.writeFileSync('db.json', JSON.stringify(db))
		res.send({
			status: 'OK'
		})
	}
	else {
		res.sendStatus(401).send({ status: 'Bad key' })
	}
})
app.put('/:akey/move/:id/:newparentid', (req, res) => {
	var object = db.find(obj => obj.key === req.params.akey);
	if (object !== undefined) {
		var object = core.moveContainer(object, object, req.params.id, req.params.newparentid);
		if (object !== null) {
			db[db.findIndex(obj => obj.key === req.params.akey)] = object;
			save()//fs.writeFileSync('db.json', JSON.stringify(db))
			res.send({
				status: 'OK',
				moved: req.params.id,
				to: req.params.newparentid
			})
		}
		else {
			res.send({
				status: 'ERROR',
				description: 'An error occurred while moving item',
				moved: req.params.id,
				to: req.params.newparentid
			})
		}

	}
	else {
		res.sendStatus(401).send({ status: 'Bad key' })
	}
})
app.put('/:akey/edit/:id', (req, res) => {
	var object = db.find(obj => obj.key === req.params.akey);
	var attr = req.body;
	if (object !== undefined) {
		var object = core.editContainerAttrById(object, req.params.id, attr)
		db[db.findIndex(obj => obj.key === req.params.akey)] = object;
		save()//fs.writeFileSync('db.json', JSON.stringify(db))
		res.send({
			status: 'success',
			id: req.params.id
		})
	}
	else {
		res.sendStatus(401).send({ status: 'Bad Key' })
	}
})
function save() {
	fs.writeFileSync('db.json', JSON.stringify(db, null, 2))
}
app.get('/:akey/qr/', (req, res) => {
	const object = db.find(obj => obj.key === req.params.akey);
	object !== undefined ? res.send('https://quickchart.io/qr?text=' + req.params.key + '&light=0000&dark=09f&size=200&format=svg') : res.send({ 'error': 'Wrong Key' })
})

app.listen(port, () => {
	console.log(`Example app listening on http://localhost:${port}`)
})