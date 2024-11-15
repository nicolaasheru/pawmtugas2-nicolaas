API_BASE_URL = "https://github.com/nicolaasheru/pawm2-nicolaas/tree/e498a2cdbf04efd40856ee53ff8586abc1900260/backend";
document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        alert(error.message);
        return;
      }
  
      alert("Account created successfully! Please login.");
      window.location.href = "./login.html";
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  });