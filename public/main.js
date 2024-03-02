const listUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d&locale=en";

// HEADING
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


// TRENDING NEWS
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'X-API-KEY': 'k5Xkx/hvFn/Wz4zWeGdc2mtz3XYj/nMUlwqW8mnMM1w='
  }
};
fetch('https://openapiv1.coinstats.app/news', options)
  .then(response => response.json())
  .then(response2 => {
    let data = response2.result;
    const listDiv = document.querySelector("#newsBox");
    let list = data.map(
      (data, index) => `
      <div id="${index}">
        <div class="itemBox">
          <div class="img">
            <img src="${data.imgURL}"
            onerror="this.src='https://www.kaspersky.com/content/en-global/images/repository/isc/2021/cryptocurrency_image1_1130490519_670x377px_300dpi.jpg';"
            style="height: 80px; width: 130px;">
          </div>
          <div class="infoBox">
            <div class="title">
              <span style="font-size: 15px;">${data.title}</span>
            </div>
            <div class="source">
              <div class="source-name"><span style="font-size: 14px;">🌐 ${data.source}</span></div>
              <div class="source-link"><a href="${data.link}" style="font-size: 14px; text-decoration: none">more</a></div>
            </div>
          </div>
        </div>
      </div>
          `
    )
      .join("");
    listDiv.innerHTML = list;
  });


// CHARTMAPLIST
let chart = null;
fetch(listUrl)
  .then(response => response.json())
  .then(data => {
    // List
    const listDiv = document.querySelector("#chartList");
    let list = data.map(
      (data, index) => `
      <div id="${index}">
        <!-- itemBoxChart with type submit click -->
        <div class="itemBoxChart" id="itemBoxChart" onclick="updateChart('${data.id}', '${data.symbol}')">
    
          <img src="${data.image}" alt="Image" style="height: 20px; width: 20px; margin-left: 5px;">
          <span style="margin-left: 5px;">${data.name}</span>
          <span style="float: right;" class="${(data.price_change_percentage_7d_in_currency).toFixed(2) < 0.0 ? "bearish"
          : "bullish" }">${(data.price_change_percentage_7d_in_currency).toFixed(2)}%</span>
        </div>
      </div>
        `
    ).join("");
    listDiv.innerHTML = list;

    // Call updateChart with Bitcoin as the default
    const bitcoin = data.find(data => data.id === "bitcoin");
    updateChart(bitcoin.id, bitcoin.symbol);

    // Give data argument to the chartData function.
    chartData(data);
  });

// CHARTMAP
// Update chart with data for selected cryptocurrency
function updateChart(cryptoId, cryptoSymbol) {
  // console.log(cryptoId, cryptoSymbol)
  fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7`)
    .then(response => response.json())
    .then(response => {
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

// Section 2 -> CRYPTO DATA
// chartData takes "data" from the above fetch function.
function chartData(data){
  // Applied HTML 
    // To select the main element to put all these values.
    const listDiv = document.querySelector("#tbody");
    let list = data.map(
      (data, index) => `
      <div id="${index}">
        <div class="list-items">
      
          <tbody>
            <tr class="list-items2">
              <td class="hashBox">
                <p>${data.market_cap_rank}
                <p>
              </td>
      
              <td class="coinBox">
                <img src="${data.image}" alt="${data.name}">
                <p>${data.name} <sup style="color:#00fffb;">${data.symbol}</sup>
                <p>
              </td>
      
              <td class="priceBox">
                <p class="price">${formatCurrency(parseFloat(data.current_price).toFixed(2))}</p>
              </td>
      
              <td class="marketCapBox">
                <p>$ ${(data.market_cap / Math.pow(10, 9)).toFixed(2)} ${data.market_cap >= Math.pow(10, 9) ? "B" : "M"}</p>
              </td>
      
              <td class="volume24hBox">
                <p>$ ${(data.total_volume / Math.pow(10, 9)).toFixed(2)} ${data.total_volume >= Math.pow(10, 9) ? "B" : "M"}
                </p>
              </td>
      
              <td class="circulatingBox">
                <p>${formatNumber(parseInt(data.total_supply))} ${data.symbol}</p>
              </td>
      
              <!-- <td class="oneHBox">
        <p class="${data.priceChange1h < 0.0 ? "bearish" : "bullish"}">${data.priceChange1h}%</p>
       </td> -->
      
              <td class="oneDBox">
                <p class="${data.price_change_percentage_24h < 0.0 ? " bearish" : "bullish" }">
                  ${(data.price_change_percentage_24h).toFixed(2)}%</p>
              </td>
      
              <td class="oneWBox">
                <p class="${data.price_change_percentage_7d_in_currency < 0.0 ? " bearish" : "bullish" }">
                  ${(data.price_change_percentage_7d_in_currency).toFixed(2)}%</p>
              </td>
      
              <td class="sevenDChart">
                <img src="https://static.coinstats.app/sparks/${data.id}_1w.png" alt="${data.name}">
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

