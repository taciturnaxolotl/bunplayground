// ==UserScript==
// @name         Amazon URL Cleaner
// @namespace    https://tangled.sh/@dunkirk.sh/bunplayground/amazon-shortener
// @version      0.1
// @description  Removes fluff from Amazon URLs to get clean product links
// @author       You
// @match        https://www.amazon.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
  function cleanURL() {
    const url = window.location.href;
    const match = url.match(/amazon\.com.*?\/([A-Z0-9]{10})/);
    if (match) {
      const asin = match[1];
      const clean = `https://www.amazon.com/dp/${asin}`;
      if (url !== clean) {
        window.history.replaceState(null, "", clean);
      }
    }
  }

  cleanURL();

  window.addEventListener("locationchange", cleanURL);
  window.addEventListener("popstate", cleanURL);
})();
