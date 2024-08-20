const global = {
  currentPage: window.location.pathname,
  search: {
    page: 1,
    totalPages: 8,
  },
  exchanges: {
    page: 1,
    totalPages: 8,
    dataOutputted: 0,
    amountToOutput: 25,
  },
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
    const a = document.createElement("a");
    a.setAttribute("href", `./coin-details.html?id=${coin.item.id}`);
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `    <div class="name">
    <img
      src="${coin.item.small}"
      alt=""
    />
    <h2>${coin.item.name}</h2>
  </div>
  <p class="coin-price">Price: $${
    Math.abs(coin.item.data.price) >= 0.01
      ? coin.item.data.price.toLocaleString()
      : coin.item.data.price.toExponential(2)
  }</p>
  <p class="priceChange24">24h: ${coin.item.data.price_change_percentage_24h.usd.toFixed(
    2
  )}%</p>
  <p class="volume24Hours">24h Volume: ${coin.item.data.total_volume}</p>
  <p class="marketCap">Market Cap: ${coin.item.data.market_cap}</p>`;
    a.appendChild(div);
    cardContainer.appendChild(a);

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
  const response = await fetch(apiUrlSearch, options);
  if (!response.ok) {
    throw new Error("Error on response");
  }
  return await response.json();
}
async function onCoinDetailsPage() {
  const coinToDisplay = window.location.search.split("=")[1];

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
    <p class="card-info-percent-24">${coinData.market_data.market_cap_change_percentage_24h.toFixed(
      2
    )}%</p>
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
      <p class="historical-price-change-24">${coinData.market_data.market_cap_change_percentage_24h.toFixed(
        2
      )}%</p>
    </div>
    <div class="historical-price-section">
      <p>7d % Change</p>
      <p class="historical-price-change-7">${coinData.market_data.price_change_percentage_7d.toFixed(
        2
      )}%</p>
    </div>
    <div class="historical-price-section">
      <p>All Time High</p>
      <div class="historical-price-section-right">
        <div class="historical-price-section-top">
          <p>$${coinData.market_data.ath.usd.toLocaleString()}</p>
          <p class="historical-price-ath-percent-change">${coinData.market_data.ath_change_percentage.usd.toFixed(
            2
          )}%</p>
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
          <p class="historical-price-atl-percent-change">${coinData.market_data.atl_change_percentage.usd.toFixed(
            2
          )}%</p>
        </div>
        <div class="historical-price-section-bottom">
          <p>${formatReadableDate(coinData.market_data.atl_date.usd)}</p>
        </div>
      </div>
    </div>
  </div>`;
  historicalPriceContainer.appendChild(divTwo);

  // change color of all elements w percent if greater than 0 (green), and less than 0 (red)
  const cardInfoPercent24 = document.querySelector(".card-info-percent-24");
  const historicalPricePercent24 = document.querySelector(
    ".historical-price-change-24"
  );
  const historicalPricePercent7 = document.querySelector(
    ".historical-price-change-7"
  );
  const historicalPriceAthPercent = document.querySelector(
    ".historical-price-ath-percent-change"
  );
  const historicalPriceAtlPercent = document.querySelector(
    ".historical-price-atl-percent-change"
  );
  colorChange(
    cardInfoPercent24,
    coinData.market_data.market_cap_change_percentage_24h
  );
  colorChange(
    historicalPricePercent24,
    coinData.market_data.market_cap_change_percentage_24h
  );
  colorChange(
    historicalPricePercent7,
    coinData.market_data.price_change_percentage_7d
  );
  colorChange(
    historicalPriceAthPercent,
    coinData.market_data.ath_change_percentage.usd
  );
  colorChange(
    historicalPriceAtlPercent,
    coinData.market_data.atl_change_percentage.usd
  );
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

async function onExchangesPage() {
  try {
    const pageData = await getPageData(global.search.page);
    console.log(pageData);
    displayPageData(pageData);
  } catch (error) {
    console.log(error);
    return;
  }
}

async function getPageData(pageNumber) {
  const apiUrlSearch = `https://api.coingecko.com/api/v3/exchanges?per_page=25&page=${pageNumber}}`;
  const response = await fetch(apiUrlSearch, options);
  if (!response.ok) {
    throw new Error("Error on response");
  }
  return await response.json();
}

