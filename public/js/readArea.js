const fileList = document.getElementById("fileList")
const fileContent = document.getElementById("fileContent")

// пример загрузки списка файлов
async function loadFiles() {
    const res = await fetch('/auth/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ target: localStorage.getItem("roleUser") })
    })
    const files = await res.json()

    fileList.innerHTML = ''

    files.forEach(file => {
        const li = document.createElement('li')
        li.textContent = file

        li.onclick = async () => {
            const sew = await fetch(`/auth/files/${file}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ target: localStorage.getItem("roleUser") })
            })
            const text = await sew.text()
            fileContent.textContent = text
        }

        fileList.appendChild(li)
    })
}

// сохранить текст
async function saveText() {
    const text = document.getElementById("textInput").value
    let nameNewFile = document.getElementById("nameNewFile").value
    let roles = "!"
    const kod = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"]

    for (let i = 0; i < kod.length; i++) {
        if (document.getElementById(`sec${i + 1}`).checked) {
            roles += kod[i]
        }
        else {
            roles += '!'
        }
    }

    const answer = await fetch('/auth/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, nameNewFile, roles })
    })

    alert("Сохранено")
}

loadFiles()