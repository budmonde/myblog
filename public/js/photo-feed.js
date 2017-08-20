// Constants
var defaultBatchSize = 30;
var awsThumb = 'https://s3.amazonaws.com/budmondephotodump/Thumbnails/';


// State Variables
var photosFetched = 0;


// Onload execution
renderBatchPhotos(defaultBatchSize);


// Event Listeners
/**
 * Event Listener for fetching and rendering new more photos if the page
 * is scrolled to the very bottom. The event listener is disabled if there
 * are no more photos to fetch.
 */
document.onscroll = function(e) {
  if (window.scrollY == getDocumentHeight() - window.innerHeight) {
    renderBatchPhotos(defaultBatchSize).then(function(res) {
      if(res === null)
        document.onscroll = null;
    });
  }
}


// Helper Functions
/**
 * (sync) Returns the height of the document in pixels.
 */
function getDocumentHeight() {
  body = document.body;
  html = document.documentElement;
  return Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);
}


/**
 * (sync) Returns a fresh DOM element rendering the a photo as
 * specified by the photoJSON object with fields:
 * - id: id and name of the file
 * - path: relative path of the photo in the repository
 * - label: the label that should be displayed with the photo.
 */
function renderPhoto(photoJSON) {
  // create parent div.photo
  photoDiv = document.createElement('div');
  photoDiv.className = 'photo';
  photoDiv.setAttribute('id', photoJSON.id);

  // create child img
  photoImg = document.createElement('img');
  photoImg.className = 'photo-asset';
  photoImg.setAttribute('alt', photoJSON.path);
  photoImg.src = awsThumb + photoJSON.path;
  photoDiv.appendChild(photoImg);

  // create child span.label
  photoLabel = document.createElement('span');
  photoLabel.className = 'label';
  photoLabel.innerHTML = photoJSON.label;
  photoDiv.appendChild(photoLabel);

  return photoDiv;
};


/**
 * (async) Returns a promise for a get request to a given
 * JSON endpoint with a query variable and a query value.
 */
function get(endpoint, queryVar, queryVal) {
  return new Promise(function(resolve, reject) {
      xhr = new XMLHttpRequest();
      fullPath = endpoint + '?' + queryVar + '=' + queryVal;
      xhr.open('GET', fullPath, true);
      xhr.onload = function(err) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(xhr.statusText);
          }
        }
      };
      xhr.onerror = function(err) {
        reject(xhr.statusText);
      };
      xhr.send(null);
  });
};


/**
 * (async) Returns a promise to fetch and render a set number of
 * photos into the spread as specified by the batchSize. Returns a
 * null promise if there are no photos left to fetch and render.
 */
function renderBatchPhotos(batchSize) {
  spread = document.getElementById('spread');
  cols = spread.children;
  limit = photosFetched + batchSize;

  return get('/api/photos', 'limit', limit).then(function(photos) {
    if (photos.length === 0)
      return Promise.resolve(null);
    return Promise.all(photos.map(function(photoJSON, i) {
      bucket = i % 3;
      cols[bucket].appendChild(renderPhoto(photoJSON));
      photosFetched ++;
    }));
  });
}
