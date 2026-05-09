document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            document.getElementById("error").innerText = data.message;
            return;
        }

        // сохраняем токен
        localStorage.setItem("token", data.token);
        localStorage.setItem("nameUser", username);
        localStorage.setItem("roleUser", JSON.parse(atob(data.token.split('.')[1])).roles[0]);

        let user_role = JSON.parse(atob(data.token.split('.')[1])).roles

        if (user_role.includes("ADMIN")) {
            window.location.href = "dashboardAdmin";
        }
        else {
            window.location.href = "dashboard";
        }

    } catch (e) {
        document.getElementById("error").innerText = "Ошибка подключения";
    }
});