<!-- /app/js/config.js -->
<script>
(function () {
  // ===== ערכים לשנות לפי הסביבה שלך =====
  // PROD: דומיין הפרונט
  const PROD_FRONTEND = "https://calendargpt.org";
  // PROD: דומיין ה-API (ספרינג)
  const PROD_API_BASE = "https://calendarchatgpt.runmydocker-app.com"; // לדוגמה: https://calendargpt-api.runmydocker-app.com

  // DEV: כתובות מקומיות (אם עובדים לוקאלית)
  const DEV_FRONTEND = "http://localhost:5173"; // או היציאה שבה אתה משרת את הפרונט
  const DEV_API_BASE = "http://localhost:8080";

  // זיהוי סביבת פיתוח/פרודקשן לפי ה-host
  const isLocal = location.hostname === "localhost" || location.hostname.startsWith("127.") || location.hostname.endsWith(".local");
  const FRONTEND_BASE = isLocal ? DEV_FRONTEND : PROD_FRONTEND;
  const API_BASE = isLocal ? DEV_API_BASE : PROD_API_BASE;

  // כתובת ה־callback של הלוגין (חוזרים אליה עם ?token=...)
  const OAUTH_CALLBACK_URL = FRONTEND_BASE + "/app/index.html";

  // אם ה-backend מצפה ל-redirect_uri, נכניס אותו לשאילתה:
  const OAUTH_LOGIN_URL = API_BASE + "/auth/google/login?redirect_uri=" + encodeURIComponent(OAUTH_CALLBACK_URL);

  // נחשוף לאפליקציה
  window.APP_CONFIG = {
    API_BASE,
    FRONTEND_BASE,
    OAUTH_CALLBACK_URL,
    OAUTH_LOGIN_URL
  };

  // תאימות לאחור אם יש קוד ישן
  window.API_BASE = API_BASE;
})();
</script>
