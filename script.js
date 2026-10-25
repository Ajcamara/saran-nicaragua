const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector("#site-navigation");

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  siteNavigation?.classList.toggle("is-open", !isExpanded);
});

siteNavigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    siteNavigation.classList.remove("is-open");
  });
});

const appointmentForm = document.querySelector("#appointment-form");
const appointmentDate = appointmentForm?.elements.namedItem("date");
const bookingStatus = document.querySelector("#booking-status");

if (appointmentDate instanceof HTMLInputElement) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
  appointmentDate.min = localToday;
}

appointmentForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!(appointmentForm instanceof HTMLFormElement)) {
    return;
  }

  const formData = new FormData(appointmentForm);
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const subject = `Appointment request - ${name}`;
  const body = [
    "Hello Saran,",
    "",
    "I would like to request a makeup appointment.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Service: ${service}`,
    `Preferred date: ${date}`,
    `Preferred time: ${time}`,
    `Notes: ${notes || "None"}`,
    "",
    "I understand the appointment is not confirmed until you reply.",
  ].join("\n");

  const gmailCompose = new URL("https://mail.google.com/mail/");
  gmailCompose.search = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: "sarancamara794@gmail.com",
    su: subject,
    body,
  }).toString();

  const mailWindow = window.open(gmailCompose.toString(), "_blank");
  if (!mailWindow) {
    const mailto = new URL("mailto:sarancamara794@gmail.com");
    mailto.search = new URLSearchParams({ subject, body }).toString();
    window.location.href = mailto.toString();
  } else {
    mailWindow.opener = null;
  }

  if (bookingStatus) {
    bookingStatus.textContent =
      "Your email draft is ready. Send it to request an appointment; Saran will confirm by reply.";
  }
});

const chatToggle = document.querySelector("#chat-toggle");
const chatClose = document.querySelector("#chat-close");
const chatPanel = document.querySelector("#chat-panel");

const setChatOpen = (isOpen) => {
  if (!(chatPanel instanceof HTMLElement) || !(chatToggle instanceof HTMLButtonElement)) {
    return;
  }

  chatPanel.hidden = !isOpen;
  chatToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    chatClose?.focus();
  } else {
    chatToggle.focus();
  }
};

chatToggle?.addEventListener("click", () => {
  setChatOpen(chatToggle.getAttribute("aria-expanded") !== "true");
});

chatClose?.addEventListener("click", () => setChatOpen(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && chatToggle?.getAttribute("aria-expanded") === "true") {
    setChatOpen(false);
  }
});

const shareButton = document.querySelector("#share-site");

shareButton?.addEventListener("click", async () => {
  if (window.location.protocol === "file:") {
    window.alert("Publish the website first to get a public link you can share.");
    return;
  }

  const publicUrl = new URL(window.location.href);
  publicUrl.hash = "";
  const shareData = {
    title: "Saran Nicaragua | Makeup & Beauty",
    text: "Explore beauty looks and book an appointment with Saran Nicaragua.",
    url: publicUrl.toString(),
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      window.alert("Website link copied. You can now share it.");
      return;
    }
    window.prompt("Copy and share this website link:", shareData.url);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }
    console.error("Unable to share the website link.", error);
    window.alert("Could not share the link. Please copy it from your browser address bar.");
  }
});