function displayPageData(pageData) {
  const cardContainer = document.querySelector(".card__container");
  const paginationDiv = document.querySelector(".pagination");
  cardContainer.innerHTML = "";

  // paginationDiv.innerHTML = "";

  // document.querySelector(".pagination").innerHTML = ``;

  pageData.forEach((page) => {
    const a = document.createElement("a");
    a.setAttribute("href", `./exchange-details.html?id=${page.id}`);
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = ` <div class="card-titleAndImg">
    <img
      src="${page.image}"
      alt="${page.name}"
    />
    <h2>${page.name}</h2>
  </div>
  <div class="card-trustScore">
    <p>Trust Score</p>
    <p class="card-trustScore-score">${page.trust_score}/10</p>
  </div>
  <div class="card-tradeVolume">
    <p>Trade Volume 24h (BTC)</p>
    <p>${page.trade_volume_24h_btc.toFixed(2)}</p>
  </div>`;
    a.appendChild(div);

    cardContainer.appendChild(a);

    const trustScoreElement = div.querySelector(".card-trustScore-score");
    trustColorChange(trustScoreElement, page.trust_score);
  });

  // const pageNumberDiv = document.querySelector(".pageNumber");
  // pageNumberDiv.innerHTML = `<p>Page ${global.search.page} of ${global.search.totalPages}</p>`;
  displayPagination();
}

function displayPagination() {
  const paginationDiv = document.querySelector(".pagination__buttons");
  paginationDiv.innerHTML = `          <button class="pagination__buttons-prev">Prev</button>
<button class="pagination__buttons-next">Next</button>`;

  const pageNumberDiv = document.querySelector(".pageNumber");

  pageNumberDiv.innerHTML = `<p>Page ${global.search.page} of ${global.search.totalPages}</p>`;

  // Disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector(".pagination__buttons-prev").disabled = true;
  }
  if (global.search.page === global.search.totalPages) {
    document.querySelector(".pagination__buttons-next").disabled = true;
  }
  //next page
  document
    .querySelector(".pagination__buttons-next")
    .addEventListener("click", async () => {
      global.search.page++;
      const pageData = await getPageData(global.search.page);
      displayPageData(pageData);
    });
  // Prev page
  document
    .querySelector(".pagination__buttons-prev")
    .addEventListener("click", async () => {
      global.search.page--;
      const pageData = await getPageData(global.search.page);
      displayPageData(pageData);
    });
}

async function onCategoriesPage() {
  try {
    const categoriesData = await getCategoriesData();
    displayCategoriesData(categoriesData);
  } catch (error) {
    console.log(error);
    return;
  }
}
function displayCategoriesData(categoriesData) {
  const cardContainer = document.querySelector(".card__container");
  const paginationDiv = document.querySelector(".pagination");
  cardContainer.innerHTML = "";
  // console.log(categoriesData);
  for (
    let i = global.exchanges.dataOutputted;
    i < global.exchanges.amountToOutput;
    i++
  ) {
    const a = document.createElement("a");
    a.setAttribute(
      "href",
      `./categories-details.html?id=${categoriesData[i].id}`
    );
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `    <div class="categories-title">
      <h2>${categoriesData[i].name}</h2>
      <p class="categoriesPercent24">${categoriesData[
        i
      ].market_cap_change_24h.toFixed(2)}%</p>
    </div>
    <div class="categories-top-gainers">
      <p class="categories-top-gainers-title">Top Gainers</p>
      <div class="categories-top-gainers-images">
        <img
          src="${categoriesData[i].top_3_coins[0]}"
          alt=""
        />
        <img
          src="${categoriesData[i].top_3_coins[1]}"
          alt=""
        />
        <img
          src="${categoriesData[i].top_3_coins[2]}"
          alt=""
        />
      </div>
    </div>
    <div class="categories-section">
      <p>Market Cap</p>
      <p>$${Math.round(categoriesData[i].market_cap).toLocaleString()}</p>
    </div>
    <div class="categories-section">
      <p>24h Volume</p>
      <p>$${Math.round(categoriesData[i].volume_24h).toLocaleString()}</p>
    </div>`;
    a.append(div);
    cardContainer.appendChild(a);

    const categoriesPercent = div.querySelector(".categoriesPercent24");
    colorChange(categoriesPercent, categoriesData[i].market_cap_change_24h);
  }

  const pageNumberDiv = document.querySelector(".pageNumber");
  pageNumberDiv.innerHTML = `<p>Page ${global.exchanges.page} of ${global.exchanges.totalPages}</p>`;
  displayCategoriesPagination();
}
function displayCategoriesPagination() {
  const paginationDiv = document.querySelector(".pagination__buttons");
  paginationDiv.innerHTML = `          <button class="pagination__buttons-prev">Prev</button>
<button class="pagination__buttons-next">Next</button>`;

  const pageNumberDiv = document.querySelector(".pageNumber");

  pageNumberDiv.innerHTML = `<p>Page ${global.exchanges.page} of ${global.exchanges.totalPages}</p>`;

  // Disable prev button if on first page
  if (global.exchanges.page === 1) {
    document.querySelector(".pagination__buttons-prev").disabled = true;
  }
  if (global.exchanges.page === global.exchanges.totalPages) {
    document.querySelector(".pagination__buttons-next").disabled = true;
  }
  //next page
  document
    .querySelector(".pagination__buttons-next")
    .addEventListener("click", async () => {
      global.exchanges.page++;
      global.exchanges.dataOutputted += 25;
      global.exchanges.amountToOutput += 25;
      const pageData = await getCategoriesData();
      displayCategoriesData(pageData);
    });
  // Prev page
  document
    .querySelector(".pagination__buttons-prev")
    .addEventListener("click", async () => {
      global.exchanges.page--;
      global.exchanges.dataOutputted -= 25;
      global.exchanges.amountToOutput -= 25;
      const pageData = await getCategoriesData();
      displayCategoriesData(pageData);
    });
}

