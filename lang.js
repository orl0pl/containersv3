// MultiLang - BdR 2016
// JavaScript object to handle multilanguage, load phrases from JSON etc.

var l = (langjson, lang)=>{
	// variables
	this.phrases = langjson;

	// language code from parameter or if null then default to browser language preference
	// Keep only first two characters, for example 'en-US' -> 'en', or 'nl-NL' -> 'nl' etc.
	this.selectedLanguage = lang;
	

	this.setLanguage = function(langcode) {

		// check if language code <langcode> does not exist in available translations in json file
		// For example, available translated texts in json are 'en' and 'fr', but client language is 'es'
		if (!this.phrases.hasOwnProperty(langcode)) {
			// doesn't exist so default to the first available language, i.e. the top-most language in json file
			
			// NOTE: the order of properties in a JSON object are not *guaranteed* to be the same as loading time,
			// however in practice all browsers do return them in order
			for (var key in this.phrases) {
				if (this.phrases.hasOwnProperty(key)) {
					langcode = key; // take the first language code
					break;
				};
			};
		};

		// set as selected language code
		this.selectedLanguage = langcode;
	};

	this.g = function(key) {
		// get key phrase
		var str;

		// check if any languages were loaded
		if (this.phrases[this.selectedLanguage]) str = this.phrases[this.selectedLanguage][key];

		// if key does not exist, return the literal key
		str = (str || key);

		return str;
	};
}
module.exports = l;