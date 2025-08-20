function api(path) {
  const base = ((window.APP_CONFIG && window.APP_CONFIG.API_BASE) || "").replace(/\/+$/, "");
  let p = path || "/";
  // אם העברת /api/... – נקלף את /api כי ה-BASE כבר כולל /api
  p = p.startsWith("/api/") ? p.slice(4) : p;
  // נוודא שיש '/' יחיד בין base ל-path
  if (!p.startsWith("/")) p = "/" + p;
  return base + p;
}
// 🔐 Helper: auth header
function authHeader() {
  const token = localStorage.getItem("AUTH_TOKEN");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🧠 Send message to chat API
function sendChatMessage(message, onSuccess, onError) {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    console.error("Missing userId in sessionStorage");
    return;
  }

  $.ajax({
    url: `${window.APP_CONFIG.API_BASE}/chat`,
    method: "GET",
    headers: authHeader(),
    data: { prompt: message, userId: userId },
    success: onSuccess,
    error: onError,
  });
}

// ❌ Delete calendar event
function deleteEvent(calendarId, eventId, element, onSuccess, onError) {
  $.ajax({
    url: `${window.APP_CONFIG.API_BASE}/api/google-calendar/calendars/${calendarId}/events/${eventId}`,
    method: "DELETE",
    headers: authHeader(),
    success: () => onSuccess(element),
    error: onError,
  });
}

// 🔁 Update calendar event
function updateEvent(calendarId, eventId, eventData, onSuccess, onError) {
  $.ajax({
    url: `${window.APP_CONFIG.API_BASE}/api/google-calendar/calendars/${calendarId}/events/${eventId}`,
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    data: JSON.stringify(eventData),
    success: onSuccess,
    error: onError,
  });
}

// 🙋 Fetch current authenticated user
fetch(`${window.APP_CONFIG.API_BASE}/api/me`, {
  headers: authHeader(),
})
  .then((res) => {
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  })
  .then((user) => sessionStorage.setItem("userId", user.id))
  .catch(() => console.error("🔴 Couldn't fetch user session"));
