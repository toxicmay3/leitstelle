import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "DEINE_SUPABASE_URL";
const SUPABASE_ANON_KEY = "DEIN_ANON_PUBLIC_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const statusEl = document.getElementById("status");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

function setStatus(text) {
  statusEl.textContent = text;
}

async function refreshUI() {
  const { data } = await supabase.auth.getSession();
  const user = data?.session?.user;

  if (user) {
    setStatus(`Eingeloggt als: ${user.email}`);
    loginForm.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    setStatus("Nicht eingeloggt");
    loginForm.style.display = "block";
    logoutBtn.style.display = "none";
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  setStatus("Login läuft...");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return setStatus("Login fehlgeschlagen: " + error.message);

  await refreshUI();
});

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  await refreshUI();
});

supabase.auth.onAuthStateChange(() => refreshUI());
refreshUI();
