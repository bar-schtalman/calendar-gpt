function api(path) {
  const base = ((window.APP_CONFIG && window.APP_CONFIG.API_BASE) || "").replace(/\/+$/, "");
  let p = path || "/";
  // אם העברת /api/... – נקלף את /api כי ה-BASE כבר כולל /api
  p = p.startsWith("/api/") ? p.slice(4) : p;
  // נוודא שיש '/' יחיד בין base ל-path
  if (!p.startsWith("/")) p = "/" + p;
  return base + p;
}

// 🔐 Authorization header from localStorage
function authHeader() {
  const token = localStorage.getItem("AUTH_TOKEN");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

let currentEditingEvent = null;

function openEditModal(event) {
  currentEditingEvent = event;

  $.ajax({
    url: api(`/events/${event.id}`),
    method: "GET",
    headers: authHeader(),
    success: function (data) {
      const [startDate, startTime] = (data.start || "").split(" ");
      const [endDate, endTime] = (data.end || "").split(" ");

      $("#eventSummary").val(data.summary || "");
      $("#startDate").val(formatDateForInput(startDate));
      $("#startTime").val(formatTimeForInput(startTime));
      $("#endDate").val(formatDateForInput(endDate || startDate));
      $("#endTime").val(formatTimeForInput(endTime));

      $("#editModal").modal("show");
    },
    error: function (xhr) {
      alert("❌ Failed to fetch event: " + (xhr.responseText || xhr.statusText));
    },
  });
}

$("#saveEdit").click(() => {
  const summary = $("#eventSummary").val().trim();
  const start = `${$("#startDate").val()}T${$("#startTime").val()}`;
  const end = `${$("#endDate").val()}T${$("#endTime").val()}`;

  if (!(summary && start && end)) {
    alert("All fields are required");
    return;
  }

  const updatedEvent = {
    summary,
    description: "",
    location: "",
    start,
    end,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  $.ajax({
    url: api(`/events/update/${currentEditingEvent.id}`),
    method: "PUT",
    headers: { ...authHeader() },
    contentType: "application/json",
    data: JSON.stringify(updatedEvent),
    success: () => {
      $("#editModal").modal("hide");
      alert("✅ Event updated!");

      // ריענון האירוע המעודכן מהשרת
      $.ajax({
        url: api(`/events/${currentEditingEvent.id}`),
        method: "GET",
        headers: authHeader(),
        success: (updatedData) => {
          const [startDateStr, startTimeStr] = (updatedData.start || "").split(" ");
          const [endDateStr, endTimeStr] = (updatedData.end || "").split(" ");

          updatedData.date = startDateStr || "";
          updatedData.time = (startTimeStr && endTimeStr) ? `${startTimeStr} - ${endTimeStr}` : "";

          refreshEventInUI(updatedData);
        },
        error: (xhr) => {
          console.error("❌ Failed to fetch updated event:", xhr.responseText || xhr.statusText);
        },
      });
    },
    error: (xhr) => {
      alert("❌ Update failed: " + (xhr.responseText || xhr.statusText));
    },
  });
});

function formatDateForInput(dateStr) {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("-");
  // server returns DD-MM-YYYY; convert to YYYY-MM-DD for <input type="date">
  if (year && month && day) return `${year}-${month}-${day}`;
  return dateStr; // fallback
}

function formatTimeForInput(timeStr) {
  return timeStr || "";
}
