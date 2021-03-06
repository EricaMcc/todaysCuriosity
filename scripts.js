import loadImage from "blueimp-load-image";
import todaysCuriosity from './todays-curiosity';
import george from './george.jpg';

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // alert('file api works')
} else {
  alert('Oh no, looks like your browser might be a bit old for this app to work. Maybe try the latest Chrome or Firefox.');
}

let curiosity;

const defaultImage = new Image();
defaultImage.src = george;
defaultImage.onload = function() {
  curiosity = new todaysCuriosity(defaultImage);
  imageSetup(defaultImage);
};

document.getElementById('file-input').onchange = function (e) {
  loadImage(
      e.target.files[0],
      imageSetup,
      {maxWidth: 2000} // Options
  );
};

// Initial sliders output value
document.querySelectorAll('.slider').forEach(slider => document.getElementById(`${slider.id}-output`).value = slider.value)

function imageSetup (img) {
  curiosity.baseImage = img;
  curiosity.paintInputImage();
  curiosity.createBrightpixels();

  // const {inputCanvas, outputCanvas} = curiosity.getReducedPixelBlocks();
  // const {inputCanvas, outputCanvas} = curiosity.getReversedPixelBlocks();

  const {inputCanvas, outputCanvas} = document.getElementsByClassName('method-type')[0].checked ? curiosity.getReducedPixelBlocks() : curiosity.getReversedPixelBlocks();

  const inputDiv = document.getElementById('input-display');
  inputDiv.appendChild(inputCanvas);
  const outputDiv = document.getElementById('output-display');
  outputDiv.appendChild(outputCanvas);
  
  SetupUpdateEvents(curiosity);
};

function SetupUpdateEvents(curiosity) {
  const updateAfterSliderChange = (event) => {
    const sliderOutputToBeUpdated = document.getElementById(`${event.target.id}-output`);
    sliderOutputToBeUpdated.value = event.target.value;

    const curiosityKeyToUpdate = event.target.dataset.key;
    const percentageKeys = ['reductionRatio', 'xOffset', 'yOffset'];

    if (percentageKeys.includes(curiosityKeyToUpdate)) {
      curiosity[curiosityKeyToUpdate] = event.target.value / 100;  
    } else {
      curiosity[curiosityKeyToUpdate] = event.target.value;  
    }
  
    // const {inputCanvas, outputCanvas} = curiosity.getReversedPixelBlocks();

    const {inputCanvas, outputCanvas} = document.getElementsByClassName('method-type')[0].checked ? curiosity.getReducedPixelBlocks() : curiosity.getReversedPixelBlocks();

    inputDiv.appendChild(inputCanvas);
    outputDiv.appendChild(outputCanvas);
  };

  const updateAfterRadioChange = (event) => {
    const {inputCanvas, outputCanvas} = document.getElementsByClassName('method-type')[0].checked ? curiosity.getReducedPixelBlocks() : curiosity.getReversedPixelBlocks();

    inputDiv.appendChild(inputCanvas);
    outputDiv.appendChild(outputCanvas);
  };

  const inputDiv = document.getElementById('input-display');
  const outputDiv = document.getElementById('output-display');
  
  const sliders = document.querySelectorAll('.slider');
  sliders.forEach(slider => slider.addEventListener('input', updateAfterSliderChange));

  const radios = document.querySelectorAll('input[type=radio]');
  radios.forEach(radio => radio.addEventListener('input', updateAfterRadioChange));
}

