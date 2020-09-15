'use strict';

var numDisplayed = 3;
var numRounds = 3;
var UI = document.getElementById('UI');
var products = {};
var results;

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

var cdata = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: '# of Votes',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      },
      {
        label: 'popularity',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }
    ]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
};

function Product(name, path) {
  this.path = path;
  this.name = name;
  this.votes = 0;
  this.appearances = 0;
  this.currentlyShowing = 0;

  products[name] = this;
}

Product.prototype.vote = function () {
  this.votes++;
};

Product.prototype.render = function () {
  var image = document.createElement('img');
  UI.append(image);
  image.src = 'img/' + this.path;
  image.id = this.name;
  // image.setAttribute('style', 'width: ' + (numDisplayed % 3) + ';');
  this.currentlyShowing = 1;

  this.appearances++;
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

  // make a canvas element
  var container = document.createElement('div');
  UI.append(container);

  container.id = 'chart-container';

  var chart = document.createElement('canvas');
  container.append(chart);
  chart.id = 'myChart';
  chart.maintainAspectRatio = false;

  // make a chart
  var context = document.getElementById('myChart').getContext('2d');
  results = new Chart(context, cdata);
  var keys = Object.keys(products);

  console.log(cdata);
  // populate the chart
  for (let i = 0; i < keys.length; i++) {
    let product = products[keys[i]];
    let hue = Math.floor(i / productsPath.length * 360);
    console.log('hue : ' + hue);

    console.log(product.name + ' : ' + product.votes);
    chartAddProduct(product.name, product.votes, product.appearances, hue);
  }
  results.update();
}

function chartAddProduct(name, votes, appearances, hue) {
  results.data.labels.push(name);
  results.data.datasets[0].data.push(votes);
  results.data.datasets[0].backgroundColor.push('hsla(' + hue + ', 100%, 50%, 0.2)');
  results.data.datasets[0].borderColor.push('hsla(' + hue + ', 100%, 50%, 1)');
  results.data.datasets[1].data.push(appearances);
  results.data.datasets[1].backgroundColor.push('hsla(' + hue + ', 100%, 50%, 0.2)');
  results.data.datasets[1].borderColor.push('hsla(' + hue + ', 100%, 50%, 1)');
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
