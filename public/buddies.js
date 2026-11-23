const form = document.querySelector("#buddy-entry");
const list = document.querySelector("#buddies");
const emptyMessage = document.querySelector("#buddies-empty");
const errorMessage = document.querySelector("#form-error");

const buildBuddyListItem = (buddy) => {
  const item = document.createElement("li");
  item.className =
    "buddy-item rounded-2xl bg-slate-900/80 p-4 ring-1 ring-white/10 backdrop-blur";

  const name = document.createElement("h3");
  name.className = "text-lg font-semibold text-white";
  name.textContent = buddy.name;
  item.append(name);

  for (const [prop, label] of [
    ["certification", "Certification"],
    ["email", "Email"],
  ]) {
    if (buddy[prop]) {
      const detail = document.createElement("span");
      detail.className = "mt-1 text-sm break-all text-slate-300";
      detail.textContent = `${label}: ${buddy[prop]}`;
      item.append(detail);
    }
    }

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className =
    "mt-3 px-3 py-1.5 text-sm font-semibold text-rose-200 ring-1 ring-rose-400/50 transition hover:bg-rose-500/20 hover:text-white disabled:opacity-60";
  remove.setAttribute("aria-label", `Delete ${buddy.name}`);
  remove.setAttribute("hx-delete", `/buddies/${buddy.id}`);
  remove.setAttribute("hx-target", "closest li");
  remove.setAttribute("hx-swap", "outerHTML");
  remove.setAttribute("hx-confirm", "Delete this buddy?");
  remove.setAttribute("hx-disabled-elt", "this");
  remove.textContent = "Delete";
  item.append(remove);

  return item;
};

const fetchJSON = async (url, options) => {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(5000),
    });
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

    const item = buildBuddyListItem(saved);
    list.append(item);
    htmx.process(item);
    emptyMessage.hidden = true;
    form.reset();
    form.querySelector("input").focus();
  } catch (error) {
    errorMessage.textContent = `Your buddy was not saved. ${error.message}`;
  } finally {
    button.disabled = false;
  }
});

document.body.addEventListener('htmx:beforeSwap', (event) => {
 if (event.detail.xhr.status === 200 &&
     event.detail.requestConfig.verb === "delete" &&
     list.querySelectorAll(".buddy-item").length === 1) {
   emptyMessage.hidden = false;
 }
});

//This is the addition for fixing the focus issues
emptyMessage.tabIndex = -1;

document.body.addEventListener("htmx:beforeSwap", (event) => {
  if (event.detail.requestConfig.verb !== "delete" || event.detail.xhr.status !== 200) return;
  const card = event.detail.target;
  const neighbour = card.nextElementSibling || card.previousElementSibling;
  const focusTarget = neighbour ? neighbour.querySelector("button") : emptyMessage;
  // htmx removes the card right after this event, so focus on the next tick.
  setTimeout(() => focusTarget.focus());
});

document.body.addEventListener("htmx:afterRequest", (event) => {
  if (event.detail.requestConfig.verb === "delete" && !event.detail.successful) {
    setTimeout(() => event.detail.elt.focus());
  }
});