export async function fetchMarketData (start, end) {

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
        // Save price at the end of each hour to be conform to usage and feedin data.
        // So for calculation we can just take the usage timestamp and look with same timestamp in market data.
        marketData.set (element.end_timestamp, element.marketprice / 10.0);
    });

    console.log(marketData);

    return marketData;
  }