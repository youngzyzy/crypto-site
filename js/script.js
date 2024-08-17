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

async function getSearchData(coinToSearch) {
  const apiUrlSearch = `https://api.coingecko.com/api/v3/search?query=${coinToSearch}`;
  const response = await fetch(apiUrlSearch, options); // Added 'await' here
  if (!response.ok) {
    throw new Error("Error on response");
  }
  return await response.json();
}
async function onCoinDetailsPage() {
  const coinToDisplay = window.location.search.split("=")[1];
  console.log(coinToDisplay);
  if (coinToDisplay !== "") {
    try {
      const coinData = await getCoinData(coinToDisplay);

      displayCoinDetails(coinData);
    } catch (error) {
      console.log(error);
      return;
    }
  } else {
    alert("No Coin to Display");
  }
}

function displayCoinDetails(coinData) {
  console.log(coinData);
  const cardInfoContainer = document.querySelector(".card-info__container");
  const div = document.createElement("div");
  div.classList.add("card-info");
  div.innerHTML = `   <img
  src="${coinData.image.large}"
  alt="${coinData.name}"
/>
<div class="card-info-main-container">
  <div class="card-info-title">
    <h2>${coinData.name}</h2>
    <p>#${coinData.market_cap_rank}</p>
  </div>
  <div class="card-info-price">
    <p>$${
      Math.abs(coinData.market_data.current_price.usd) >= 0.1
        ? coinData.market_data.current_price.usd.toLocaleString()
        : coinData.market_data.current_price.usd.toExponential(2)
    }</p>
    <p>${coinData.market_data.market_cap_change_percentage_24h.toFixed(2)}%</p>
  </div>
</div>
<div class="card-info-section-container">
  <div class="card-info-section">
    <p>Market Cap</p>
    <p>$${coinData.market_data.market_cap.usd.toLocaleString()}</p>
  </div>
  <div class="card-info-section">
    <p>Fully Diluted Valuation</p>
    <p>$${coinData.market_data.fully_diluted_valuation.usd.toLocaleString()}</p>
  </div>
  <div class="card-info-section">
    <p>Total Trading Volume</p>
    <p>$${coinData.market_data.total_volume.usd.toLocaleString()}</p>
  </div>
  <div class="card-info-section">
    <p>Circulating Supply</p>
    <p>${coinData.market_data.circulating_supply.toLocaleString()}</p>
  </div>
  <div class="card-info-section">
    <p>Total Supply</p>
    <p>${coinData.market_data.total_supply.toLocaleString()}</p>
  </div>
  <div class="card-info-section">
    <p>Max Supply</p>
    <p>${
      coinData.market_data.max_supply === null
        ? "N.A"
        : coinData.market_data.max_supply.toLocaleString()
    }</p>
  </div>
</div>`;
  cardInfoContainer.appendChild(div);
  const historicalPriceContainer = document.querySelector(
    ".historical-price__container"
  );
  const divTwo = document.createElement("div");
  divTwo.classList.add("historical-price");
  divTwo.innerHTML = `     <h2 class="historical-price-heading">Historical Price</h2>
  <div class="historical-price-section-container">
    <div class="historical-price-section">
      <p>24h % Change</p>
      <p>${coinData.market_data.market_cap_change_percentage_24h.toFixed(
        2
      )}%</p>
    </div>
    <div class="historical-price-section">
      <p>7d % Change</p>
      <p>${coinData.market_data.price_change_percentage_7d.toFixed(2)}%</p>
    </div>
    <div class="historical-price-section">
      <p>All Time High</p>
      <div class="historical-price-section-right">
        <div class="historical-price-section-top">
          <p>$${coinData.market_data.ath.usd.toLocaleString()}</p>
          <p>${coinData.market_data.ath_change_percentage.usd.toFixed(2)}%</p>
        </div>
        <div class="historical-price-section-bottom">
          <p>${formatReadableDate(coinData.market_data.ath_date.usd)}</p>
        </div>
      </div>
    </div>
    <div class="historical-price-section">
      <p>All Time Low</p>
      <div class="historical-price-section-right">
        <div class="historical-price-section-top">
          <p>$${coinData.market_data.atl.usd.toLocaleString()}</p>
          <p>${coinData.market_data.atl_change_percentage.usd.toFixed(2)}%</p>
        </div>
        <div class="historical-price-section-bottom">
          <p>${formatReadableDate(coinData.market_data.atl_date.usd)}</p>
        </div>
      </div>
    </div>
  </div>`;
  historicalPriceContainer.appendChild(divTwo);
}
async function getCoinData(coinToDisplay) {
  const apiURL = `https://api.coingecko.com/api/v3/coins/${coinToDisplay}`;
  const response = await fetch(apiURL, options);
  if (!response.ok) {
    throw new Error("Error on response");
  }
  return await response.json();
}
function formatReadableDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      indexEventListeners();
      onIndexPage();
      break;
    case "/search.html":
      indexEventListeners();
      onSearchPage();
      console.log("on search page");
      break;
    case "/coin-details.html":
      onCoinDetailsPage();
  }
}

document.addEventListener("DOMContentLoaded", init);
