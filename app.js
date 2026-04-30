// ============================================================
// app.js — Actions utilisateur + tracking PostHog
// ============================================================

// ------------------------------------------------------------
// AJOUTER UNE DÉPENSE
// ------------------------------------------------------------
function addExpense() {
    // Récupère les valeurs des champs du formulaire
    const name = document.getElementById('expName').value.trim();
    const cat = document.getElementById('expCat').value;
    const amount = parseFloat(document.getElementById('expAmount').value);
    
    // Validation : on arrête si le nom est vide ou le montant invalide
    if (!name || isNaN(amount) || amount <= 0) return;

    // Ajoute la dépense dans le state avec un id unique basé sur le timestamp
    state.expenses.push({ id: Date.now(), name, cat, amount })
    save()    // sauvegarde dans localStorage
    render()  // met à jour l'affichage

    // Envoie l'event à PostHog avec la catégorie et le montant
    // → permet de savoir quelles catégories sont les plus utilisées
    posthog.capture('expense_added', { category: cat, amount: amount })
}

// ------------------------------------------------------------
// DÉFINIR LE BUDGET
// ------------------------------------------------------------
function setBudget() {
    const val = parseFloat(document.getElementById('budgetInput').value)

    // Validation : on arrête si la valeur est invalide ou négative
    if (isNaN(val) || val <= 0) return

    state.budget = val
    document.getElementById('budgetInput').value = '' // vide le champ après validation
    save()
    render()

    // Envoie l'event à PostHog avec le montant du budget défini
    // → permet de voir combien de users complètent cette étape clé
    posthog.capture('budget_set', { amount: val })
}

// ------------------------------------------------------------
// SUPPRIMER UNE DÉPENSE
// ------------------------------------------------------------
function deleteExpense(i) {
    // Supprime la dépense à l'index i dans le tableau
    state.expenses.splice(i, 1)
    save()
    render()

    // Envoie l'event à PostHog
    // → permet de savoir si les users corrigent beaucoup leurs saisies
    posthog.capture('expense_deleted')
}

// ------------------------------------------------------------
// MODIFIER UNE DÉPENSE
// ------------------------------------------------------------
function editExpense(i) {
    // Récupère les nouvelles valeurs depuis le formulaire d'édition inline
    const name = document.getElementById('eName').value.trim();
    const cat = document.getElementById('eCat').value;
    const amount = parseFloat(document.getElementById('eAmount').value);

    // Validation : on arrête si les données sont invalides
    if (!name || isNaN(amount) || amount <= 0) return;

    // Remplace la dépense existante en conservant son id (spread + override)
    state.expenses[i] = { ...state.expenses[i], name, cat, amount }

    editingId = null // ferme le formulaire d'édition
    save()
    render()

    // Envoie l'event à PostHog avec la nouvelle catégorie et le nouveau montant
    // → permet de voir si les users modifient souvent leurs dépenses
    posthog.capture('expense_edited', { category: cat, amount: amount })
}

// ------------------------------------------------------------
// RÉINITIALISER LE MOIS
// ------------------------------------------------------------
function resetMonth() {
    // Demande confirmation avant de tout effacer
    if (!confirm('Réinitialiser toutes les données du mois ?')) return

    state.budget = 0
    state.expenses = []
    save()
    render()

    // Envoie l'event à PostHog
    // → permet de savoir si des users recommencent souvent de zéro
    posthog.capture('month_reset')
}