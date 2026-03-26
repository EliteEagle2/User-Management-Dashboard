window.onload = async function () {
    
    const dataElements = {
        userID: document.getElementById("userID"),
        email: document.getElementById("email"),
        password: document.getElementById("password"),
        address: document.getElementById("address"),
        country: document.getElementById("country"),
        state: document.getElementById("state"),
        zip: document.getElementById("zip")
    };
    const response = await fetch("/api/dashboard", { credentials: 'include'});

    const data = await response.json();

    if(!data.success){
        window.location.href = "signup.html";
        return;
    }

    const user = data.user;
    dataElements.userID.textContent = user.userId;
    dataElements.email.textContent = user.email;
    dataElements.password.textContent = user.password;
    dataElements.address.textContent = user.address;
    dataElements.country.textContent = user.country;
    dataElements.state.textContent = user.state;
    dataElements.zip.textContent = user.zip;
};

document.getElementById("logoutBtn").addEventListener("click", async (e) => {

    const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include"
    });

    const result = await response.json();

    if(result.success){
        window.location.href = "login.html";
    }
});