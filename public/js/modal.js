// Constants
var awsRoot = 'https://s3.amazonaws.com/budmondephotodump/',
    awsThumb = awsRoot + 'Thumbnails/',
    awsFullRes = awsRoot + 'FullResolution/';


// State Variables
var modalShown = false,
    currentImg = undefined;


// DOM Elements
var modal = document.getElementById('modal'),
    modalImg = document.getElementById('modal-img'),
    modalLabel = document.getElementById('modal-label'),
    modalLoader = document.getElementById('modal-loader');


// Event Listeners
/**
 * Activate modal upon click on a photo on spread.
 */
document.onclick = function(e) {
  if (!modalShown) {
    if (e.target.className === 'photo-asset') {
      showModal();
      setModal(e.target);
    }
  } else {
    if (e.target.className !== 'modal-img') {
      hideModal();
    } 
  }
}

/**
 * Photo navigation:
 * - Left, up: previous photo
 * - Right, down: next photo
 * - Anything else: hide modal
 */
document.onkeydown = function(e) {
  if (!modalShown) return;
  e.preventDefault();
  switch(e.keyCode) {
    case 37: // up
    case 38: // left
      incrPhoto(-1);
      break;
    case 39: // down
    case 40: // right
      incrPhoto(1);
      break;
    default:
      hideModal();
      break;
  }
}


// Helper Functions
/**
 * Returns the index of the element in the context of its parent
 * DOM node.
 */
var _getChildInd = function(node) {
  i = 0;
  while( (node = node.previousElementSibling) != null ) i++;
  return i;
}


// DOM Mutators
var showModal = function() {
  if (modalShown) return;
  modal.style.display = 'block';
}


var hideModal = function() {
  if (!modalShown) return;
  modal.style.display = 'none';
  modalShown = false;
}


var setModal = function(target) {
  // Remove previous img element
  modalImg.parentElement.removeChild(modalImg);

  // Create new DOM img element
  newImg = document.createElement('img');
  newImg.id = 'modal-img';
  newImg.className = 'modal-img';
  newImg.src = awsThumb + target.alt; // load thumb while buffering
  newImg.style.filter = 'brightness(50%)';

  // Insert img element to DOM
  modalLoader.style.display = 'block';
  modalLabel.parentElement.insertBefore(newImg, modalLabel);

  // Set text for modal
  text = target.parentElement.lastElementChild.innerText;
  modalLabel.innerHTML = text;

  // Load High Res Version
  newImg.src = awsFullRes + target.alt;
  newImg.onload = function() {
    newImg.style.filter = 'brightness(100%)';
    modalLoader.style.display = 'none';

    // Update state
    modalImg = newImg;
    currentImg = target;
    modalShown = true;
  }
}


/**
 * Changes the photo contained in the modal by given offset.
 * Positive offset implies to the right and vice versa.
 */
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
