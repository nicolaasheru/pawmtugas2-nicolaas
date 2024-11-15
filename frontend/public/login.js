API_BASE_URL = "https://pawmtugas2-nicolaas-backend.vercel.app/";
document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
      return;
    }

    console.log(response)

    const { token, userId } = await response.json();

    // Set token and userId in cookies
    document.cookie = `token=${token}; path=/; Secure; SameSite=Strict`;
    document.cookie = `userId=${userId}; path=/; Secure; SameSite=Strict`;

    alert("Login successful!");
    window.location.href = "./index.html";
  } catch (err) {
    console.error(err);
    alert("An error occurred. Please try again.");
  }
});


