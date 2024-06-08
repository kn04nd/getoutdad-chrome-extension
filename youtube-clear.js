const LS = {
  getAllItems: () => chrome.storage.local.get(),
  getItem: async (key) => (await chrome.storage.local.get(key))[key],
  setItem: (key, val) => chrome.storage.local.set({ [key]: val }),
  removeItems: (keys) => chrome.storage.local.remove(keys),
};

const SS = {
  getAllItems: () => chrome.storage.session.get(),
  getItem: async (key) => (await chrome.storage.session.get(key))[key],
  setItem: (key, val) => chrome.storage.session.set({ [key]: val }),
  removeItems: (keys) => chrome.storage.session.remove(keys),
};

const clearYoutube = () => {
  console.log("[GetOutAd] - Youtube Clearing...");
  const defined = (v) => v !== null && v !== undefined;
  const timeout = setInterval(() => {
    const ad = [...document.querySelectorAll(".ad-showing")][0];
    if (defined(ad)) {
      const video = document.querySelector("video");
      if (defined(video)) {
        if (!isNaN(video.duration)) {
          video.currentTime = video.duration;
        }

        let adSkipButton = document.querySelector(
          "button[class*=ytp-ad-skip-button]"
        );
        if (adSkipButton) {
          adSkipButton.click();
          saveSessionSkip();
        }
      }
    }
  }, 500);
  return function () {
    clearTimeout(timeout);
  };
};

const saveSessionSkip = async () => {
  let newAdsSkipped = await SS.getItem("adsSkipped");
  if (newAdsSkipped) {
    newAdsSkipped = newAdsSkipped + 1;
  } else {
    newAdsSkipped = 1;
  }
  SS.setItem("adsSkipped", newAdsSkipped);
};

const start = async () => {
  if (!(await LS.getItem("yt_getoutad"))) return;
  const yvGetOutAd = JSON.parse(await LS.getItem("yt_getoutad"));
  if (yvGetOutAd?.injectScript) clearYoutube();
};

start();
