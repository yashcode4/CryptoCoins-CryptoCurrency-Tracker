// HeadBar
const globalData = fetch('https://api.coingecko.com/api/v3/global')
  .then(response => response.json())
  .then(response => {

    activecoins.innerHTML = response.data.active_cryptocurrencies
    markets.innerHTML = response.data.markets
    totalMarketCap.innerHTML = "$ " + (response.data.total_market_cap.usd).toFixed(2)
    totalMarketCap2.innerHTML = "$ " + (response.data.total_market_cap.usd / 1.0e+12).toFixed(2)
    totalVolume.innerHTML = "$ " + (response.data.total_volume.usd).toFixed(2)
    totalMarketCapPer.innerHTML = Number((response.data.market_cap_change_percentage_24h_usd).toFixed(2)) + " %"
    totalMarketCapPer2.innerHTML = Number((response.data.market_cap_change_percentage_24h_usd).toFixed(2)) + " %"
    bitDom.innerHTML = (response.data.market_cap_percentage.btc).toFixed(2) + " %"

  });


// Trending News
fetch('https://api.coinstats.app/public/v1/news/latest?skip=0&limit=20')
  .then(response => response.json())
  .then(data => trendingList(data));

function trendingList(data) {
  const listDiv = document.querySelector("#newsBox");
  let list = data.news.map(
    (news, index) => `
          <div id="${index}">
          
          <div class="itemBox">

          <div class="img"> 
          <img src="${news.imgURL}" onerror="this.src='https://www.kaspersky.com/content/en-global/images/repository/isc/2021/cryptocurrency_image1_1130490519_670x377px_300dpi.jpg';" style="height: 80px; width: 130px;">
          </div>
          
          <div class="infoBox">
          <div class="title"> 
          <span style="font-size: 15px;" >${news.title}</span>
          </div>

          <div class="source">
          <div class="source-name"><span style="font-size: 14px;">🌐 ${news.source}</span></div>
          <div class="source-link"><a href="${news.link}" style="font-size: 14px; text-decoration: none">more</a></div>    
          </div>
          </div>

          </div> 

          </div> 
        `
  )
    .join("");
  listDiv.innerHTML = list;

}

// ChartMapList
let chart = null;
fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d&locale=en')
  .then(response => response.json())
  .then(data => {
    // List
    const listDiv = document.querySelector("#chartList");
    // console.log(data[0])
    let list = data.map(
      (data, index) => `
          <div id="${index}">
          <!-- itemBoxChart with type submit click -->
          <div class="itemBoxChart" id="itemBoxChart" onclick="updateChart('${data.id}', '${data.symbol}')">

          <img src="${data.image}" alt="Image" style="height: 20px; width: 20px; margin-left: 5px;">
          <span style="margin-left: 5px;">${data.name}</span>
          <span style="float: right;" class="${(data.price_change_percentage_7d_in_currency).toFixed(2) < 0.0 ? "bearish" : "bullish"}">${(data.price_change_percentage_7d_in_currency).toFixed(2)}%</span>

          </div> 

          </div> 
        `
    )
      .join("");
    listDiv.innerHTML = list;

    // Call updateChart with Bitcoin as the default
    const bitcoin = data.find(data => data.id === "bitcoin");
    updateChart(bitcoin.id, bitcoin.symbol);
  });
// Update chart with data for selected cryptocurrency
function updateChart(cryptoId, cryptoSymbol) {
  // console.log(cryptoId, cryptoSymbol)
  fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7`)
    .then(response => response.json())
    .then(response => {
      // console.log(response)
      const prices = response.prices;
      const firstPrice = prices[0][1];
      const lastPrice = prices[prices.length - 1][1];
      const trend = lastPrice > firstPrice ? 'bullish' : 'bearish';
      const color = trend === 'bullish' ? '#34c759' : '#ff3b30';
      const chartData = {
        series: [{
          name: "coin price",
          data: prices
        }],
        chart: {
          type: 'area',
          width: '98%',
          height: '98%'
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: "datetime",
          min: new Date().getTime() - (7 * 24 * 60 * 60 * 1000),
          max: new Date().getTime(),
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return "$" + val.toFixed(2)
            }
          }
        },
        fill: {
          colors: [color]
        },
        stroke: {
          curve: 'straight',
          colors: [color]
        },
        tooltip: {
          enabled: true,
          // fillSeriesColor: true,
          theme: "dark", 
        }
      };
      const chartOptions = {
        title: {
          text: `${cryptoSymbol} Price Chart (${trend})`
        },
        xaxis: {
          title: {
            text: 'Days'
          }
        },
        yaxis: {
          title: {
            text: 'Price (USD)'
          }
        }
      };
      if (chart) {
        chart.destroy();
      }
      chart = new ApexCharts(document.querySelector("#chartMap"), chartData, chartOptions);
      chart.render();
    })
    .catch(error => {
      console.error(error);
    });
}


// Section 2 
fetch('https://api.coinstats.app/public/v1/coins')
  .then(response => response.json())
  .then(data => coinsList(data));

function coinsList(data) {

  // Applied HTML 
  // To select the main element to put all these values.
  const listDiv = document.querySelector("#tbody");
  let list = data.coins.map(
    (coin, index) => `
          <div id="${index}">
          <div class="list-items">
          
          <tbody>
          <tr class="list-items2">
          <td class="hashBox">
          <p>${coin.rank}<p>
          </td>

          <td class="coinBox">
          <img src="${coin.icon}" alt="${coin.name}">
          <p>${coin.name}  <sup style="color:#00fffb;">${coin.symbol}</sup><p>
          </td>
 
          <td class="priceBox">
          <p class="price">${formatCurrency(parseFloat(coin.price).toFixed(2))}</p>
          </td>

          <td class="marketCapBox">
          <p>$ ${(coin.marketCap / Math.pow(10, 9)).toFixed(2)} ${coin.marketCap >= Math.pow(10, 9) ? "B" : "M"}</p>
         </td>

          <td class="volume24hBox">
          <p>$ ${(coin.volume / Math.pow(10, 9)).toFixed(2)} ${coin.volume >= Math.pow(10, 9) ? "B" : "M"}</p>
         </td>

         <td class="circulatingBox">
         <p>${formatNumber(parseInt(coin.availableSupply))} ${coin.symbol}</p>
         </td>

         <td class="oneHBox">
          <p class="${coin.priceChange1h < 0.0 ? "bearish" : "bullish"}">${coin.priceChange1h}%</p>
         </td>

         <td class="oneDBox">
         <p class="${coin.priceChange1d < 0.0 ? "bearish" : "bullish"}">${coin.priceChange1d}%</p>
         </td>

         <td class="oneWBox">
         <p class="${coin.priceChange1w < 0.0 ? "bearish" : "bullish"}">${coin.priceChange1w}%</p>
         </td>

         <td class="sevenDChart">
         <img src="https://static.coinstats.app/sparks/${coin.id}_1w.png" alt="${coin.name}">
         </td>

          </tr>
          </tbody>
            
          </div>
          
          </div>

          </div> 
        `
  )
    .join("");
  listDiv.innerHTML = list;

}

// FORMAT CURRENCY
// For Price
function formatCurrency(number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
  return formatter;
}
// For Number
function formatNumber(number) {
  const formatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
  }).format(number);
  return formatter;
}