var fs = require('fs');
var showdown = require('showdown'),
    converter = new showdown.Converter();

function renderMd(postMeta) {
  return new Promise((resolve, reject) => {
    fs.readFile(postMeta.path, 'utf8', (err, postMd) => {
      if (err) reject(err);
      resolve({
        id: postMeta.id,
        content: converter.makeHtml(postMd)
      });
    });
  });
}

module.exports = renderMd;
