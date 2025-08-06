// 🔐 Helper function to return auth header
function authHeader() {
  const token = localStorage.getItem("AUTH_TOKEN");
  console.log("JWT Token: ", token);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}


// 🧠 Send message to chat API
function sendChatMessage(message, onSuccess, onError) {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    console.error("Missing userId in sessionStorage");
    return;
  }

  $.ajax({
    url: "/chat",
    method: "GET",
    xhrFields: { withCredentials: true }, // ✅ שולח את הקוקי באופן אוטומטי
    data: {
      prompt: message,
      userId: userId,
    },
    success: onSuccess,
    error: onError,
  });
}

// ❌ Delete calendar event
function deleteEvent(calendarId, eventId, element, onSuccess, onError) {
  $.ajax({
    url: `/api/google-calendar/calendars/${calendarId}/events/${eventId}`,
    method: "DELETE",
    xhrFields: { withCredentials: true }, // ✅
    success: () => onSuccess(element),
    error: onError,
  });
}

// 🔁 Update calendar event
function updateEvent(calendarId, eventId, eventData, onSuccess, onError) {
  $.ajax({
    url: `/api/google-calendar/calendars/${calendarId}/events/${eventId}`,
    method: "PUT",
    xhrFields: { withCredentials: true }, // ✅
    contentType: "application/json",
    data: JSON.stringify(eventData),
    success: onSuccess,
    error: onError,
  });
}

// 🙋 Fetch current authenticated user
fetch("/api/me", {
  credentials: "include", // ✅ for cookies
})
  .then((res) => {
    if (!res.ok) {
      throw new Error("Unauthorized");
    }
    return res.json();
  })
  .then((user) => {
    sessionStorage.setItem("userId", user.id);
  })
  .catch(() => console.error("🔴 Couldn't fetch user session"));
