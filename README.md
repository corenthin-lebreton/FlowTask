# Kanban App - Sprint 1.1

Bienvenue sur le projet de tableau Kanban ! Ce projet, construit sans backend traditionnel, redéfinit la gestion de tâches côté client via une architecture moderne, fluide et sécurisée.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :
- **Node.js** (version 18 ou supérieure)
- **npm** (inclus par défaut avec Node.js) ou un autre gestionnaire de paquets comme `yarn` ou `pnpm`

## ⚙️ Installation

1. Clonez le dépôt sur votre machine locale :
   ```bash
   git clone <URL_DU_DEPOT>
   cd <NOM_DU_DOSSIER>
   ```
2. Installez les dépendances du projet :
   ```bash
   npm install
   ```

## 🚀 Environnements et Lancements

Le projet respecte une stricte ségrégation des environnements (`dev`, `preprod`, `prod`).

Cette ségrégation garantit que vos tests de développement n'écrasent jamais vos vraies données Kanban stockées dans votre navigateur. Ceci est réalisé en préfixant la clé de sauvegarde `LocalStorage` selon la variable `import.meta.env.MODE` exposée par Vite (ex: `dev_kanban_data` vs `prod_kanban_data`).

### Commandes de base par environnement :

#### 🔹 Environnement de Développement (dev)
Démarrage du serveur local avec rechargement à chaud (HMR) :
```bash
npm run dev
```

#### 🔸 Environnement de Préproduction (preprod)
Démarrage ou prévisualisation simulant l'environnement preprod pour valider les comportements finaux (mock backend, tests d'intégration, etc.) :
```bash
npm run dev -- --mode preprod
# ou bien pour la prévisualisation du build
npm run build --mode preprod && npm run preview -- --mode preprod
```

#### 🟢 Environnement de Production (prod)
Création d'un build optimisé et minifié, avec typage strict activé, prêt à être déployé :
```bash
npm run build
npm run preview # Pour prévisualiser la production localement
```

## ✨ Nouvelles Fonctionnalités & Mises à Jour

- **(feat) Drag & Drop Fluide** : Réorganisation des tâches et des statuts à la volée avec des animations natives imperceptibles, sans freeze du DOM.
- **(feat) Moteur de Recherche en Temps Réel** : Filtrez instantanément vos tâches par titre ou description via un état dérivé optimisé.
- **(feat) Catégories Dynamiques** : Fini les statuts codés en dur ! Créez autant de colonnes (`Columns`) que vous le désirez.
- **(feat) Gestion des Sous-tâches** : Modale d'édition avancée offrant le suivi en temps réel de votre progression via une barre d'avancement intégrée.
- **(refacto) Correction des conflits de variables sur les propriétés de tâches** : Résolution du "variable shadowing" dans le scope de l'updater `setBoard` pour garantir le typage strict (`TaskPriority`) des mises à jour de state.

## 🛠 Stack Technique

- **Framework** : React 18+
- **Langage** : TypeScript (Typage strict activé)
- **Style** : TailwindCSS
- **Drag & Drop Engine** : `@dnd-kit/core` & `@dnd-kit/sortable` (Haute performance via `React.memo` & `useCallback`).
- **Outil de Build** : Vite

## 💾 Modèle de Données (Zero-Backend)

Afin d'offrir une expérience *offline-first*, l'intégralité de la base de données réside dans le **LocalStorage** du navigateur de l'utilisateur. 

Le format des données a été normalisé en `V1.1` sous un paradigme relationnel pour garantir les performances et la sécurité des itérations :

```json
{
  "columns": [
    {
      "id": "col-123",
      "title": "En Cours",
      "colorClass": "bg-primary",
      "taskIds": ["task-456", "task-789"]
    }
  ],
  "tasks": {
    "task-456": {
      "id": "task-456",
      "columnId": "col-123",
      "title": "Maquetter la page d'accueil",
      "description": "Utiliser Figma pour la v1.",
      "priority": "Haute",
      "subTasks": [
        {
          "id": "sub-1",
          "title": "Design System",
          "isCompleted": true
        }
      ]
    }
  }
}
```
*Note : Un utilitaire strict de Validation d'Intégrité au runtime (`validationUtils.ts`) empêche toute corruption des relations JSON manuelles par un utilisateur.*
