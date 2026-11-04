
 // code: nicholas rose 2405383

const form = document.getElementById("register-form");
const avatarInput = document.getElementById("avatar");

// Show a message under a field
function showError(fieldId, message) {
  document.getElementById(fieldId + "-error").textContent = message;
}

// Remove all error messages
function clearErrors() {
  const errors = document.querySelectorAll(".error");

  for (let i = 0; i < errors.length; i++) {
    errors[i].textContent = "";
  }
}

// Runs when the form is submitted
form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  const fullName = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const github = document.getElementById("github").value.trim();
  const file = avatarInput.files[0];

  let isValid = true;

  // Name cannot be empty
  if (fullName === "") {
    showError("name", "Enter your full name.");
    isValid = false;
  }

  // Email must look like name@domain.com
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showError("email", "Enter a valid email address, like name@example.com.");
    isValid = false;
  }

  // GitHub must start with @
  const githubPattern = /^@[A-Za-z0-9-]+$/;

  if (!githubPattern.test(github)) {
    showError("github", "Enter a GitHub username that starts with @, like @octocat.");
    isValid = false;
  }

  // Picture must be a JPG or PNG under 500 KB
  if (!file) {
    showError("avatar", "Choose a profile picture.");
    isValid = false;
  } else if (file.type !== "image/jpeg" && file.type !== "image/png") {
    showError("avatar", "The picture must be a JPG or PNG file.");
    isValid = false;
  } else if (file.size > 500 * 1024) {
    showError("avatar", "The picture is too large. Choose one under 500 KB.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Read the picture, save everything, then open the ticket page
  const reader = new FileReader();

  reader.onload = function () {
    const ticketData = {
      fullName: fullName,
      email: email,
      github: github,
      avatar: reader.result,
      serial: "#" + Math.floor(10000 + Math.random() * 90000)
    };

    try {
      localStorage.setItem("ticketData", JSON.stringify(ticketData));
      window.location.href = "ticket.html";
    } catch (error) {
      showError("avatar", "Could not save ticket data. Please try again.");
    }
  };

  reader.onerror = function () {
    showError("avatar", "Could not read the picture. Try another file.");
  };

  reader.readAsDataURL(file);
});

// Show the chosen file name in the drop zone
avatarInput.addEventListener("change", function () {
  const file = avatarInput.files[0];
  const dropTitle = document.getElementById("drop-title");

  if (dropTitle) {
    dropTitle.textContent = file ? file.name : "Drop here";
  }
});
