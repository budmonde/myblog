// Global State
var modalShown = false;
var currentImg = undefined;

// DOM Elements
var modal = document.getElementById('modal');
var modalImg = document.getElementById('modal-img');
var modalLabel = document.getElementById('modal-label');
var modalLoader = document.getElementById('modal-loader');

// Helper Functions
var showModal = function() {
  if (modalShown) return;
  modal.style.display = "block";
}
var hideModal = function() {
  if (!modalShown) return;
  modal.style.display = "none";
  modalShown = false;
}
var setModal = function(target) {
  // Remove previous img element
  modalImg.parentElement.removeChild(modalImg);
  // Create new DOM img element
  newImg = document.createElement("img");
  newImg.id = "modal-img";
  newImg.className = "modal-img";
  // Incremental loading
  modalLoader.style.display = "block";
  newImg.style.filter = "brightness(50%)";
  newImg.src = 'https://s3.amazonaws.com/budmondephotodump/Thumbnails/' + target.alt;
  modalLabel.parentElement.insertBefore(newImg, modalLabel);
  // Set text for modal
  text = target.parentElement.lastElementChild.innerText;
  modalLabel.innerHTML = text;
  // Load High Res Version
  newImg.src = 'https://s3.amazonaws.com/budmondephotodump/FullResolution/' + target.alt;
  newImg.onload = function() {
    newImg.style.filter = "brightness(100%)";
    modalLoader.style.display = "none";
    // Update state
    modalImg = newImg;
    modalShown = true;
    currentImg = target;
  }
}
var incrPhoto = function(offset) {
  target = currentImg.parentElement;
  col = target.parentElement;

  rowi = _getChildInd(target);
  coli = _getChildInd(col);

  new_coli = (coli+offset +3) % 3;
  new_rowi = Math.floor(rowi + (coli+offset) / 3);

  newTargetParent = col.parentElement.children[new_coli].children[new_rowi];
  if (newTargetParent !== undefined)
    setModal(newTargetParent.firstElementChild);
  else
    return;
}
var _getChildInd = function(child) {
  i = 0;
  while( (child = child.previousElementSibling) != null ) i++;
  return i;
}

// Event Listeners
document.onclick = function(e) {
  if (e.target.className === "photo-asset") {
    showModal();
    setModal(e.target);
  }
}
document.onkeydown = function(e) {
  if (!modalShown) return;
  e.preventDefault();
  switch(e.keyCode) {
    case 37:
    case 38: // left
      incrPhoto(-1);
      break;
    case 39:
    case 40: // right
      incrPhoto(1);
      break;
    default:
      hideModal();
      break;
  }
}

