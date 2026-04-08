(function launcherBoot() {
  var MAIN_BUILDER_URL = "./index.html";
  var WEB_URL = "http://localhost:5173";
  var API_HEALTH_URL = "http://localhost:8787/health";
  var API_MODELS_URL = "http://localhost:8787/api/ai/models";
  var dom = {
    launchContext: document.getElementById("launchContext"),
    overallState: document.getElementById("overallState"),
    webStatusCard: document.getElementById("webStatusCard"),
    apiStatusCard: document.getElementById("apiStatusCard"),
    aiStatusCard: document.getElementById("aiStatusCard"),
    openBuilderLink: document.getElementById("openBuilderLink"),
    refreshStatusBtn: document.getElementById("refreshStatusBtn"),
    redirectNotice: document.getElementById("redirectNotice"),
    redirectMessage: document.getElementById("redirectMessage"),
    cancelRedirectBtn: document.getElementById("cancelRedirectBtn")
  };

  function setContextCopy() {
    if (window.location.protocol === "file:") {
      dom.launchContext.textContent = "You opened the optional launcher directly from disk. The main guided builder is index.html, and AI autofill appears there whenever the local API and Ollama are available.";
      return;
    }
    dom.launchContext.textContent = "This page is only a diagnostics shell. Use it to verify the local API and Ollama, then jump back into the main guided builder.";
  }

  function setActionLabel(label) {
    dom.openBuilderLink.textContent = label;
    dom.openBuilderLink.href = MAIN_BUILDER_URL;
    dom.openBuilderLink.setAttribute("aria-disabled", "false");
    dom.openBuilderLink.classList.remove("is-disabled");
    dom.openBuilderLink.tabIndex = 0;
  }

  function setCardState(card, state, title, detail) {
    card.className = "status-card status-card--" + state;
    card.querySelector("strong").textContent = title;
    card.querySelector("p").textContent = detail;
  }

  function setOverallState(state, title, detail) {
    dom.overallState.className = "overall-state overall-state--" + state;
    dom.overallState.innerHTML = "<strong>" + title + "</strong><p>" + detail + "</p>";
  }

  function showNotice(text) {
    dom.redirectMessage.textContent = text;
    dom.redirectNotice.classList.remove("hidden");
  }

  function hideNotice() {
    dom.redirectNotice.classList.add("hidden");
  }

  function fetchWithTimeout(url, options, timeoutMs) {
    var controller = new AbortController();
    var timeoutId = window.setTimeout(function abortRequest() {
      controller.abort();
    }, timeoutMs);
    var nextOptions = Object.assign({}, options || {}, { signal: controller.signal, cache: "no-store" });
    return fetch(url, nextOptions).finally(function clear() {
      window.clearTimeout(timeoutId);
    });
  }

  function probeWeb() {
    return fetchWithTimeout(WEB_URL + "/?launcher_probe=" + Date.now(), { mode: "no-cors" }, 1800)
      .then(function onSuccess() {
        return { available: true };
      })
      .catch(function onFailure() {
        return {
          available: false,
          reason: "No response from the secondary React dev app on port 5173."
        };
      });
  }

  function probeApi() {
    return fetchWithTimeout(API_HEALTH_URL + "?launcher_probe=" + Date.now(), {}, 1800)
      .then(function onSuccess(response) {
        if (!response.ok) {
          throw new Error("Health endpoint returned " + response.status + ".");
        }
        return response.json();
      })
      .then(function onJson(payload) {
        return {
          available: true,
          payload: payload
        };
      })
      .catch(function onFailure(error) {
        return {
          available: false,
          reason: error && error.message ? error.message : "API health check failed."
        };
      });
  }

  function probeAiCatalog() {
    return fetchWithTimeout(API_MODELS_URL + "?launcher_probe=" + Date.now(), {}, 1800)
      .then(function onSuccess(response) {
        if (!response.ok) {
          throw new Error("Model catalog returned " + response.status + ".");
        }
        return response.json();
      })
      .catch(function onFailure(error) {
        return {
          available: false,
          defaultModel: null,
          reason: error && error.message ? error.message : "AI model catalog is unavailable."
        };
      });
  }

  function renderStatus(result) {
    hideNotice();
    setActionLabel("Open Main Builder");

    setCardState(
      dom.webStatusCard,
      result.web.available ? "ready" : "warning",
      result.web.available ? "React app ready" : "React app offline",
      result.web.available ? "The secondary React dev app responded on port 5173." : result.web.reason
    );

    setCardState(
      dom.apiStatusCard,
      result.api.available ? "ready" : "warning",
      result.api.available ? "API healthy" : "API offline",
      result.api.available ? "Fastify health responded successfully on port 8787." : result.api.reason
    );

    if (result.ai.available) {
      setCardState(
        dom.aiStatusCard,
        "ready",
        "AI ready",
        result.ai.defaultModel ? "Ollama is available. Default model: " + result.ai.defaultModel + "." : "Ollama is available for autofill."
      );
      setOverallState("ready", "Guided builder ready for AI autofill.", "Open index.html to use the main builder with the in-place Ollama assistant.");
      showNotice("The main builder is index.html again. Open it whenever you are ready.");
      return;
    }

    if (result.api.available) {
      setCardState(
        dom.aiStatusCard,
        "warning",
        "AI offline",
        result.ai.reason || "The API is up, but Ollama is not ready or no compatible model is installed."
      );
      setOverallState("warning", "Guided builder ready in guide mode.", "Open index.html to keep building manually. The chat will fall back to deterministic guide replies until Ollama is ready.");
      return;
    }

    setCardState(
      dom.aiStatusCard,
      "warning",
      "Waiting on API",
      "AI availability depends on the local API, so Ollama cannot be confirmed until port 8787 is healthy."
    );
    setOverallState("warning", "The guided builder still opens, but AI autofill is offline.", "Start the local API with START_FORGE_CHARACTER_AI.cmd or npm.cmd run start:ai if you want the chat panel to fill fields automatically.");
  }

  function refreshStatus() {
    hideNotice();
    setActionLabel("Open Main Builder");
    setOverallState("checking", "Checking local stack...", "Probing the local API, Ollama availability, and the optional React dev app.");
    setCardState(dom.webStatusCard, "checking", "Checking", "Looking for http://localhost:5173.");
    setCardState(dom.apiStatusCard, "checking", "Checking", "Looking for /health on port 8787.");
    setCardState(dom.aiStatusCard, "checking", "Checking", "Waiting for API health data.");

    Promise.all([probeWeb(), probeApi()])
      .then(function onBasicStatus(results) {
        var web = results[0];
        var api = results[1];
        if (!api.available) {
          renderStatus({ web: web, api: api, ai: { available: false, defaultModel: null, reason: "API not available yet." } });
          return null;
        }
        return probeAiCatalog().then(function onAi(ai) {
          renderStatus({ web: web, api: api, ai: ai });
          return null;
        });
      })
      .catch(function onUnexpected(error) {
        setActionLabel("Open Main Builder");
        setOverallState("danger", "Launcher check failed.", error && error.message ? error.message : "Unexpected launcher error.");
      });
  }

  dom.refreshStatusBtn.addEventListener("click", refreshStatus);
  dom.cancelRedirectBtn.addEventListener("click", hideNotice);
  setContextCopy();
  refreshStatus();
})();
