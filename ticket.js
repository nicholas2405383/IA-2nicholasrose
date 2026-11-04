/* ticket.js: fills the ticket page with the data saved by validation.js */

const ticket = loadTicket();

if (!ticket) {
  window.location.replace("index.html");
} else {
  fillTicket(ticket);
}

/* Returns the saved ticket object, or null when nothing valid is saved. */
function loadTicket() {
  try {
    const data = JSON.parse(localStorage.getItem("ticketData"));
    return data && data.firstName ? data : null;
  } catch (error) {
    return null;
  }
}

/* Puts text into the element with the given id. */
function setText(id, text) {
  document.getElementById(id).textContent = text;
}

/* Copies the saved registration data into the ticket page elements. */
function fillTicket(data) {
  setText("ticket-heading-name", data.firstName);
  setText("ticket-id", data.serial);
  setText("ticket-serial", data.serial);
  setText("ticket-name", `${data.firstName} ${data.lastName}`);
  setText("ticket-email", data.email);

  const github = document.getElementById("ticket-github");
  github.textContent = `github.com/${data.github}`;
  github.href = `https://github.com/${encodeURIComponent(data.github)}`;

  const avatar = document.getElementById("ticket-avatar");
  if (data.avatar && data.avatar.startsWith("data:image/")) {
    avatar.src = data.avatar;
  }
  avatar.alt = `Profile picture of ${data.firstName} ${data.lastName}`;
}

