async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let tab = await chrome.tabs.query(queryOptions);
  return tab[0];
}

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

document.addEventListener("DOMContentLoaded", async function () {
  document
    .getElementById("ytCheckbox")
    .addEventListener("change", async function () {
      var checkboxState = this.checked;
      await LS.setItem(
        "yt_getoutad",
        JSON.stringify({ injectScript: checkboxState })
      );

      const tab = await getCurrentTab();
      const tabId = tab?.id;

      if (!tabId) return;

      chrome.tabs.reload(tabId);
    });

  if (await SS.getItem("adsSkipped")) {
    let skippedAds = await SS.getItem("adsSkipped");
    document.querySelector("#yvTotalSkippedAds").innerHTML = skippedAds;
  }

  if (!(await LS.getItem("yt_getoutad"))) return;
  const yvGetOutAd = JSON.parse(await LS.getItem("yt_getoutad"));

  document.getElementById("ytCheckbox").checked =
    yvGetOutAd?.injectScript || false;
});
