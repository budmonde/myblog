function get(url) {
  return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = function(err) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            console.log(xhr.statusText);
          }
        }
      };
      xhr.onerror = function(err) {
        console.log(xhr.statusText);
      };
      xhr.send(null);
  });
};

function renderPhoto(photoJSON) {
  photoDiv = document.createElement('div');
  photoDiv.className = 'photo';
  photoDiv.setAttribute('id', photoJSON.id);

  photoImg = document.createElement('img');
  photoImg.className = 'photo-asset';
  photoImg.setAttribute('alt', photoJSON.id);
  photoImg.src = photoJSON.url;

  photoLabel = document.createElement('span');
  photoLabel.className = 'label';
  photoLabel.innerHTML = photoJSON.label;

  photoDiv.appendChild(photoImg);
  photoDiv.appendChild(photoLabel);

  return photoDiv;
};

var spread = document.getElementById('spread');
var cols = spread.children;

get('/api/photos').then(function(photos) {
  return Promise.all(photos.map(function(photoJSON, i) {
    bucket = i % 3;
    cols[bucket].appendChild(renderPhoto(photoJSON));
  }));
});
