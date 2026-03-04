// public/assets/app.js

(() => {

const $ = (id) => document.getElementById(id);

const state = {
  biz: null,
  cart: new Map()
};

const COOLDOWN_SECONDS = 10;
let cooldownTimer = null;
let cooldownRemaining = 0;

const sanitizeText = (value, maxLen = 120) => {
  let s = String(value ?? "");
  s = s.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  s = s.replace(/\s+/g, " ").trim();
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen);
  return s;
};

const sanitizePhone = (value, maxLen = 15) => {
  let s = String(value ?? "").replace(/[^\d]/g, "");
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen);
  return s;
};

const isHoneypotTripped = () => {
  const hp = $("companyWebsite");
  if (!hp) return false;
  const v = sanitizeText(hp.value, 80);
  return v.length > 0;
};

const startCooldown = (btn) => {

  if (cooldownTimer) return;

  cooldownRemaining = COOLDOWN_SECONDS;
  btn.disabled = true;

  const tick = () => {

    if (cooldownRemaining <= 0) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
      cooldownRemaining = 0;
      btn.disabled = false;
      btn.textContent = "Enviar pedido por WhatsApp";
      return;
    }

    btn.textContent = `Espera ${cooldownRemaining}s…`;
    cooldownRemaining -= 1;

  };

  tick();
  cooldownTimer = setInterval(tick, 1000);
};

const stopCooldown = (btn) => {

  if (cooldownTimer) {
    clearInterval(cooldownTimer);
    cooldownTimer = null;
  }

  cooldownRemaining = 0;

  if (btn) {
    btn.disabled = false;
    btn.textContent = "Enviar pedido por WhatsApp";
  }
};

const money = (n) =>
  Number(n || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: state.biz?.currency || "MXN"
  });

const getSlug = () => {

  const path = location.pathname.replace(/^\/+|\/+$/g, "");

  if (!path) return "lunaboutiqueags";
  if (path === "luna") return "lunaboutiqueags";
  if (path === "f1") return "playerasf1";
  if (path === "CheliSpa") return "chelispa";

  return path;
};

async function loadBusiness(slug) {

  const res = await fetch(`/business/${encodeURIComponent(slug)}.json`, {
    cache: "no-store"
  });

  if (!res.ok) throw new Error(`No existe el negocio "${slug}".`);
  return res.json();
}

function renderTheme() {

  if (state.biz.theme?.primary) {
    document.documentElement.style.setProperty("--primary", state.biz.theme.primary);
  }
}

function renderLogo() {

  if (!state.biz.logo) return;

  const container = $("logoContainer");
  if (!container) return;

  container.innerHTML = "";

  const img = document.createElement("img");
  img.src = state.biz.logo;
  img.className = "logo";

  container.appendChild(img);
}

function renderProducts() {

  const list = $("productList");
  list.innerHTML = "";

  state.biz.products.forEach((p) => {

    const row = document.createElement("div");
    row.className = "product";

    row.innerHTML = `
      <div class="product-left">
        <img src="${p.image || ""}" class="product-img">
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="price">${money(p.price)}</div>
          <button class="add-variant btn-mini">Agregar esta combinación</button>
        </div>
      </div>
    `;

    const btn = row.querySelector(".add-variant");

    btn.addEventListener("click", () => {

      const existing = state.cart.get(p.id);

      if (existing) existing.qty += 1;
      else state.cart.set(p.id, { productId: p.id, qty: 1 });

      recalc(true);
    });

    list.appendChild(row);
  });
}

function recalc(animate = false) {

  const byId = new Map(state.biz.products.map((p) => [p.id, p]));

  let subtotal = 0;

  for (const [, item] of state.cart.entries()) {

    const p = byId.get(item.productId);
    if (!p) continue;

    subtotal += Number(p.price) * Number(item.qty);
  }

  const total = subtotal;

  $("subtotal").textContent = money(subtotal);
  $("shipping").textContent = money(0);
  $("total").textContent = money(total);

  if (animate) {
    const totalEl = $("total");
    totalEl.classList.add("pulse");
    setTimeout(() => totalEl.classList.remove("pulse"), 300);
  }

  return { subtotal, shipping: 0, total };
}

