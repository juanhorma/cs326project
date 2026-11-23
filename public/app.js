const form = document.querySelector("#dive-entry");
const errorMessage = document.querySelector("#form-error");

if (form?.elements?.date) {
  form.elements.date.max = new Date().toLocaleDateString("en-CA");
}

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
    await fetchJSON("/dives", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dive),
    });

    const divesList = document.querySelector("#dives");
    divesList.addEventListener(
      "htmx:afterSettle",
      () => {
        const summaries = divesList.querySelectorAll("summary");
        if (summaries.length > 0) {
          summaries[summaries.length - 1].focus();
        } else {
          divesList.focus();
        }
      },
      { once: true },
    );

    document.querySelector("#show-all-button").click();

    form.reset();
  } catch (error) {
    errorMessage.textContent = `Your dive was not saved. ${error.message}`;
  } finally {
    button.disabled = false;
  }
});

document.body.addEventListener('htmx:beforeSwap', (event) => {
  if (event.detail.xhr.status === 200 &&
      event.detail.requestConfig.verb === "delete" &&
      document.querySelector("#dives").querySelectorAll(".dive-item").length === 1) {
    const item = document.createElement("li");
    item.id = "search-message";
    item.className = "rounded-2xl bg-slate-900/80 p-6 text-center text-slate-300 ring-1 ring-white/10 backdrop-blur";
    item.textContent = "No matching dives found.";
    document.querySelector("#dives").append(item);
  }
});

//This should fix the focus & make sure it is in a reasonable place after a delete

document.body.addEventListener("htmx:beforeSwap", (event) => {
  if (event.detail.requestConfig.verb !== "delete" || event.detail.xhr.status !== 200) return;
  const card = event.detail.target;
  const next = card.nextElementSibling?.matches(".dive-item") ? card.nextElementSibling : null;
  const previous = card.previousElementSibling?.matches(".dive-item") ? card.previousElementSibling : null;
  const neighbour = next || previous;
  const focusTarget = neighbour
    ? neighbour.querySelector("summary")
    : document.querySelector("#search-message");
  if (!focusTarget) return;
  if (!neighbour) focusTarget.tabIndex = -1;
  // htmx removes the card right after this event, so focus on the next tick.
  setTimeout(() => focusTarget.focus());
});

document.body.addEventListener("htmx:afterRequest", (event) => {
  if (event.detail.requestConfig.verb === "delete" && !event.detail.successful) {
    setTimeout(() => event.detail.elt.focus());
  }
});