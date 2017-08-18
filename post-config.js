var fs = require('fs');

var postsPath = './public/markdown/posts/';

function loadPostsJSON() {
  return new Promise((resolve, reject) => {
    fs.readdir(postsPath, (err, fnames) => {
      if (err) reject(err);
      resolve(fnames);
    });
  }).then((fnames) => {
    return Promise.all(fnames.filter((file) => {
      return file.substring(0,1) !== '.';
    }));
  }).then((validFiles) => {
    return Promise.all(validFiles.map((file) => {
      return {
        id: file.substring(4,6),
        path: postsPath + file
      }
    }));
  }).then((postMetaJSON) => {
    fs.writeFile('./lib/post-meta.json', JSON.stringify(postMetaJSON), (err) => {
      if (err) throw new Error('write failed');
    });
  }).catch((err) => {
    console.log(err);
  });
}

loadPostsJSON();
