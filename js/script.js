const global = {
  currentPage: window.location.pathname,
};
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-kSsmC6NpSnHcjPty4kPhW9ua",
  },
};

function indexEventListeners() {
  const toggleButton = document.querySelector(".nav__mobile-menu-toggle");
  const mobileMenu = document.querySelector(".nav__mobile-menu-items");

  toggleButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("active");
  });
}
async function onIndexPage() {
  try {
    const trendingData = await getTrendingData();
    displayTrendingData(trendingData);
  } catch (error) {
    console.log(error);
  }
}
function displayTrendingData(trendingData) {
  const cardContainer = document.querySelector(".card__container");
  const coinData = trendingData.coins;
  coinData.forEach((coin) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `    <div class="name">
    <img
      src="${coin.item.small}"
      alt=""
    />
    <h2>${coin.item.name}</h2>
  </div>
  <p class="coin-price">Price: $${coin.item.data.price.toFixed(2)}</p>
  <p class="priceChange24">24h: ${coin.item.data.price_change_percentage_24h.usd.toFixed(
    2
  )}%</p>
  <p class="volume24Hours">24h Volume: ${coin.item.data.total_volume}</p>
  <p class="marketCap">Market Cap: ${coin.item.data.market_cap}</p>`;
    cardContainer.appendChild(div);

    // change color of priceChange24 if + and -
    const priceChangePercent24 = div.querySelector(".priceChange24");

    colorChange(
      priceChangePercent24,
      coin.item.data.price_change_percentage_24h.usd
    );
  });
}
function colorChange(elementToChange, changePercentage) {
  if (changePercentage > 0) {
    elementToChange.classList.add("gain");
  } else {
    elementToChange.classList.remove("gain");
  }
}
async function getTrendingData() {
  const apiURL = "https://api.coingecko.com/api/v3/search/trending";
  const response = await fetch(apiURL, options);
  if (!response.ok) {
    throw new Error("Error on response");
  }
  return await response.json();
}

async function onSearchPage() {
  const coinToSearch = window.location.search.split("=")[1];
  if (coinToSearch !== "") {
    try {
      const searchData = await getSearchData(coinToSearch);

      console.log(searchData);
      // //if no coins found, return
      // if (coinsIDArray.length === 0) {
      //   alert("no coins found D:");
      //   return;
      // }
      displaySearchInfo(searchData);
    } catch (error) {
      console.log(error);
      return;
    }
  } else {
    alert("Please enter an input");
  }
}

function displaySearchInfo(searchData) {
  const coinsInfo = searchData.coins;
  if (searchData.length === 0) {
    alert("No coins found D:");
    return;
  }
  const cardContainer = document.querySelector(".card__container");
  coinsInfo.forEach((coin) => {
    const a = document.createElement("a");
    a.setAttribute("href", `./coin-details.html?id=${coin.id}`);
    a.innerHTML = `        <div class="card">
<img
  src="${coin.large}"
  alt=""
  class="search-card-image"
/>
<h2 class="search-card-name">${coin.name}</h2>
<p class="search-card-symbol">${coin.symbol}</p>
<p class="search-card-mcRank">MC Rank #${
      coin.market_cap_rank === null ? "N/A" : coin.market_cap_rank
    }</p>
</div>`;
    cardContainer.appendChild(a);
  });
}

// async function createCardInfo(coinsIDArray) {
//   for (const coin of coinsIDArray) {
//     try {
//       const coinDetails = await getCoinDetails(coin);
//       displayCoinDetails(coinDetails);
//     } catch (error) {
//       console.error(`Error fetching details for ${coin}:`, error);
//     }
//   }
// }

// async function getCoinDetails(coinID) {
//   const coinDetailsUrl = `https://api.coingecko.com/api/v3/coins/${coinID}`;
//   const response = await fetch(coinDetailsUrl, options);
//   if (!response.ok) {
//     throw new Error("Error on response");
//   }
//   return await response.json();
// }

// function displaySearchInfo(coinDetails) {

// }

// function displaySearchData(coinID) {

//   coinsIDArray.forEach((coin) => {
//     const div = document.createElement("div");
//     div.classList.add("card");
//     div.innerHTML = `    <div class="name">
//     <img
//       src="${coin.item.small}"
//       alt=""
//     />
//     <h2>${coin.item.name}</h2>
//   </div>
//   <p class="coin-price">Price: $${coin.item.data.price.toFixed(2)}</p>
//   <p class="priceChange24">24h: ${coin.item.data.price_change_percentage_24h.usd.toFixed(
//     2
//   )}%</p>
//   <p class="volume24Hours">24h Volume: ${coin.item.data.total_volume}</p>
//   <p class="marketCap">Market Cap: ${coin.item.data.market_cap}</p>`;
//     cardContainer.appendChild(div);

//     // change color of priceChange24 if + and -
//     const priceChangePercent24 = div.querySelector(".priceChange24");

//     colorChange(
//       priceChangePercent24,
//       coin.item.data.price_change_percentage_24h.usd
//     );
//   });
// }

// function getCoinIDs(searchData) {
//   const coinsSearchData = searchData.coins;
//   const coinsIDArray = [];
//   coinsSearchData.forEach((coin) => {
//     coinsIDArray.push(coin.id);
//   });
//   return coinsIDArray;
// }

async function getSearchData(coinToSearch) {
  const apiUrlSearch = `https://api.coingecko.com/api/v3/search?query=${coinToSearch}`;
  const response = await fetch(apiUrlSearch, options); // Added 'await' here
  if (!response.ok) {
    throw new Error("Error on response");
  }
  return await response.json();
}

function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      indexEventListeners();
      onIndexPage();
      break;
    case "/search.html":
      onSearchPage();
      console.log("on search page");
      break;
  }
}

document.addEventListener("DOMContentLoaded", init);
