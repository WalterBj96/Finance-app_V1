// Ajouter

function addExpense() {
    const name = document.getElementById('expName').value.trim();
    const cat = document.getElementById('expCat').value;
    const amount = parseFloat(document.getElementById('expAmount').value);
    
    if (!name || isNaN(amount) || amount <= 0) return;

    state.expenses.push({id: Date.now(), name, cat, amount})
    save()
    render()
}

// Définir le budget
function setBudget() {
    const val = parseFloat(document.getElementById('budgetInput').value)
    if (isNaN(val) || val <= 0) return  // validation
    state.budget = val
    document.getElementById('budgetInput').value = ''  // vider le champ
    save()
    render()
}

// supprimer une dépense

function deleteExpense(i) {
    state.expenses.splice(i, 1)
    save()
    render()
}

// modifier une dépense

function editExpense(i){
    const name = document.getElementById('eName').value.trim();
    const cat = document.getElementById('eCat').value;
    const amount = parseFloat(document.getElementById('eAmount').value);

    if (!name || isNaN(amount) || amount <= 0) return;

    state.expenses[i] = {...state.expenses[i], name, cat, amount}

    editingId = null
    save()
    render()
}

// bouton reset
function resetMonth() {
    if (!confirm('Réinitialiser toutes les données du mois ?')) return
    state.budget = 0
    state.expenses = []
    save()
    render()
}