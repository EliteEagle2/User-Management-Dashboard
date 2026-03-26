document.getElementById("submitForm").addEventListener("submit", async (e) =>{
  e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(email == "admin" && password == "abc123"){
        document.getElementById("submitForm").reset();
        window.location.href = "adminDash.html";
        return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({email, password})
      });

      const result = await response.json();

      if (result.success) {
        document.getElementById("successText").textContent = "Login Successful";
        document.getElementById("successModal").showModal();
        document.getElementById("submitForm").reset();
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 2000);
      } else {
        document.getElementById("errorText").textContent = result.message;
        document.getElementById("errorModal").showModal();
      }
    } catch (err) {
      document.getElementById("errorText").textContent = err;
        document.getElementById("errorModal").showModal();
      console.log(err);
    }
})
