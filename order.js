const products = {
  "Whiskas": { price: 22000, image: "cat_whiskas.webp" },
  "Bellotta": { price: 60000, image: "cat_bellota.webp" },
  "RoyalCanin": { price: 20000, image: "cat_royal.webp" },
  "9Lives": { price: 50000, image: "cat_9lives.webp" },
  "Logo": { price: 22500, image: "dog_logo.webp" },
  "Pedigree": { price: 25000, image: "dog_pedigree.webp" },
  "Purina": { price: 27500, image: "dog_purini.webp" },
  "Snappy": { price: 30000, image: "dog_snappy.webp" },
  "Tetra": { price: 12500, image: "fish_tetra.webp" },
  "Sticks": { price: 15000, image: "fish_sticks.webp" },
  "Aquascape": { price: 17500, image: "fish_aqua.webp" },
  "Aquanutri": { price: 20000, image: "fish_aquanutri.webp" }
};
const params = new URLSearchParams(location.search);
const requested = params.get("product");
const selectedName = products[requested] ? requested : "Dog Calcium Premium Food";
const selected = products[selectedName];
const $ = id => document.getElementById(id);
$("summaryName").textContent = selectedName;
$("summaryImage").src = selected.image;

function money(value) { return new Intl.NumberFormat("en-US").format(value) + " MMK"; }
function updateTotals() {
  const qty = Math.max(1, Math.min(20, Number($("quantity").value) || 1));
  $("quantity").value = qty;
  const subtotal = selected.price * qty;
  const shipping = subtotal >= 75000 ? 0 : 3000;
  $("itemTotal").textContent = money(subtotal);
  $("subtotal").textContent = money(subtotal);
  $("shipping").textContent = shipping ? money(shipping) : "FREE";
  $("grandTotal").textContent = money(subtotal + shipping);
}
$("minusQty").addEventListener("click", () => { $("quantity").value = Math.max(1, Number($("quantity").value) - 1); updateTotals(); });
$("plusQty").addEventListener("click", () => { $("quantity").value = Math.min(20, Number($("quantity").value) + 1); updateTotals(); });
$("quantity").addEventListener("input", updateTotals);

document.querySelectorAll('input[name="payment"]').forEach(radio => radio.addEventListener("change", () => {
  document.querySelectorAll(".payment-option").forEach(option => option.classList.remove("active"));
  radio.closest(".payment-option").classList.add("active");
  document.querySelectorAll(".wallet-detail").forEach(detail => detail.classList.toggle("active", detail.dataset.wallet === radio.value));
}));

function markError(input, message) {
  const group = input.closest(".form-group");
  input.classList.toggle("invalid", Boolean(message));
  const small = group?.querySelector(".field-error");
  if (small) small.textContent = message;
}
function validate() {
  let ok = true;
  ["fullName", "phone", "email", "address", "city", "postal"].forEach(id => {
    const el = $(id);
    let msg = el.value.trim() ? "" : "This field is required.";
    if (id === "email" && el.value && !/^\S+@\S+\.\S+$/.test(el.value)) msg = "Enter a valid email address.";
    if (id === "phone" && el.value && el.value.replace(/\D/g, "").length < 7) msg = "Enter a valid phone number.";
    markError(el, msg);
    if (msg) ok = false;
  });
  return ok;
}
$("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!validate()) { document.querySelector(".invalid")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
  $("customerName").textContent = $("fullName").value.trim();
  $("orderNumber").textContent = "MT-" + Date.now().toString().slice(-7);
  $("successModal").hidden = false;
  document.body.classList.add("modal-open");
});
const toggle = document.querySelector(".menu-toggle"), nav = document.querySelector(".nav-links");
toggle.addEventListener("click", () => { nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", nav.classList.contains("open")); });
updateTotals();
