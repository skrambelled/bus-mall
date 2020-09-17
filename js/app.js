'use strict';

var numDisplayed = 3;
var numRounds = 3;
var UI = document.getElementById('UI');
var products = {};
var persistentProducts = {};
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

var productsData = {
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
        label: 'appearances',
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

var persistentProductsData = {
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
        label: 'appearances',
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
  this.name = name;
  this.path = path;
  this.votes = 0;
  this.appearances = 0;
  this.currentlyShowing = 0;

  products[name] = this;
}

Product.prototype.render = function () {
  var image = document.createElement('img');
  UI.append(image);
  image.src = 'img/' + this.path;
  image.id = this.name;
  image.width = document.documentElement.clientWidth / (numDisplayed * 2);
  // image.height = document.documentElement.clientheight / numDisplayed;
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

  var keys = Object.keys(localStorage);

  if (keys.includes('persistentProducts'))
    persistentProducts = JSON.parse(localStorage.getItem('persistentProducts'));
  else
    // make a copy of the object, probably a better way to do this.
    // Just want to initialize the persistent data, even if
    // there are no votes or appearances yet.
    persistentProducts = JSON.parse(JSON.stringify(products));
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

  var luckyDucks = pickRandomNumbers(numDisplayed, setToChooseFrom);

  UI.innerHTML = null;
  for (let i = 0; i < luckyDucks.length; i++)
    products[keys[luckyDucks[i]]].render();
}

function pickRandomNumbers(howMany, setToChooseFrom) {
  // now select 'howMany' of our given set uniquely and randomly
  var luckyDucks = [];
  while (setToChooseFrom.length && howMany) {
    let rng = Math.floor(Math.random() * setToChooseFrom.length);
    luckyDucks.push(setToChooseFrom[rng]);
    setToChooseFrom.splice(rng, 1);
    howMany--;
  }

  // we've populated an array, with random values, lets return it
  return luckyDucks;
}

function getChartData(name) {
  if (name === 'session')
    return productsData;
  if (name === 'persistent')
    return persistentProductsData;
}

function makeChart(chartName, productsDict) {
  // make a canvas element for this session
  var container = document.createElement('div');
  UI.append(container);

  container.id = chartName + '-chart-container';
  container.class = 'chart-container';

  var chart = document.createElement('canvas');
  container.append(chart);
  chart.id = chartName;
  chart.responsive = false;
  chart.maintainAspectRatio = true;

  // make a chart
  var context = chart.getContext('2d');
  results = new Chart(context, getChartData(chartName));
  var keys = Object.keys(productsDict);

  // console.log(getChartData(chartName));
  // populate the chart
  for (let i = 0; i < keys.length; i++) {
    let product = productsDict[keys[i]];
    let hue = Math.floor(i / productsPath.length * 40);

    // console.log(product.name + ' : ' + product.votes);
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
  results.data.datasets[1].backgroundColor.push('hsla(' + (hue + 120) + ', 100%, 50%, 0.2)');
  results.data.datasets[1].borderColor.push('hsla(' + (hue + 120) + ', 100%, 50%, 1)');
  results.data.datasets[2].data.push(votes / appearances);
  results.data.datasets[2].backgroundColor.push('hsla(' + (hue + 220) + ', 100%, 50%, 0.2)');
  results.data.datasets[2].borderColor.push('hsla(' + (hue + 220) + ', 100%, 50%, 1)');
}

function mergeProducts() {
  var keys = Object.keys(products);

  // console.log(products);
  console.log(persistentProducts);

  for (let i = 0; i < keys.length; i++) {
    console.log(keys[i]);
    persistentProducts[keys[i]].votes += products[keys[i]].votes;
    persistentProducts[keys[i]].appearances += products[keys[i]].appearances;
  }
  localStorage.setItem('persistentProducts', JSON.stringify(persistentProducts));
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

  products[prod_name].votes++;
  // e.target.vote();
  // pickRandomProducts(numDisplayed);

  numRounds--;
  if (numRounds) {
    pickRandomProducts();
  } else {
    console.log('listener removed');
    UI.removeEventListener('click', handleClick);
    mergeProducts();
    UI.innerHTML = null;
    makeChart('session', products);
    makeChart('persistent', persistentProducts);
  }
}

UI.addEventListener('click', handleClick);

numDisplayed = parseInt(prompt('How many products would you like to see at one time?', 3));
numRounds = parseInt(prompt('How many rounds of voting?', 25));

// generate on instance of each product
generateGlobalProducts();

// generate an initial set of products
pickRandomProducts();
