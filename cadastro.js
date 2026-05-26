/* ===== NEXUS MUAY THAI — cadastro.js ===== */

/* ── ENV LOADER ──────────────────────────────────────────────────────────────
   Em ambiente de PRODUÇÃO (Node.js/servidor), substitua este bloco por:
       const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER;
   
   No frontend puro, o .env é lido via fetch do arquivo local.
   Para servidores simples (ex: Apache/Nginx), use um endpoint que exponha
   apenas as variáveis públicas necessárias.
   
   Para desenvolvimento local (file://), o valor abaixo é usado como fallback.
─────────────────────────────────────────────────────────────────────────── */

let WHATSAPP_NUMBER = "5599999999999"; // fallback padrão

async function loadEnv() {
  try {
    const res = await fetch(".env");
    if (!res.ok) return;
    const text = await res.text();
    const lines = text.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      const value = rest.join("=").trim();
      if (key.trim() === "WHATSAPP_NUMBER" && value) {
        WHATSAPP_NUMBER = value;
      }
    }
  } catch (e) {
    // Silently use fallback
  }
}

/* ── LOADING SCREEN ──────────────────────────────────────────────────────── */
window.addEventListener("load", () => {
  loadEnv(); // carrega .env em paralelo
  setTimeout(() => {
    const screen = document.getElementById("loading-screen");
    if (screen) screen.classList.add("hidden");
  }, 2200);
});

/* ── STATE ───────────────────────────────────────────────────────────────── */
const state = {
  nome: "",
  idade: null,
  telAluno: "",
  telResponsavel: "",
  endereco: "",
  objetivo: "",
};

/* ── ELEMENTS ────────────────────────────────────────────────────────────── */
const elNome      = document.getElementById("nome");
const elIdade     = document.getElementById("idade");
const elTelAluno  = document.getElementById("tel-aluno");
const elTelResp   = document.getElementById("tel-responsavel");
const elEndereco  = document.getElementById("endereco");

const grupoResp   = document.getElementById("grupo-responsavel");

const erroNome    = document.getElementById("erro-nome");
const erroIdade   = document.getElementById("erro-idade");
const erroAluno   = document.getElementById("erro-aluno");
const erroResp    = document.getElementById("erro-responsavel");
const erroEnd     = document.getElementById("erro-endereco");
const erroObj     = document.getElementById("erro-objetivo");

const step1       = document.getElementById("step1");
const step2       = document.getElementById("step2");
const step3       = document.getElementById("step3");

const btnStep1    = document.getElementById("btn-step1");
const btnStep2    = document.getElementById("btn-step2");
const btnBack     = document.getElementById("btn-back");
const manualLink  = document.getElementById("manual-link");

/* ── PHONE MASK ──────────────────────────────────────────────────────────── */
function maskPhone(input) {
  input.addEventListener("input", () => {
    let v = input.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    input.value = v;
  });
}
maskPhone(elTelAluno);
maskPhone(elTelResp);

/* ── AGE LOGIC — mostrar/ocultar responsável ─────────────────────────────── */
elIdade.addEventListener("input", () => {
  const age = parseInt(elIdade.value, 10);
  if (!isNaN(age) && age < 18 && age >= 5) {
    grupoResp.classList.add("visible");
  } else {
    grupoResp.classList.remove("visible");
    elTelResp.value = "";
    showError(erroResp, "");
  }
});

/* ── ERROR HELPERS ───────────────────────────────────────────────────────── */
function showError(el, msg) {
  el.textContent = msg;
  el.classList.toggle("visible", !!msg);
  if (el.previousElementSibling?.classList.contains("input-wrap")) {
    el.closest(".field-group")?.classList.toggle("has-error", !!msg);
  }
}

function clearError(el) { showError(el, ""); }

