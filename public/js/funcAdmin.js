async function registerUser() {
    const username = document.getElementById('newLogin').value
    const password = document.getElementById('newPassword').value
    const role = document.getElementById('newRole').value

    const res = await fetch('/auth/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ username, password, role })
    })

    const data = await res.json()
    document.getElementById('registerMsg').innerText = data.message || data.error
}

async function loadUsers() {
    const res = await fetch('/auth/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    const users = await res.json()

    const tbody = document.getElementById('usersTableBody')
    tbody.innerHTML = ''

    users.forEach((user, index) => {
        const tr = document.createElement('tr')

        const tdIndex = document.createElement('td')
        tdIndex.textContent = index + 1

        const tdID = document.createElement('td')
        tdID.textContent = user._id

        const tdPassword = document.createElement('td')
        tdPassword.textContent = user.password

        const tdLogin = document.createElement('td')
        tdLogin.textContent = user.username

        const tdRoles = document.createElement('td')
        tdRoles.textContent = user.roles.join(', ')

        tr.appendChild(tdIndex)
        tr.appendChild(tdID)
        tr.appendChild(tdPassword)
        tr.appendChild(tdLogin)
        tr.appendChild(tdRoles)

        tbody.appendChild(tr)
    })
}