function validate() {

  $("error").textContent = "";

  if (state.cart.size === 0) {
    return "Agrega al menos 1 producto.";
  }

  const name = $("customerName")?.value.trim();
  const phone = $("customerPhone")?.value.trim();

  const onlyLetters = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
  const onlyNumbers = /^[0-9]+$/;

  if (!name || !onlyLetters.test(name)) {
    return "Nombre inválido.";
  }

  if (!phone || !onlyNumbers.test(phone) || phone.length !== 10) {
    return "Teléfono inválido.";
  }

  // Si el negocio es tipo registro (ej: cursos)
  if (state.biz.checkoutMode === "registro") {
    return null;
  }

  // Validación de dirección para envíos
  const street = $("street")?.value.trim();
  const neighborhood = $("neighborhood")?.value.trim();
  const zip = $("zip")?.value.trim();
  const city = $("city")?.value.trim();
  const stateField = $("state")?.value.trim();

  if (!street) {
    return "Ingresa calle.";
  }

  if (!neighborhood) {
    return "Ingresa colonia.";
  }

  if (!zip || zip.length !== 5) {
    return "CP inválido.";
  }

  if (!city) {
    return "Ingresa ciudad.";
  }

  if (!stateField) {
    return "Ingresa estado.";
  }

  return null;
}


function buildMessage({ total }) {

  const items = [];

  for (const [, item] of state.cart.entries()) {

    const p = state.biz.products.find(x => x.id === item.productId);
    if (!p) continue;

    const safeName = sanitizeText(p.name);

    items.push(`- ${safeName} x${item.qty}`);
  }

  const name = sanitizeText($("customerName").value);
  const phone = sanitizePhone($("customerPhone").value);
  const bizNameSafe = sanitizeText(state.biz.name);

  // Mensaje para cursos / registros
  if (state.biz.checkoutMode === "registro") {

    return [
      `🧾 *Registro para ${bizNameSafe}*`,
      "",
      `👤 *Nombre:* ${name}`,
      `📱 *Teléfono:* ${phone}`,
      "",
      "🎟 *Curso:*",
      items.join("\n"),
      "",
      `💰 *Costo total:* ${money(total)}`,
      `💳 *Apartado:* ${money(state.biz.paymentInfo?.deposit || 0)}`
    ].join("\n");

  }

  // Mensaje para pedidos con envío
  const street = sanitizeText($("street").value);
  const neighborhood = sanitizeText($("neighborhood").value);
  const zip = sanitizeText($("zip").value);
  const city = sanitizeText($("city").value);
  const stateField = sanitizeText($("state").value);

  const address = `${street}, Col. ${neighborhood}, CP ${zip}, ${city}, ${stateField}`;

  return [
    `🧾 *Pedido para ${bizNameSafe}*`,
    "",
    `👤 *Cliente:* ${name}`,
    `📱 *Teléfono:* ${phone}`,
    `📍 *Dirección:* ${address}`,
    "",
    "🛒 *Productos:*",
    items.join("\n"),
    "",
    `*Total:* ${money(total)}`
  ].join("\n");
}

function openWhatsapp(message) {

  const phone = String(state.biz.whatsappPhone || "").replace(/[^\d]/g, "");
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  location.href = url;
}

async function init() {
  try {

    const slug = getSlug();
    state.biz = await loadBusiness(slug);

    document.title = state.biz.name || "Mercadia";

    // Si es modo registro (ej: cursos), ocultar dirección
    if (state.biz.checkoutMode === "registro") {
      document.querySelectorAll(".address-field")
        .forEach(el => el.style.display = "none");
    }

    const btn = $("sendBtn");

    btn.addEventListener("click", () => {

      // evitar doble envío
      if (cooldownTimer) return;

      // honeypot anti-bot
      if (isHoneypotTripped()) {
        $("error").textContent = "No se pudo enviar.";
        startCooldown(btn);
        return;
      }

      btn.textContent = "Enviando...";
      btn.disabled = true;

      const err = validate();

      if (err) {
        btn.textContent = "Enviar pedido por WhatsApp";
        btn.disabled = false;
        $("error").textContent = err;
        return;
      }

      const totals = recalc();
      const msg = buildMessage(totals);

      // activar cooldown
      startCooldown(btn);

      setTimeout(() => {
        try {
          openWhatsapp(msg);
        } catch (e) {
          stopCooldown(btn);
          $("error").textContent = e.message || "Error al abrir WhatsApp.";
        }
      }, 600);

    });

    // render inicial
    renderTheme();
    renderLogo();
    render();       // ← importante: aquí se dibujan productos con variantes
    recalc();

  } catch (e) {

    $("bizName").textContent = "Error";
    $("bizNote").textContent = e.message;

  }
}

init();

})();