async function getCategoriesData() {
  const apiUrlSearch = `https://api.coingecko.com/api/v3/coins/categories?order=market_cap_desc`;
  const response = await fetch(apiUrlSearch, options);
  if (!response.ok) {
    throw new Error("Error on response");
  }
  return await response.json();
}

function trustColorChange(elementToChange, trustScore) {
  if (trustScore >= 8) {
    elementToChange.classList.add("green");
  } else if (trustScore >= 6) {
    elementToChange.classList.add("yellow");
  } else {
    elementToChange.classList.add("red");
  }
}

async function onExchangeDetailsPage() {
  const exchangeToDisplay = window.location.search.split("=")[1];

  if (exchangeToDisplay !== "") {
    try {
      const exchangeData = await getExchangeData(exchangeToDisplay);
      console.log(exchangeData);
      displayExchangeDetails(exchangeData);
    } catch (error) {
      console.log(error);
      return;
    }
  } else {
    alert("No Exchange to Display");
  }
}
function displayExchangeDetails(exchangeData) {
  console.log(exchangeData);
  const exchangeContainer = document.querySelector(
    ".exchange-details__container"
  );

  exchangeContainer.innerHTML = `<div class="exchange-card">
  <div class="exchange-card-title">
    <img
      src="${exchangeData.image}"
      alt=""
    />
    <div class="exchange-card-title-section">
      <h2>${exchangeData.name}</h2>
      <p>#${exchangeData.trust_score_rank}</p>
    </div>
  </div>
  <div class="exchange-card-section-top">
    <div class="exchange-card-trust">
      <p>Trust Score</p>
      <p>${exchangeData.trust_score}/10</p>
    </div>
    <div class="exchange-card-tradeVol">
      <p>Trade Volume 24hs (BTC)</p>
      <p>${exchangeData.trade_volume_24h_btc}</p>
    </div>
    <div class="exchange-card-tradeVol">
      <p>Trade Volume 24hs Normalized (BTC)</p>
      <p>${exchangeData.trade_volume_24h_btc_normalized}</p>
    </div>
  </div>
  <div class="exchange-card-description">
    <p>Description</p>
    <p class="exchange-card-description-p">
   ${exchangeData.description === "" ? "N/A" : exchangeData.description}
    </p>
  </div>
  <div class="websitesAndCommunities">
    <div class="websiteHeaders">
      <h2>Websites & Communities</h2>
    </div>
    <div class="websiteButtons">
    </div>
  </div>
</div>`;

  const websiteButtons = document.querySelector(".websiteButtons");
  //if facebook url exists, add to dom
  if (exchangeData.facebook_url !== "") {
    const a = document.createElement("a");
    a.setAttribute("href", exchangeData.facebook_url);
    a.innerHTML = `<button class="website">Facebook</button>`;
    websiteButtons.appendChild(a);
  }
  //if reddit url exists, add to dom
  if (exchangeData.reddit_url !== "") {
    const a = document.createElement("a");
    a.setAttribute("href", exchangeData.reddit_url);
    a.innerHTML = `<button class="website">Reddit</button>`;
    websiteButtons.appendChild(a);
  }
  // if telelgram exists, add to dom
  if (exchangeData.telegram_url !== "") {
    const a = document.createElement("a");
    a.setAttribute("href", exchangeData.telegram_url);
    a.innerHTML = `<button class="website">Telegram</button>`;
    websiteButtons.appendChild(a);
  }
  // if website exists, add to dom
  if (exchangeData.url !== "") {
    const a = document.createElement("a");
    a.setAttribute("href", exchangeData.url);
    a.innerHTML = `<button class="website">Exchange</button>`;
    websiteButtons.appendChild(a);
  }
  // if URL 1 exists, add to dom
  if (exchangeData.other_url_1 !== "") {
    const a = document.createElement("a");
    a.setAttribute("href", exchangeData.other_url_1);
    a.innerHTML = `<button class="website">Other</button>`;
    websiteButtons.appendChild(a);
  }
  // if URL 2 exists, add to dom
  if (exchangeData.other_url_2 !== "") {
    const a = document.createElement("a");
    a.setAttribute("href", exchangeData.other_url_2);
    a.innerHTML = `<button class="website">Other</button>`;
    websiteButtons.appendChild(a);
  }
}
async function getExchangeData(exchangeToDisplay) {
  const apiURL = `https://api.coingecko.com/api/v3/exchanges/${exchangeToDisplay}`;
  const response = await fetch(apiURL, options);
  if (!response.ok) {
    throw new Error("Error on response");
  }
  return await response.json();
}
async function onCategoriesDetailsPage() {
  const categoryToDisplay = window.location.search.split("=")[1];
  console.log(categoryToDisplay);
  if (categoryToDisplay !== "") {
    try {
      const categoriesData = await getCategoriesData();
      const arrayNum = checkCorrectID(categoriesData, categoryToDisplay);
      displayCategoryDetails(categoriesData, arrayNum);
    } catch (error) {
      console.log(error);
      return;
    }
  } else {
    alert("No Exchange to Display");
  }
}
function displayCategoryDetails(categoriesData, arrayNum) {
  console.log(categoriesData[arrayNum]);
  const categoryDetailsContainer = document.querySelector(
    ".categories-coin-details__container"
  );
  const div = document.createElement("div");
  div.classList.add("categories-coin-details");
  div.innerHTML = ` <div class="categories-coin-title">
  <h2>${categoriesData[arrayNum].name}</h2>
  <p class="categories-coin-title-percent">${categoriesData[
    arrayNum
  ].market_cap_change_24h.toFixed(2)}%</p>
</div>

<div class="categories-coin-section one">
  <p>Market Cap</p>
  <p>$${Math.round(categoriesData[arrayNum].market_cap).toLocaleString()}</p>
</div>
<div class="categories-coin-section">
  <p>24h Volume</p>
  <p>$${Math.round(categoriesData[arrayNum].volume_24h).toLocaleString()}</p>
</div>
<div class="categories-coin-coins">
  <div class="categories-coins-header">
    <p>Top 3 Coins</p>
  </div>
  <div class="categories-coins-img">
    <img
      src="${categoriesData[arrayNum].top_3_coins[0]}"
      alt=""
    />
    <img
      src="${categoriesData[arrayNum].top_3_coins[1]}"
      alt=""
    />
    <img
      src="${categoriesData[arrayNum].top_3_coins[2]}"
      alt=""
    />
  </div>
</div>

<div class="categories-coin-content">
  <p>Description</p>
  <p>
    ${categoriesData[arrayNum].content}
  </p>
</div>`;
  const percentElement = div.querySelector(".categories-coin-title-percent");
  colorChange(percentElement, categoriesData[arrayNum].market_cap_change_24h);
  categoryDetailsContainer.appendChild(div);
}

function checkCorrectID(categoriesData, categoryToDisplay) {
  for (let i = 0; i < 200; i++) {
    if (categoriesData[i].id === categoryToDisplay) {
      return i;
    }
  }
  throw new Error("couldnt find the id!");
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

      break;
    case "/coin-details.html":
      indexEventListeners();
      onCoinDetailsPage();
      break;
    case "/exchanges.html":
      indexEventListeners();
      onExchangesPage();
      break;
    case "/categories.html":
      indexEventListeners();
      onCategoriesPage();

    case "/exchange-details.html":
      indexEventListeners();
      onExchangeDetailsPage();
      break;
    case "/categories-details.html":
      indexEventListeners();
      onCategoriesDetailsPage();
      break;
  }
}

document.addEventListener("DOMContentLoaded", init);
