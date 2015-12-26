var cheerio = require('cheerio');


module.exports = function(html, config) {
  $ = cheerio.load(html);
  $('head').append('<link rel="stylesheet" href="/.fastack/fastack.css">');
  $('head').append('<script type="text/javascript" src="/.fastack/fastack.js"></script>')
  return $.html();
}
