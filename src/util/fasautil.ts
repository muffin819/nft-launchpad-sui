export const calculateSum = (obj: any, field: any) => obj
  .map((items: any) => items.attributes[field])
  .reduce((prev: any, curr: any) => prev + curr, 0);

export const generateRandomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const truncateText = (string: string | undefined, length: number) => {
  if (string) {
    // First 5 characters
    let firstFive = string.substring(0, 5);
    // Last 6 characters
    let lastSix = string.slice(-6);
    return `${firstFive}...${lastSix}`
  }
  return false
}

export const disconnectWallet = () => {
  // localStorage.clear()
  localStorage.removeItem("jwt")
  localStorage.removeItem("user-data")
  localStorage.removeItem("wallet-session")
}

export const msToTime = (duration: number) => {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const newhours = (hours < 10) ? "0" + hours : hours;
  const newminutes = (minutes < 10) ? "0" + minutes : minutes;
  const newseconds = (seconds < 10) ? "0" + seconds : seconds;

  return newhours + ":" + newminutes + ":" + newseconds;
}

export const currentTime = () => {
  let date = new Date();
  let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
    date.getUTCDate(), date.getUTCHours(),
    date.getUTCMinutes(), date.getUTCSeconds());
  return now_utc
}

export const numberWithCommas = (x: number | undefined) => {
  if (x) {
    return x.toString().replace(/\B(?=(\df{3})+(?!\d))/g, ",");
  } else return 0;
}

export const toDateString = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
  return formattedDate
}

export const getNextPoint = (level: number) => {
  const q = 1.1;
  const factor = 100 / (q - 1);
  const levelPoint = Math.round((Math.pow(q, level) - 1) * factor);
  return levelPoint; // In case the point exceeds the calculated levelPoint for i < 200
};

export const filterAndCountItems = (arr: any, minimize: boolean): any => {
  const counts: { [key: string]: number } = {};
  const rowIds: { [key: string]: Array<string> } = {};
  // Count occurrences of each _id
  arr.forEach((item: any, idx: number) => {
    if (counts[item.itemID._id]) {
      counts[item.itemID._id]++;
      if (rowIds[item.itemID._id]) {
        rowIds[item.itemID._id].push(item._id)
      }
      else {
        rowIds[item.itemID._id] = [item._id]
      }
    } else {
      counts[item.itemID._id] = 1;
      rowIds[item.itemID._id] = [item._id]
    }
  });
  // Create the filtered array with counts
  let filtered;
  if (minimize) {
    filtered = Object.keys(counts).map(_id => ({
      _id,
      userAddress: arr.find((item: any) => item.itemID._id === _id)?.userAddress || '',
      itemName: arr.find((item: any) => item.itemID._id === _id)?.itemID.itemName || '',
      itemURL: arr.find((item: any) => item.itemID._id === _id)?.itemID.itemURL || '',
      itemTRGPrice: arr.find((item: any) => item.itemID._id === _id)?.itemID.itemTRGPrice || '',
      itemType: arr.find((item: any) => item.itemID._id === _id)?.itemID.itemType,
      itemTRGMPrice: arr.find((item: any) => item.itemID._id === _id)?.itemID.itemTRGMPrice || '',
      itemBoostTime: arr.find((item: any) => item.itemID._id === _id)?.itemID.itemBoostTime || '',
      itemBoostPoint: arr.find((item: any) => item.itemID._id === _id)?.itemID.itemBoostPoint || 0,
      listTRGPrice: arr.find((item: any) => item.itemID._id === _id)?.listTRGPrice || 0,
      listflag: arr.find((item: any) => item.itemID._id === _id)?.listflag || 0,
      count: counts[_id],
      rowIds: rowIds[_id]
    }));
  }
  else {
    filtered = arr.map((item: any) => ({
      _id: item._id,
      userAddress: item.userAddress,
      itemName: item.itemID.itemName || '',
      itemURL: item.itemID.itemURL || '',
      itemTRGPrice: item.itemID.itemTRGPrice || '',
      itemType: item.itemID.itemType,
      itemTRGMPrice: item.itemID.itemTRGMPrice || '',
      itemBoostTime: item.itemID.itemBoostTime || '',
      itemBoostPoint: item.itemID.itemBoostPoint || 0,
      listTRGPrice: item.listTRGPrice || 0,
      listflag: item.listflag || 0,
      count: 1,
      rowIds: [item._id]
    }));
  }


  return filtered;
}

export const updateGuideStatus = (status: any) => {
  localStorage.setItem("guide", JSON.stringify(status))
}

export const getGuideStatus = () => {
  const status = localStorage.getItem("guide")
  if (!status) {
    const defaultStatus = {
      isNew: true,
      status: [
        {
          page: "heartland",
          step: 0,
          completed: false
        },
        {
          page: "marketplace",
          step: 1,
          completed: false
        },
        {
          page: "profile",
          step: 1,
          completed: false
        },
        {
          page: "mine",
          step: 0,
          completed: false
        },
        {
          page: "game",
          step: 0,
          completed: false
        },
      ]
    }
    localStorage.setItem('guide', JSON.stringify(defaultStatus))
    return defaultStatus
  }
  else {
    return JSON.parse(status)
  }
}