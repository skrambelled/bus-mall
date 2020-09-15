'use strict';

var numDisplayed = 3;
var numRounds = 25;
var images = document.getElementById('images');
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

  products[name] = this;
}

Product.prototype.render = function () {
  var image = document.createElement('img');
  images.append(image);
  image.setAttribute('src', 'img/' + this.path);
  image.setAttribute('id', this.name);

  this.appearances++;
};

Product.prototype.renderResults = function () {
  var imageDiv = document.createElement('div');
  images.append(imageDiv);

  var image = document.createElement('img');
  imageDiv.append(image);

  image.setAttribute('src', 'img/' + this.path);
  image.setAttribute('id', this.name);

  var data = document.createElement('p');
  imageDiv.append(data);
  data.textContent = 'Votes: ' + this.votes;

  data = document.createElement('p');
  imageDiv.append(data);
  data.textContent = 'Appearances: ' + this.appearances;

  data = document.createElement('p');
  imageDiv.append(data);
  if (this.appearances)
    data.textContent = 'Popularity: ' + Math.round(100 * this.votes / this.appearances) + "%";
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
  images.innerHTML = null;

  var keys = Object.keys(products);

  var whichOnes = pickRandomNumbers(numDisplayed, keys.length);

  for (let i = 0; i < whichOnes.length; i++) {
    products[keys[whichOnes[i]]].render(i);
  }
}

function pickRandomNumbers(howMany, total) {
  // First make an array containining 'total' numbers
  // incrementing from 0 upwards
  // i.e. if total were 3 => [0,1,2]
  var num = [];
  for (let i = 0; i < total; i++) {
    num.push(i);
  }

  // now select 'howMany' of those numbers uniquely and randomly
  var luckyDucks = [];
  while (num.length && howMany) {
    let rng = Math.floor(Math.random() * num.length);
    let lucky = num[rng];
    num.splice(rng, 1);
    luckyDucks.push(lucky);
    howMany--;
  }

  // we've populated an array, with random values, lets return it
  return luckyDucks;
}

function revealResults() {
  images.innerHTML = null;

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
    images.removeEventListener('click', handleClick);
    revealResults();
  }
}

images.addEventListener('click', handleClick);

numDisplayed = prompt('How many products would you like to see at one time?', 3);
numRounds = prompt('How many rounds of voting?', 25);

generateGlobalProducts();
pickRandomProducts();
