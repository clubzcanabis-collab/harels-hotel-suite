(() => {
  const header = document.getElementById("header");
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  const form = document.getElementById("bookingForm");
  const roomSelect = document.getElementById("roomSelect");
  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const status = document.getElementById("formStatus");

  // Change this to the hotel's correct WhatsApp number: country code + number, digits only.
  const HOTEL_WHATSAPP_NUMBER = "2347067019226";

  const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    if (!toggle || !links) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    links.classList.remove("open");
    document.body.classList.remove("menu-open");
  }
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      links.classList.toggle("open", !open);
      document.body.classList.toggle("menu-open", !open);
    });
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 820) closeMenu(); });
  }

  document.querySelectorAll("[data-room]").forEach(el => el.addEventListener("click", () => {
    if (roomSelect) roomSelect.value = el.dataset.room;
  }));

  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  if (checkin) checkin.min = localToday;
  if (checkout) checkout.min = localToday;
  if (checkin && checkout) checkin.addEventListener("change", () => {
    checkout.min = checkin.value || localToday;
    if (checkout.value && checkout.value <= checkin.value) checkout.value = "";
  });

  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!/^\d{8,15}$/.test(HOTEL_WHATSAPP_NUMBER)) {
  if (status) status.textContent = "Please update the hotel's WhatsApp number in script.js.";
  return;
}
    const data = new FormData(form);
    const d = key => String(data.get(key) || "").trim();
    if (d("checkout") <= d("checkin")) {
      if (status) status.textContent = "Check-out must be after check-in.";
      checkout?.focus();
      return;
    }
    const message = [
      "Hello Harels Hotel & Suites, I'd like to make a booking enquiry.",
      "",
      `Full name: ${d("name")}`,
      `Email: ${d("email")}`,
      `Phone / WhatsApp: ${d("phone")}`,
      `Room or service: ${d("room")}`,
      `Check-in: ${d("checkin")}`,
      `Check-out: ${d("checkout")}`,
      `Special requests: ${d("requests") || "None"}`,
      "",
      "Please confirm availability and total rate. I understand this is a request, not a confirmed reservation."
    ].join("\\n");
    const url = `https://wa.me/${HOTEL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    if (status) status.textContent = "WhatsApp is opening with your request. Review it and press Send.";
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();