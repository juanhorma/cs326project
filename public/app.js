const form = document.querySelector("#dive-entry");
const list = document.querySelector("#dives");
const errorMessage = document.querySelector("#form-error");

const buildDiveListItem = (dive) => {
  const keyNames = {
    date: "Date",
    diveTime: "Dive Time",
    maxDepth: "Maximum Depth",
    location: "Location",
    equipment: "Equipment",
    decompressionTime: "Decompression Time",
    notes: "Notes",
  };

  const item = document.createElement("li");
  item.className = "dive-item";

  const details = document.createElement("details");
  details.className = "dive-details";
  details.name = "dives-accordion";

  const summary = document.createElement("summary");
  summary.className = "dive-summary";

  const summaryContent = document.createElement("div");
  summaryContent.className = "summary-content";
  for (const [prop, label] of [
    ["date", "Date"],
    ["diveTime", "Dive Time"],
    ["maxDepth", "Maximum Depth"],
  ]) {
    const summaryElement = document.createElement("h3");
    summaryElement.textContent = `${label}: ${dive[prop]}`;
    summaryContent.append(summaryElement);
  }

  summary.append(summaryContent);

  const fullContent = document.createElement("div");
  fullContent.className = "full-content";

  for (const [key, keyAlias] of Object.entries(keyNames)) {
    if (dive[key] && key != "date" && key != "diveTime" && key != "maxDepth") {
      const fullContentElement = document.createElement("h3");
      h3.textContent = `${keyAlias} : ${dive[key]}`;
      fullContent.append(fullContentElement);
    }
  }

  details.append(summary, fullContent);
  item.append(details);
  return item;
};

const timedFetch = (url, options = {}) =>
  fetch(url, { ...options, signal: AbortSignal.timeout(5000) });

const fetchJSON = async (url, options) => {
  let response;
  try {
    response = await timedFetch(url, options);
  } catch (error) {
    throw new Error(
      error.name === "TimeoutError"
        ? "The server did not answer within five seconds."
        : "Could not reach server.",
    );
  }

  let body = {};

  try {
    body = await response.json();
  } catch {}
  if (!response.ok) {
    throw new Error(body.error || `The server answered ${response.status}.`);
  }
  return body;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";

  const data = new FormData(form);
  const dive = Object.fromEntries(data);

  dive.diveTime = Number(dive.diveTime);
  dive.maxDepth = Number(dive.maxDepth);

  if (dive.decompressionTime) {
    dive.decompressionTime = Number(dive.decompressionTime);
  }
  const button = form.querySelector("button");
  button.disabled = true;

  try {
    const saved = await fetchJSON("/dives", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dive),
    });

    list.append(buildDiveListItem(saved));
    form.reset();
  } catch (error) {
    errorMessage.textContent = `Your dive was not saved. ${error.message}`;
  } finally {
    button.disabled = false;
  }
});
