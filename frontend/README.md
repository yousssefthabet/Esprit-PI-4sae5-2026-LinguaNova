# LinguaNova — Frontend Angular

Interface web de la plateforme **LinguaNova**, dédiée à l'apprentissage de l'anglais et conçue pour être **accessible** (lecteurs d'écran, navigation au clavier, contraste, liens d'évitement).

## Prérequis

- Node.js 18+
- Backend Spring Boot démarré sur **http://localhost:8086**

## Installation

```bash
npm install
```

## Lancer l'application

```bash
npm start
```

Ouvrir [http://localhost:4200](http://localhost:4200).

## Build production

```bash
npm run build
```

Les fichiers sont générés dans `dist/linguanova-app/`.

## Structure

- **Modèles** : `src/app/models/` — entités (Exam, Question, Reponse, StudentProfile, StudentExam, StudentAnswer)
- **Services** : `src/app/services/` — appels API vers le backend Spring
- **Layout** : `src/app/layout/` — en-tête, navigation, lien d'évitement, pied de page
- **Pages** : `src/app/pages/` — Accueil, Liste des examens, Passer un examen, Mon profil, Mes résultats

## Accessibilité

- Lien « Aller au contenu principal » au focus clavier
- Balises sémantiques et ARIA (rôles, labels, live regions)
- Navigation au clavier et focus visible
- Contraste et `prefers-reduced-motion` pris en compte

## Configuration API

L’URL du backend est définie dans `src/environments/environment.ts` (dev : `http://localhost:8086/api`).
