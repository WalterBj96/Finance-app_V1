// Couleurs par catégorie
const CAT_COLORS = {
    'Logement'  : '#378ADD',
    'Nourriture': '#639922',
    'Transport' : '#BA7517',
    'Santé'     : '#1D9E75',
    'Loisirs'   : '#D4537E',
    'Vêtements' : '#7F77DD',
    'Autres'    : '#888780'
}

const CATS = ['Logement','Nourriture','Transport','Santé','Loisirs','Vêtements','Autres']

let chart = null
let editingId = null

function render() {
    const total = getTotal()
    const pct = state.budget > 0 ? (total / state.budget) * 100 : 0

    // -- Barre de progression --
    document.getElementById('budgetBar').style.width = Math.min(pct, 100) + '%'
    document.getElementById('budgetBar').style.background = getCouleur(pct)

    // -- Labels sous la barre --
    document.getElementById('barLeft').textContent = total + '€ dépensé'
    document.getElementById('barRight').textContent = 'Budget: ' + state.budget + '€ (' + pct.toFixed(0) + '%)'

    // -- Les 3 métriques --
    document.getElementById('mBudget').textContent = state.budget + ' €'
    document.getElementById('mSpent').textContent = total + ' €'
    document.getElementById('mLeft').textContent = (state.budget - total) + ' €'

    // -- Camembert --
    const cats = getByCategory()
    const labels = Object.keys(cats)
    const values = Object.values(cats)
    const colors = labels.map(l => CAT_COLORS[l] || '#888780')

    if (chart) chart.destroy()

    if (labels.length > 0) {
        chart = new Chart(document.getElementById('pieChart'), {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: 'transparent'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => ' ' + ctx.label + ': ' + ctx.raw + '€'
                        }
                    }
                },
                cutout: '55%'
            }
        })

        // -- Légende --
        document.getElementById('legend').innerHTML = labels.map((l, i) => {
            const p = total > 0 ? ((values[i] / total) * 100).toFixed(0) : 0
            return `<div class="legend-item">
                <span class="legend-dot" style="background:${colors[i]}"></span>
                ${l}
                <span class="legend-pct">${p}%</span>
            </div>`
        }).join('')

    } else {
        document.getElementById('legend').innerHTML = '<p class="empty">Aucune catégorie</p>'
    }

    // -- Liste des dépenses --
    const listEl = document.getElementById('expenseList')

    if (state.expenses.length === 0) {
        listEl.innerHTML = '<p class="empty">Aucune dépense ajoutée</p>'
        return
    }

    listEl.innerHTML = state.expenses.slice().reverse().map((e, ri) => {
        const i = state.expenses.length - 1 - ri
        const isEditing = editingId === e.id
        const catOptions = CATS.map(c =>
            `<option${c === e.cat ? ' selected' : ''}>${c}</option>`
        ).join('')

        return `<div class="expense-item">
            <div class="expense-row">
                <div>
                    <div style="font-size:13px;">${e.name}</div>
                    <div class="expense-cat">${e.cat}</div>
                </div>
                <div style="display:flex;align-items:center;gap:4px;">
                    <span style="font-size:13px;font-weight:500;margin-right:4px;">${e.amount} €</span>
                    <button class="btn-icon btn-edit" onclick="startEdit(${e.id})">✎</button>
                    <button class="btn-icon btn-del" onclick="deleteExpense(${i})">×</button>
                </div>
            </div>
            ${isEditing ? `
            <div class="edit-form">
                <div class="form-group">
                    <label style="font-size:11px;">Nom</label>
                    <input id="eName" value="${e.name}" />
                </div>
                <div class="form-group">
                    <label style="font-size:11px;">Catégorie</label>
                    <select id="eCat">${catOptions}</select>
                </div>
                <div class="form-group">
                    <label style="font-size:11px;">Montant (€)</label>
                    <input type="number" id="eAmount" value="${e.amount}" />
                </div>
                <button class="btn-save" onclick="editExpense(${i})">Sauver</button>
                <button class="btn-cancel" onclick="cancelEdit()">Annuler</button>
            </div>` : ''}
        </div>`
    }).join('')
}

function startEdit(id) {
    editingId = (editingId === id) ? null : id
    render()
}

function cancelEdit() {
    editingId = null
    render()
}