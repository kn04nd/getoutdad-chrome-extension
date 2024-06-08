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

chrome.webNavigation.onDOMContentLoaded.addListener(async (details) => {
  chrome.storage.session.setAccessLevel({
    accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
  });

  const tab = await getCurrentTab();
  if (details.tabId !== tab?.id) return;

  if (!(await LS.getItem("yt_getoutad"))) return;
  const yvGetOutAd = JSON.parse(await LS.getItem("yt_getoutad"));

  if (yvGetOutAd?.injectScript) {
    chrome.scripting
      .registerContentScripts([
        {
          id: "youtube-clear-script",
          js: ["youtube-clear.js"],
          persistAcrossSessions: true,
          matches: ["https://*/*", "http://*/*"],
          runAt: "document_end",
        },
      ])
      .then(() => console.log("registration complete"))
      .catch((err) => console.warn("unexpected error", err));
  } else {
    chrome.scripting
      .unregisterContentScripts({ ids: ["youtube-clear-script"] })
      .then(() => console.log("un-registration complete"))
      .catch((err) => console.warn("unexpected error", err));
  }
});
