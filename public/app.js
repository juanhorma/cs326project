const form = document.querySelector("#dive-entry");
const savedDive = document.querySelector("#saved-dive");
const errorMessage = document.querySelector("#form-error");

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
  savedDive.textContent = "";

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

    savedDive.textContent =
      `Saved dive: ${saved.date}, ${saved.diveTime} minutes, ` +
      `${saved.maxDepth} maximum depth`;
    form.reset();
  } catch (error) {
    errorMessage.textContent = `Your dive was not saved. ${error.message}`;
  } finally {
    button.disabled = false;
  }
});
