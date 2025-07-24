// ==UserScript==
// @name         Hack Club Summer Votes Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enhance the voting experience on Hack Club Summer votes page
// @author       You
// @match        https://summer.hackclub.com/votes/new
// @match        https://summer.hackclub.com/votes/*
// @grant        none
// ==/UserScript==

(() => {
  console.log("Hack Club Summer Votes Helper loaded");

  function addHackClubSummerVotesHelperButton() {
    // Prevent adding multiple buttons
    if (document.getElementById("hackclub-summer-votes-helper-btn")) {
      console.log("Button already exists, skipping");
      return;
    }

    // Find the <p class="text-center"> element
    const p = document.querySelector("p.text-center");
    if (!p) {
      console.log("Target element not found yet");
      return;
    }

    console.log("Adding helper button");

    // Create a new button
    const openButton = document.createElement("button");
    openButton.textContent = "Open Project Links";
    openButton.style.margin = "10px";
    openButton.style.display = "block";
    openButton.style.marginLeft = "auto";
    openButton.style.marginRight = "auto";
    openButton.className = "som-button-primary";
    openButton.id = "hackclub-summer-votes-helper-btn";

    // Add click event to open the URLs
    function openProjectLinks() {
      console.log("Helper button clicked");

      // Find all buttons with a div > span whose text is "Demo" or "Repository"
      const allButtons = Array.from(
        document.getElementsByClassName("som-button-primary"),
      );
      const filteredButtons = allButtons.filter((btn) => {
        const spans = btn.querySelectorAll("div > span");
        return Array.from(spans).some((span) => {
          const text = span.textContent.trim();
          return text === "Demo" || text === "Repository";
        });
      });

      console.log(`Found ${filteredButtons.length} project buttons`);

      filteredButtons.forEach((btn) => {
        const url = btn.href || btn.getAttribute("data-href");
        if (url) {
          console.log(`Opening: ${url}`);
          window.open(url, "_blank");
        }
      });

      // Set the hidden inputs to true
      const inputIds = [
        "vote_project_1_demo_opened",
        "vote_project_1_repo_opened",
        "vote_project_2_demo_opened",
        "vote_project_2_repo_opened",
      ];

      inputIds.forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
          input.value = "true";
          console.log(`Set ${id} to true`);
        }
      });
    }

    openButton.addEventListener("click", openProjectLinks);

    p.appendChild(openButton);
    console.log("Button added successfully");
  }

  function runHelperOnPageLoad() {
    // Only run on the correct page
    if (
      window.location.pathname === "/votes/new" ||
      window.location.pathname.startsWith("/votes/")
    ) {
      console.log("Running helper on correct page");
      addHackClubSummerVotesHelperButton();
    }
  }

  // Initial run
  runHelperOnPageLoad();

  // Method 1: Intercept fetch/XMLHttpRequest to detect page changes
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    return originalFetch.apply(this, args).then((response) => {
      if (response.url.includes("/votes/new")) {
        console.log("Detected fetch to votes page");
        setTimeout(runHelperOnPageLoad, 100);
      }
      return response;
    });
  };

  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.addEventListener("load", () => {
      if (url.includes("/votes/new")) {
        console.log("Detected XHR to votes page");
        setTimeout(runHelperOnPageLoad, 100);
      }
    });
    return originalXHROpen.call(this, method, url, ...rest);
  };

  // Method 2: Enhanced MutationObserver
  let observerTimeout;
  const observer = new MutationObserver((_mutations) => {
    // Debounce to avoid excessive calls
    clearTimeout(observerTimeout);
    observerTimeout = setTimeout(() => {
      console.log("DOM mutation detected");
      runHelperOnPageLoad();
    }, 50);
  });

  // Observe the entire document for changes
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: false,
  });

  // Method 3: Polling fallback (less elegant but very reliable)
  setInterval(() => {
    if (
      window.location.pathname === "/votes/new" ||
      window.location.pathname.startsWith("/votes/")
    ) {
      if (!document.getElementById("hackclub-summer-votes-helper-btn")) {
        console.log("Button missing, re-adding via polling");
        addHackClubSummerVotesHelperButton();
      }
    }
  }, 2000);

  // Method 4: Listen for history changes
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    setTimeout(runHelperOnPageLoad, 100);
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    setTimeout(runHelperOnPageLoad, 100);
  };

  window.addEventListener("popstate", () => {
    setTimeout(runHelperOnPageLoad, 100);
  });

  // Method 5: Listen for focus events (when user returns to tab)
  window.addEventListener("focus", () => {
    setTimeout(runHelperOnPageLoad, 100);
  });

  // Add listener for Shift + S shortcut
  window.addEventListener("keydown", (e) => {
    // Ignore if input/textarea/select is focused
    const tag = document.activeElement.tagName;
    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      document.activeElement.isContentEditable
    ) {
      return;
    }
    if (e.shiftKey && (e.key === "s" || e.key === "S")) {
      // Only run on the correct page
      if (
        window.location.pathname === "/votes/new" ||
        window.location.pathname.startsWith("/votes/")
      ) {
        const btn = document.getElementById("hackclub-summer-votes-helper-btn");
        if (btn) {
          btn.click();
        } else {
          // If button not present, run the logic directly
          // (duplicate logic from openButton click)
          // Find all buttons with a div > span whose text is "Demo" or "Repository"
          const allButtons = Array.from(
            document.getElementsByClassName("som-button-primary"),
          );
          const filteredButtons = allButtons.filter((btn) => {
            const spans = btn.querySelectorAll("div > span");
            return Array.from(spans).some((span) => {
              const text = span.textContent.trim();
              return text === "Demo" || text === "Repository";
            });
          });

          filteredButtons.forEach((btn) => {
            const url = btn.href || btn.getAttribute("data-href");
            if (url) {
              window.open(url, "_blank");
            }
          });

          // Set the hidden inputs to true
          const inputIds = [
            "vote_project_1_demo_opened",
            "vote_project_1_repo_opened",
            "vote_project_2_demo_opened",
            "vote_project_2_repo_opened",
          ];

          inputIds.forEach((id) => {
            const input = document.getElementById(id);
            if (input) {
              input.value = "true";
            }
          });
        }
        // Prevent default browser behavior
        e.preventDefault();
      }
    }
  });

  // Add listener for Ctrl+Enter to submit vote, even in a textbox
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && (e.key === "Enter" || e.keyCode === 13)) {
      // Only run on the correct page
      if (
        window.location.pathname === "/votes/new" ||
        window.location.pathname.startsWith("/votes/")
      ) {
        // Find the submit vote button
        // <button name="button" type="submit" class="som-button-primary  " data-form-target="submitButton">
        //     <div class="flex items-center justify-center gap-2">
        //         <span class="flex items-center gap-1">Submit Vote</span>
        //     </div>
        // </button>
        const submitButtons = Array.from(
          document.querySelectorAll(
            'button.som-button-primary[data-form-target="submitButton"]',
          ),
        );
        let found = false;
        for (const btn of submitButtons) {
          // Check if the button contains a span with text "Submit Vote"
          const span = btn.querySelector("span");
          if (span && span.textContent.trim() === "Submit Vote") {
            btn.click();
            found = true;
            break;
          }
        }
        if (found) {
          e.preventDefault();
        }
      }
    }
  });

  console.log("All event listeners and observers set up");
})();
