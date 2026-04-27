// Ce fichier documente la structure des données
// La vraie déclaration de "state" est dans localStorage.js

// Structure d'une dépense :
// {
//     id      : Date.now(),   // identifiant unique
//     name    : "Loyer",      // nom de la dépense
//     cat     : "Logement",   // catégorie
//     amount  : 500           // montant en €
// }

// Structure du state complet :
// {
//     budget   : 0,           // budget mensuel
//     expenses : []           // liste des dépenses
// }