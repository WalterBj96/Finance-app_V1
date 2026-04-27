const now = new Date()
const monthKey = `finance_${now.getFullYear()}_${now.getMonth()}`

// Sauvegarde

function save() {
    localStorage.setItem(monthKey, JSON.stringify(state))
}

// charger au demarrage``

let state = JSON.parse(localStorage.getItem(monthKey) || 'null') || {budget: 0, expenses: []}