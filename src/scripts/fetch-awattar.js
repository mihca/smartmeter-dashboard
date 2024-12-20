export async function fetchMarketDataRecord (mdr, start, end) {

  /*
  if (mdr.utcHourFrom && mdr.utcHourTo && start >= mdr.utcHourFrom && end <= mdr.utcHourTo)
    // Nothing to do, data is already loaded
    return mdr;

  if (mdr.utcHourFrom && mdr.utcHourTo) {
    // extend the range to load
    if (start < mdr.utcHourTo)
      start = mdr.utcHourTo + 3600000;
  }
    */

  const marketHourData = await loadMarketHourData(start, end);

  /*
  marketHourData.forEach((value, key) => {
    mdr.hourMap.set(key, value);
  });
  */

  return {
    country: "at",
    utcHourFrom: start,
    utcHourTo: end,
    hourMap: marketHourData
  }
}

export async function loadMarketHourData (start, end) {

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
