'use strict';

var numDisplayed = 3;
var numRounds = 25;
var UI = document.getElementById('UI');
var products = {};

var productsPath = [
  'bag.jpg',
  'banana.jpg',
  'bathroom.jpg',
  'boots.jpg',
  'breakfast.jpg',
  'bubblegum.jpg',
  'chair.jpg',
  'cthulhu.jpg',
  'dog-duck.jpg',
  'dragon.jpg',
  'pen.jpg',
  'pet-sweep.jpg',
  'scissors.jpg',
  'shark.jpg',
  'sweep.png',
  'tauntaun.jpg',
  'unicorn.jpg',
  'usb.gif',
  'water-can.jpg',
  'wine-glass.jpg'
];

function Product(name, path) {
  this.path = path;
  this.name = name;
  this.votes = 0;
  this.appearances = 0;
  this.currentlyShowing = 0;

  products[name] = this;
}

Product.prototype.render = function () {
  var image = document.createElement('img');
  UI.append(image);
  image.setAttribute('src', 'img/' + this.path);
  image.setAttribute('id', this.name);
  this.currentlyShowing = 1;

  this.appearances++;
};

Product.prototype.renderResults = function () {
  var imageDiv = document.createElement('div');
  UI.append(imageDiv);

  var image = document.createElement('img');
  imageDiv.append(image);

  image.setAttribute('src', 'img/' + this.path);
  image.setAttribute('id', this.name);

  var data = document.createElement('p');
  imageDiv.append(data);
  data.textContent = this.name;

  data = document.createElement('p');
  imageDiv.append(data);
  data.textContent = 'Votes: ' + this.votes;

  data = document.createElement('p');
  imageDiv.append(data);
  data.textContent = 'Appearances: ' + this.appearances;

  data = document.createElement('p');
  imageDiv.append(data);
  if (this.appearances)
    data.textContent = 'Popularity: ' + Math.round(100 * this.votes / this.appearances) + '%';
  else
    data.textContent = 'Popularity: (did not appear)';
};

Product.prototype.vote = function () {
  this.votes++;
};

function generateGlobalProducts() {
  for (let i = 0; i < productsPath.length; i++) {
    let path = productsPath[i];
    let name = path.split('.')[0];
    new Product(name, path);
  }
}

function pickRandomProducts() {

  var setToChooseFrom = [];

  var keys = Object.keys(products);
  for (let i = 0; i < keys.length; i++) {
    if (!products[keys[i]].currentlyShowing)
      setToChooseFrom.push(i);
    else
      products[keys[i]].currentlyShowing = 0;
  }

  var whichOnes = pickRandomNumbers(numDisplayed, setToChooseFrom);

  UI.innerHTML = null;
  for (let i = 0; i < whichOnes.length; i++)
    products[keys[whichOnes[i]]].render(i);
}

function pickRandomNumbers(howMany, setToChooseFrom) {
  // now select 'howMany' of our given set uniquely and randomly
  var luckyDucks = [];
  while (setToChooseFrom.length && howMany) {
    let rng = Math.floor(Math.random() * setToChooseFrom.length);
    let lucky = setToChooseFrom[rng];
    setToChooseFrom.splice(rng, 1);
    luckyDucks.push(lucky);
    howMany--;
  }

  // we've populated an array, with random values, lets return it
  return luckyDucks;
}

function revealResults() {
  UI.innerHTML = null;

  var keys = Object.keys(products);

  for (let i = 0; i < keys.length; i++) {
    products[keys[i]].renderResults();
  }
}

function handleClick(e) {

  var prod_name = e.target.id;
  console.log('list has been clicked', e.target.id);

  // defensivve code in case they css hack
  // to click the container instead of the image
  if (!Object.keys(products).includes(prod_name)) {
    console.log('Triggered handleClick() on:', e.target);
    return;
  }

  products[prod_name].vote();
  // e.target.vote();
  // pickRandomProducts(numDisplayed);

  numRounds--;
  if (numRounds) {
    pickRandomProducts();
  } else {
    console.log('listener removed');
    UI.removeEventListener('click', handleClick);
    revealResults();
  }
}

UI.addEventListener('click', handleClick);

numDisplayed = parseInt(prompt('How many products would you like to see at one time?', 3));
numRounds = parseInt(prompt('How many rounds of voting?', 25));

// generate on instance of each product
generateGlobalProducts();

// generate an initial set of products
pickRandomProducts();
