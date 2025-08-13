<!-- /app/js/config.js -->
<script>
(function () {
  // פרונט בפרודקשן
  const PROD_FRONTEND = "https://calendargpt.org";

  // בקאנד ספרינג בפרודקשן (השרת שנתת)
  const PROD_API_BASE = "https://calendarchatgpt.runmydocker-app.com";

  // ערכי DEV (אפשר להשאיר כברירת מחדל; רלוונטי רק כשעובדים לוקאלית)
  const DEV_FRONTEND = "http://localhost:5173";
  const DEV_API_BASE = "http://localhost:8080";

  const isLocal =
    location.hostname === "localhost" ||
    location.hostname.startsWith("127.") ||
    location.hostname.endsWith(".local");

  const FRONTEND_BASE = isLocal ? DEV_FRONTEND : PROD_FRONTEND;
  const API_BASE = isLocal ? DEV_API_BASE : PROD_API_BASE;

  window.APP_CONFIG = { API_BASE, FRONTEND_BASE };
  // תאימות לקוד ישן:
  window.API_BASE = API_BASE;
})();
</script>
