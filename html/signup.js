document.getElementById("submitForm").addEventListener("submit", async (e) =>{
  e.preventDefault();
    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        address: document.getElementById("address").value,
        country: document.getElementById("country").value,
        state: document.getElementById("state").value,
        zip: document.getElementById("zip").value
    }
    for(let value of Object.values(data)){
        if(value === null || value === undefined || value === ""){
          document.getElementById("errorText").textContent = "Invalid Input";
          document.getElementById("errorModal").showModal();
            return;
        }
    }

    if(!isValidPassword(data["password"])){
        document.getElementById("errorText").textContent = "Invalid Password";
        document.getElementById("errorModal").showModal();
        return;
    }
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      console.log("Request URL:", "/api/signup");
      console.log("Status:", response.status);
      console.log("Content-Type:", response.headers.get("content-type"));

      const text = await response.text();
      console.log("RAW:", text);

      if (!response.ok) {
        console.log("Request failed with status " + response.status + "\n" + text);
        return;
      }
      const result = JSON.parse(text);

      if (result.success) {
        document.getElementById("successText").textContent = "Sign Up Successful";
        document.getElementById("successModal").showModal();
        
        document.getElementById("submitForm").reset();
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
        
      } else {
        document.getElementById("errorText").textContent = result.message;
        document.getElementById("errorModal").showModal();
      }
    } catch (err) {
      console.log(err);
    }
})

function isValidPassword(password) {
  if (password.length < 8) {
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  if (!/[a-z]/.test(password)) {
    return false;
  }

  if (!/[0-9]/.test(password)) {
    return false;
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return false;
  }

  return true;
}