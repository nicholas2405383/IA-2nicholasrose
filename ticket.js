//nicholas rose #2405383

// ticket.js: fills the ticket with the saved data

const saved = localStorage.getItem("ticketData");

if (saved === null) {
  // No saved data, so go back to the landing page
  window.location.replace("index.html");
} else {
  const data = JSON.parse(saved);

  // Text details
  document.getElementById("ticket-heading-name").textContent = data.fullName;
  document.getElementById("ticket-serial").textContent = data.serial;
  document.getElementById("ticket-name").textContent = data.fullName;
  document.getElementById("ticket-email").textContent = data.email;

  // GitHub link 
  const github = document.getElementById("ticket-github");
  github.textContent = data.github;
  github.href = "https://github.com/" + data.github.slice(1);

  // Profile picture
  const avatar = document.getElementById("ticket-avatar");
  avatar.src = data.avatar;
  avatar.alt = "Profile picture of " + data.fullName;
}

