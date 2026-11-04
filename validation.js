/* validates the sign-up form, saves the data, opens the ticket page */

const STORAGE_KEY = "ticketData";
const COUNTER_KEY = "ticketCounter";
const MAX_AVATAR_BYTES = 500 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const GITHUB_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

const form = document.getElementById("register-form");
const dropzone = document.getElementById("dropzone");
const avatarInput = document.getElementById("avatar");

/* Writes a error message into a field and marks it as invalid */
function showError(fieldId, message) {
  document.getElementById(`${fieldId}-error`).textContent = message;
  document.getElementById(fieldId).setAttribute("aria-invalid", "true");
}

/* Empties every error paragraph and removes the invalid flags. */
function clearErrors() {
  form.querySelectorAll(".error").forEach((p) => { p.textContent = ""; });
  form.querySelectorAll("[aria-invalid]").forEach((input) => input.removeAttribute("aria-invalid"));
}

/* Checks all fields. Returns true when valid else false. */
function validateForm(values, file) {
  let isValid = true;

  if (!values.firstName) {
    showError("first-name", "Enter your first name.");
    isValid = false;
  }

  if (!values.lastName) {
    showError("last-name", "Enter your last name.");
    isValid = false;
  }

  if (!EMAIL_PATTERN.test(values.email)) {
    showError("email", "Enter a valid email address, like name@example.com.");
    isValid = false;
  }

  if (!GITHUB_PATTERN.test(values.github)) {
    showError("github", "Enter a valid GitHub username, like @octocat.");
    isValid = false;
  }

  if (!file) {
    showError("avatar", "Choose or drop a profile picture.");
    isValid = false;
  } else if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    showError("avatar", "The picture must be a JPG or PNG file.");
    isValid = false;
  } else if (file.size > MAX_AVATAR_BYTES) {
    showError("avatar", "The picture is too large. Choose one under 500 KB.");
    isValid = false;
  }

  return isValid;
}

/* Adds 1 to the counter */
function nextSerialNumber() {
  let count = 0;
  try {
    count = parseInt(localStorage.getItem(COUNTER_KEY), 10) || 0;
    localStorage.setItem(COUNTER_KEY, String(count + 1));
  } catch (error) {
    count = Math.floor(Math.random() * 9000);
  }
  return "#" + String(count + 1).padStart(4, "0");
}

/* Saves the registration to localStorage and opens the ticket page. */
function saveAndContinue(values, avatarDataUrl) {
  try {
    const ticketData = { ...values, avatar: avatarDataUrl, serial: nextSerialNumber() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ticketData));
    window.location.href = "ticket.html";
  } catch (error) {
    showError("avatar", "We couldn\u2019t save your ticket. Try a smaller picture.");
  }
}

/* Shows the chosen file's name inside the drop zone. */
function showFileName() {
  const file = avatarInput.files[0];
  document.getElementById("drop-title").textContent = file ? file.name : "Drop here";
}

/* Handles submit: validate first, then read the picture and save. */
form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const avatarFile = avatarInput.files[0];
  const values = {
    firstName: document.getElementById("first-name").value.trim(),
    lastName: document.getElementById("last-name").value.trim(),
    email: document.getElementById("email").value.trim(),
    github: document.getElementById("github").value.trim().replace(/^@/, "")
  };

  if (!validateForm(values, avatarFile)) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => saveAndContinue(values, reader.result));
  reader.addEventListener("error", () => showError("avatar", "We couldn\u2019t read that picture. Try another file."));
  reader.readAsDataURL(avatarFile);
});

avatarInput.addEventListener("change", showFileName);
["dragenter", "dragover"].forEach((name) => dropzone.addEventListener(name, () => dropzone.classList.add("is-over")));
["dragleave", "drop"].forEach((name) => dropzone.addEventListener(name, () => dropzone.classList.remove("is-over")));

