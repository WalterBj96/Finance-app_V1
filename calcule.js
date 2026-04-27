// calcule des dépenses totalles

function getTotal() {
    return state.expenses.reduce((sum, e) => sum + e.amount, 0)
}

// regrouper par catégorie

function getByCategory() {
    const cats = {}
    state.expenses.forEach(e => {
        cats[e.cat] = (cats[e.cat] || 0) + e.amount
    })
    return cats
}

// couleur barre de progression

function getCouleur(pct) {
    if (pct < 80) return '#639922'
    if (pct < 100) return '#BA7517'
    return '#A32D2D'
}


