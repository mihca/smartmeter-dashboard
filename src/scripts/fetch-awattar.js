export async function fetchMarketData (marketData, start, end) {

  const marketDataLoaded = await loadMarketData(start, end);

  return {
    country: "at",
    utcHourFrom: start,
    utcHourTo: end,
    hourMap: marketDataLoaded
  }
}

export async function loadMarketData (start, end) {

  let url = "https://api.awattar.at/v1/marketdata?start=" + start + "&end=" + end;

  console.log("fetchMarketData from ", url);

  const response = await fetch(url);
  const resData = await response.json();

  if (!response.ok) {
    console.log("ERROR fetching awattar: ", response.data);
    throw new Error('Failed to fetch marketdata (' + response.status + ')');          
  }

  console.log("got marketData");
  
  let marketData = new Map();
  resData.data.forEach(element => {
      marketData.set (element.start_timestamp, element.marketprice / 10.0);
  });

  console.log(marketData);

  return marketData;
}
