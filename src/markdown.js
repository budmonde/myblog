var fs = require('fs');
var showdown = require('showdown'),
    converter = new showdown.Converter();

function renderMD(file) {
  fpath = './public/markdown/' + file + '.md';
  return new Promise((resolve, reject) => {
    fs.readFile(fpath, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(converter.makeHtml(data));
    });
  });
}

module.exports = renderMD;
