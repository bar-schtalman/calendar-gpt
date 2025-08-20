function api(path) {
  const base = ((window.APP_CONFIG && window.APP_CONFIG.API_BASE) || "").replace(/\/+$/, "");
  let p = path || "/";
  // אם העברת /api/... – נקלף את /api כי ה-BASE כבר כולל /api
  p = p.startsWith("/api/") ? p.slice(4) : p;
  // נוודא שיש '/' יחיד בין base ל-path
  if (!p.startsWith("/")) p = "/" + p;
  return base + p;
}// 🔐 Authorization header from localStorage
function authHeader() {
  const token = localStorage.getItem("AUTH_TOKEN");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🧭 Prefix API base from global config
function api(path) {
  const base = (window.APP_CONFIG && window.APP_CONFIG.API_BASE) || "";
  return `${base}${path}`;
}

function appendMessage(sender, text) {
  const msgDiv = $("<div></div>")
    .addClass("message " + sender)
    .html(text);
  $("#chatWindow").append(msgDiv).append("<div class='clear'></div>");
  scrollToBottom();
}

function appendEvent(event) {
  const card = $(`<div class='event-card' id='event-${event.id}'></div>`);
  const summary = $("<div class='event-summary'></div>").text(event.summary);

  const date = event.date || "?";
  const time = event.time || "N/A - ?";

  const dateText = $("<span class='event-date-text'></span>").text(`📅 ${date}`);
  const timeText = $("<span class='event-time-text'></span>").text(`🕒 ${time}`);
  const dateRow = $("<div class='event-date'></div>").append(dateText, " ", timeText);

  const deleteBtn = $("<button class='delete-event'></button>")
    .html("❌")
    .on("click", () => {
      $.ajax({
        url: api(`/api/events/delete/${event.id}`),
        method: "DELETE",
        headers: authHeader(),
        success: () => {
          card.html("<div class='event-deleted'>DELETED</div>");
        },
        error: (xhr) => {
          alert("Delete failed: " + (xhr.responseText || xhr.statusText));
        },
      });
    });

  const editBtn = $("<button class='edit-event btn btn-primary btn-sm'></button>")
    .html("✏️")
    .on("click", () => openEditModal(event));

  const guestBtn = $("<button class='guest-event btn btn-info btn-sm'></button>")
    .html("➕")
    .on("click", () => openGuestModal(event));

  const buttons = $("<div class='button-container'></div>").append(editBtn, deleteBtn, guestBtn);
  const guestSection = renderGuestSection(event);

  card.append(summary, dateRow, buttons, guestSection);
  $("#chatWindow").append(card);
  scrollToBottom();
}

function refreshEventInUI(event) {
  const $card = $(`#event-${event.id}`);
  if ($card.length === 0) return;

  const summary = $("<div class='event-summary'></div>").text(event.summary);
  const date = event.date || "?";
  const time = event.time || "N/A - ?";

  const dateText = $("<span class='event-date-text'></span>").text(`📅 ${date}`);
  const timeText = $("<span class='event-time-text'></span>").text(`🕒 ${time}`);
  const dateRow = $("<div class='event-date'></div>").append(dateText, " ", timeText);

  const deleteBtn = $("<button class='delete-event'></button>")
    .html("❌")
    .on("click", () => {
      $.ajax({
        url: api(`/api/events/delete/${event.id}`),
        method: "DELETE",
        headers: authHeader(),
        success: () => {
          $card.html("<div class='event-deleted'>DELETED</div>");
        },
        error: (xhr) => {
          alert("Delete failed: " + (xhr.responseText || xhr.statusText));
        },
      });
    });

  const editBtn = $("<button class='edit-event btn btn-primary btn-sm'></button>")
    .html("✏️")
    .on("click", () => openEditModal(event));

  const guestBtn = $("<button class='guest-event btn btn-info btn-sm'></button>")
    .html("➕")
    .on("click", () => openGuestModal(event));

  const buttons = $("<div class='button-container'></div>").append(editBtn, deleteBtn, guestBtn);
  const guestSection = renderGuestSection(event);

  $card.empty().append(summary, dateRow, buttons, guestSection);
}

// Keep renderEventCard global
window.renderEventCard = appendEvent;

// 🧹 local utility
function scrollToBottom() {
  const cw = document.getElementById("chatWindow");
  if (cw) cw.scrollTop = cw.scrollHeight;
}
