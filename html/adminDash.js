window.onload = async function () {
    const response = await fetch("/api/users");

    const data = await response.json();

    if(!data.success){
        document.getElementById("errorText").textContent = data.message || "Failed to load users";
        document.getElementById("errorModal").showModal();
        return;
    }

    const userBody = document.getElementById("usersBody");
    data.users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td>${user.address}</td>
            <td>${user.country}</td>
            <td>${user.state}</td>
            <td>${user.zip}</td>
        `;
        userBody.appendChild(row);
    });
}