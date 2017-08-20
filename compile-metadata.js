var fs = require('fs');

var aboutPath = './public/markdown/about.md';
var photosMetaPath = './public/metadata/photos-meta.txt';
var postsPath = './public/markdown/posts/';

var aboutMetaTarget = './dist/about-meta.json';
var photosMetaTarget = './dist/photos-meta.json';
var postsMetaTarget= './dist/posts-meta.json';


loadAboutJSON();
loadPhotosJSON();
loadPostsJSON();


/**
 * (sync) Returns the id (and filename) of a photo given its
 * relative path
 */
function getPhotoId(path) {
  fname = path.split('/').pop();
  id = fname.split('.')[0];
  return id;
}


/**
 * (aync) Load About page JSON data
 */
function loadAboutJSON() {
  // Write about meta data to disk
  return new Promise((resolve, reject) => {
    aboutMetaJSON = {
      id: 'about',
      path: aboutPath,
    };
    fs.writeFile(aboutMetaTarget, JSON.stringify(aboutMetaJSON), (err) => {
      if (err) reject('Write failed:\n' + err);
      resolve('Success');
    });
  }).catch((err) => {
    console.error(err);
  });
};


/**
 * (async) Load Photos page JSON data
 */
function loadPhotosJSON() {
  // Read photos meta file
  return new Promise((resolve, reject) => {
    fs.readFile(photosMetaPath, 'utf8', (err, buf) => {
      if (err) reject(err);
      resolve(buf);
    });
  // Split every photo entry
  }).then((buf) => {
    photos = buf.split('\n');
    return Promise.all(photos.filter((path) => {
      return path !== '';
    }));
  // Construct the json
  }).then((photos) => {
    return Promise.all(photos.map((path) => {
      if (path === '') return;
      id = getPhotoId(path);
      return {
        id: id,
        path: path,
        label: id,
      }
    }));
  // Write photos meta data to disk
  }).then((photosMetaJSON) => {
    fs.writeFile(photosMetaTarget, JSON.stringify(photosMetaJSON), (err) => {
      if (err) throw new Error('write failed:\n' + err);
    });
  }).catch((err) => {
    console.error(err);
  });
}


/**
 * (async) Load Posts page JSON data
 */
function loadPostsJSON() {
  // ls files in posts directory
  return new Promise((resolve, reject) => {
    fs.readdir(postsPath, (err, fnames) => {
      if (err) reject(err);
      resolve(fnames);
    });
  // Sanitize filenames
  }).then((fnames) => {
    return Promise.all(fnames.filter((file) => {
      return file.substring(0,1) !== '.';
    }));
  // Construct the json
  }).then((validFiles) => {
    return Promise.all(validFiles.map((file) => {
      return {
        id: file.substring(4,6),
        path: postsPath + file
      }
    }));
  // Write posts meta data to disk
  }).then((postMetaJSON) => {
    fs.writeFile(postsMetaTarget, JSON.stringify(postMetaJSON), (err) => {
      if (err) throw new Error('write failed:\n' + err);
    });
  }).catch((err) => {
    console.error(err);
  });
}