/* ── VALIDATION STEP 1 ───────────────────────────────────────────────────── */
function validateStep1() {
  let valid = true;

  // Nome
  if (!elNome.value.trim() || elNome.value.trim().length < 3) {
    showError(erroNome, "⚠ Por favor, informe seu nome completo.");
    valid = false;
  } else { clearError(erroNome); }

  // Idade
  const age = parseInt(elIdade.value, 10);
  if (!elIdade.value || isNaN(age) || age < 5 || age > 99) {
    showError(erroIdade, "⚠ Informe uma idade válida entre 5 e 99 anos.");
    valid = false;
  } else { clearError(erroIdade); }

  // Telefone aluno
  const rawAluno = elTelAluno.value.replace(/\D/g, "");
  if (rawAluno.length < 10) {
    showError(erroAluno, "⚠ Informe um número de WhatsApp válido.");
    valid = false;
  } else { clearError(erroAluno); }

  // Telefone responsável (se menor)
  if (!isNaN(age) && age < 18) {
    const rawResp = elTelResp.value.replace(/\D/g, "");
    if (rawResp.length < 10) {
      showError(erroResp, "⚠ Informe o WhatsApp do responsável.");
      valid = false;
    } else { clearError(erroResp); }
  }

  // Endereço
  if (!elEndereco.value.trim() || elEndereco.value.trim().length < 8) {
    showError(erroEnd, "⚠ Informe o endereço completo.");
    valid = false;
  } else { clearError(erroEnd); }

  return valid;
}

/* ── STEP TRANSITIONS ────────────────────────────────────────────────────── */
function goToStep(from, to) {
  from.classList.add("hidden-step");
  to.classList.remove("hidden-step");
  to.style.animation = "none";
  requestAnimationFrame(() => {
    to.style.animation = "";
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── STEP 1 → STEP 2 ─────────────────────────────────────────────────────── */
btnStep1.addEventListener("click", () => {
  if (!validateStep1()) return;
  state.nome = elNome.value.trim();
  state.idade = parseInt(elIdade.value, 10);
  state.telAluno = elTelAluno.value.trim();
  state.telResponsavel = state.idade < 18 ? elTelResp.value.trim() : "";
  state.endereco = elEndereco.value.trim();
  goToStep(step1, step2);
});

/* ── OBJECTIVE SELECTION ─────────────────────────────────────────────────── */
const objBtns = document.querySelectorAll(".obj-btn");

objBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Deselect all
    objBtns.forEach(b => {
      b.classList.remove("selected");
      b.classList.add("dimmed");
    });
    // Select clicked
    btn.classList.add("selected");
    btn.classList.remove("dimmed");
    state.objetivo = btn.dataset.obj;
    clearError(erroObj);
  });
});

/* ── BACK ────────────────────────────────────────────────────────────────── */
btnBack.addEventListener("click", () => {
  goToStep(step2, step1);
});

/* ── BUILD WHATSAPP MESSAGE ──────────────────────────────────────────────── */
function buildMessage() {
  const menor = state.idade < 18;
  let msg = `Olá mestre, gostaria de realizar meu cadastro na NEXUS Muay Thai.\n\n`;
  msg += `👤 *Nome:* ${state.nome}\n`;
  msg += `📅 *Idade:* ${state.idade} anos\n`;
  msg += `📱 *Número do Aluno:* ${state.telAluno}\n`;
  msg += `📍 *Endereço:* ${state.endereco}\n`;
  if (menor) {
    msg += `👨‍👩‍👦 *Número do Responsável:* ${state.telResponsavel}\n`;
  }
  msg += `\n🎯 *Objetivo:* ${state.objetivo}`;
  return msg;
}

/* ── STEP 2 → ENVIAR ─────────────────────────────────────────────────────── */
btnStep2.addEventListener("click", () => {
  if (!state.objetivo) {
    showError(erroObj, "⚠ Por favor, selecione um objetivo.");
    return;
  }

  const message = buildMessage();
  const encoded = encodeURIComponent(message);
  const waURL   = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  // Store for manual link
  if (manualLink) manualLink.href = waURL;

  // Show success first, then open WhatsApp
  goToStep(step2, step3);

  setTimeout(() => {
    window.open(waURL, "_blank");
  }, 800);
});
