const form = document.querySelector("#buddy-entry");
const list = document.querySelector("#buddies");
const emptyMessage = document.querySelector("#buddies-empty");
const errorMessage = document.querySelector("#form-error");
errorMessage.style.color = "white";

const buildBuddyListItem = (buddy) => {
  const item = document.createElement("li");
  item.className = "buddy-item";

  const name = document.createElement("h3");
  name.textContent = buddy.name;
  item.append(name);

  for (const [prop, label] of [
    ["certification", "Certification"],
    ["email", "Email"],
  ]) {
    if (buddy[prop]) {
      const detail = document.createElement("span");
      detail.textContent = `${label}: ${buddy[prop]}`;
      item.append(detail);
    }
  }
  return item;
};

const fetchJSON = async (url, options) => {
  let response;
  try {
    response = await fetch(url, { ...options, signal: AbortSignal.timeout(5000) });
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

  const buddy = Object.fromEntries(new FormData(form));
  const button = form.querySelector("button");
  button.disabled = true;

  try {
    const saved = await fetchJSON("/buddies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buddy),
    });

    list.append(buildBuddyListItem(saved));
    emptyMessage.hidden = true;
    form.reset();
  } catch (error) {
    errorMessage.textContent = `Your buddy was not saved. ${error.message}`;
  } finally {
    button.disabled = false;
  }
});
