
const nameUser = localStorage.getItem("nameUser")
const roleUser = localStorage.getItem("roleUser")

if (!roleUser) {
    window.location.href = "/auth/main";
}
document.getElementById("welcome").innerText =
    "Ласкаво просимо: " + nameUser;

document.getElementById("role").innerText =
    "Ваша посада: " + roleUser;

// выход
function logout() {
    localStorage.removeItem("nameUser");
    localStorage.removeItem("roleUser");
    window.location.href = "/auth/main";
}