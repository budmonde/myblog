var fs = require('fs');

var aboutPath = './public/markdown/about.md';
var photosPath = './public/meta/photos.txt';
var postsPath = './public/markdown/posts/';

var aboutTarget = './dist/about-meta.json';
var photosTarget = './dist/photos-meta.json';
var postsTarget = './dist/posts-meta.json';


loadAboutJSON();
loadPhotosJSON();
loadPostsJSON();


function loadAboutJSON() {
  return new Promise((resolve, reject) => {
    aboutMetaJSON = {
      id: 'about',
      path: aboutPath,
    };
    fs.writeFile(aboutTarget, JSON.stringify(aboutMetaJSON), (err) => {
      if (err) throw new Error('write failed:\n' + err);
    });
  }).catch((err) => {
    console.error(err);
  });
};


function loadPhotosJSON() {
  return new Promise((resolve, reject) => {
    fs.readFile(photosPath, 'utf8', (err, buf) => {
      if (err) reject(err);
      resolve(buf);
    });
  }).then((buf) => {
    photos = buf.split('\n');
    return Promise.all(photos.filter((url) => {
      return url !== '';
    }));
  }).then((photos) => {
    return Promise.all(photos.map((url) => {
      if (url === '') return;
      id = getPhotoId(url);
      return {
        id: id,
        url: url,
        label: id,
      }
    }));
  }).then((photosMetaJSON) => {
    fs.writeFile(photosTarget, JSON.stringify(photosMetaJSON), (err) => {
      if (err) throw new Error('write failed:\n' + err);
    });
  }).catch((err) => {
    console.error(err);
  });
}


function getPhotoId(url) {
  fname = url.split('/').pop();
  id = fname.split('.')[0];
  return id;
}


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
    fs.writeFile(postsTarget, JSON.stringify(postMetaJSON), (err) => {
      if (err) throw new Error('write failed:\n' + err);
    });
  }).catch((err) => {
    console.error(err);
  });
}
