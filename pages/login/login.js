import { loginUser } from "../../scripts/api.js";
import { setLoaderVisibility } from "../../scripts/domBuilder.js";

document.addEventListener("DOMContentLoaded", async function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));

    setLoaderVisibility(true);
    await loginUser(formData, () => setLoaderVisibility(false));
  });
});
