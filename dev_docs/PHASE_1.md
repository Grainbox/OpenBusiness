# Phase 1 — Fondations du Projet

> **Objectif :** Poser une base de projet saine, typée, testable et buildable, avec une scène isométrique 3D vide validée, le tout packagé en application desktop `.exe`.
>
> **Durée estimée :** 4 sprints (~2 semaines)
> **Définition of Done (DoD) globale :** L'application se lance en mode dev ET en `.exe`, affiche une scène isométrique orthographique avec un cube de test éclairé, et le projet respecte les conventions de code configurées.

---

## Sprint 1 — Bootstrap & Structure du Projet
> *Mise en place du dépôt, de la stack de base et des outils de qualité de code.*

---

### #001 — Initialisation du dépôt Git

**Description :** Créer le dépôt Git local avec un `.gitignore` adapté à un projet Node.js / Electron / Vite.

**Critères d'acceptation :**
- `git init` effectué à la racine
- `.gitignore` couvre : `node_modules/`, `dist/`, `dist-electron/`, `.env`, `*.log`, `.DS_Store`, `out/`
- Premier commit `chore: init repository` présent

**Commandes clés :**
```bash
git init
# Ajouter .gitignore depuis gitignore.io : Node, Electron, React
git add .gitignore
git commit -m "chore: init repository"
```

---

### #002 — Initialisation Vite + React + TypeScript

**Description :** Scaffolder le projet avec Vite en template `react-ts`. TypeScript est obligatoire pour la maintenabilité du projet.

**Critères d'acceptation :**
- `npm create vite@latest` avec template `react-ts`
- `npm run dev` lance le serveur de développement sans erreur
- TypeScript strict mode activé dans `tsconfig.json` (`"strict": true`)
- `tsconfig.node.json` présent pour la config Vite

**Configuration `tsconfig.json` :**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

### #003 — Configuration ESLint + Prettier

**Description :** Configurer ESLint (analyse statique) et Prettier (formatage) pour uniformiser le code dès le début.

**Critères d'acceptation :**
- `eslint.config.js` configuré avec les plugins `react`, `react-hooks`, `@typescript-eslint`
- `.prettierrc` présent avec les règles du projet (singleQuote, semi, tabWidth: 2)
- `npm run lint` et `npm run format` fonctionnels
- Aucune erreur ESLint sur le code scaffoldé par Vite

**`.prettierrc` :**
```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**`package.json` scripts :**
```json
"lint": "eslint . --ext .ts,.tsx",
"format": "prettier --write \"src/**/*.{ts,tsx,css}\""
```

---

### #004 — Configuration Tailwind CSS

**Description :** Intégrer Tailwind CSS v3 pour styler l'UI (menus, modales, HUD) rapidement sans CSS custom.

**Critères d'acceptation :**
- `tailwind.config.js` généré, `content` pointe vers `./src/**/*.{ts,tsx}`
- `@tailwind base/components/utilities` dans `src/index.css`
- Un composant de test (ex: `<div className="bg-slate-900 text-white p-4">Test</div>`) s'affiche correctement
- Suppression du CSS de démo généré par Vite (`App.css`, styles par défaut)

---

### #005 — Définition de l'Architecture des Dossiers

**Description :** Poser la structure de dossiers finale du projet avant d'écrire du code métier. Évite de restructurer plus tard.

**Critères d'acceptation :**
- Dossiers créés et documentés dans un commentaire de `README.md`
- Chaque dossier contient un fichier `.gitkeep` si vide

**Structure cible :**
```
src/
├── assets/          # Icônes, images statiques
├── components/      # Composants React UI (menus, modales, HUD)
├── game/            # Logique de jeu pure (règles, état, types)
│   ├── store/       # Stores Zustand
│   └── types/       # Interfaces TypeScript du domaine
├── r3f/             # Tout ce qui concerne la scène Three.js / R3F
│   ├── camera/
│   ├── lights/
│   └── objects/
├── electron/        # Code du processus principal Electron
│   ├── main.ts
│   └── preload.ts
└── App.tsx
```

---

## Sprint 2 — Intégration Electron
> *Transformer l'app web Vite en application desktop via Electron avec une architecture sécurisée.*

---

### #006 — Installation et Configuration d'Electron

**Description :** Ajouter Electron au projet et configurer la coexistence avec Vite (le renderer Electron est l'app Vite).

**Critères d'acceptation :**
- `electron` et `electron-builder` installés en devDependencies
- `vite-plugin-electron` installé pour l'intégration Vite ↔ Electron
- `vite.config.ts` modifié pour inclure le plugin Electron
- L'app se lance avec `npm run dev` et ouvre une fenêtre Electron (pas un navigateur)

**Packages :**
```bash
npm install --save-dev electron electron-builder vite-plugin-electron vite-plugin-electron-renderer
```

---

### #007 — Création du Processus Principal (`main.ts`)

**Description :** Écrire le point d'entrée Electron (`electron/main.ts`) qui crée la fenêtre applicative avec les bonnes options de sécurité.

**Critères d'acceptation :**
- Fenêtre créée avec `webPreferences: { contextIsolation: true, nodeIntegration: false }`
- Taille initiale : 1280×800, `minWidth: 1024`, `minHeight: 600`
- En mode dev : charge `http://localhost:5173` ; en prod : charge `index.html` buildé
- `autoHideMenuBar: true` (pas de barre de menu native)
- La fenêtre se ferme proprement (`app.on('window-all-closed')` géré)

---

### #008 — Configuration du Script Preload (`preload.ts`)

**Description :** Créer le script preload qui expose via `contextBridge` uniquement les APIs nécessaires au renderer. Aucun accès Node direct depuis le renderer.

**Critères d'acceptation :**
- `electron/preload.ts` utilise `contextBridge.exposeInMainWorld`
- Seul un namespace `window.electronAPI` est exposé (vide pour l'instant, extensible)
- Le type de `window.electronAPI` est déclaré dans `src/electron.d.ts`
- Aucun accès à `require` ou modules Node depuis `src/`

**`src/electron.d.ts` :**
```typescript
interface ElectronAPI {
  // À enrichir dans les phases suivantes (ex: système de fichiers, IPC)
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
```

---

### #009 — Scripts NPM de Développement et Validation

**Description :** Mettre en place les scripts npm qui couvrent tous les modes de lancement.

**Critères d'acceptation :**
- `npm run dev` : lance Vite + Electron en mode développement avec HMR
- `npm run build` : build Vite puis compile Electron
- `npm run preview` : prévisualise le build sans packager
- Les DevTools Electron sont ouverts automatiquement en mode dev uniquement
- Une variable `import.meta.env.DEV` permet de différencier dev/prod dans le renderer

**`package.json` scripts :**
```json
"dev": "vite",
"build": "tsc && vite build",
"lint": "eslint . --ext .ts,.tsx",
"format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
"test": "vitest run",
"package": "npm run build && electron-builder"
```

---

## Sprint 3 — Scène Isométrique 3D
> *Intégrer React Three Fiber et valider le rendu isométrique avec caméra orthographique.*

---

### #010 — Installation React Three Fiber + Drei + Three.js

**Description :** Ajouter les dépendances 3D du projet et valider leur compatibilité avec l'environnement Electron/Vite.

**Critères d'acceptation :**
- `@react-three/fiber`, `@react-three/drei`, `three` installés
- Types TypeScript `@types/three` présents
- Import de base `import { Canvas } from '@react-three/fiber'` sans erreur TypeScript
- Aucun conflit de version entre React et R3F

**Packages :**
```bash
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

---

### #011 — Création du Composant `<GameCanvas />`

**Description :** Créer le composant racine de la scène 3D qui encapsule le `<Canvas>` R3F. Ce composant est le point d'entrée unique de tout le rendu 3D.

**Critères d'acceptation :**
- Fichier `src/r3f/GameCanvas.tsx` créé
- `<Canvas>` occupe 100% de la zone de jeu (CSS `width: 100%, height: 100%`)
- `shadows` activé sur le Canvas pour préparer l'éclairage
- `frameloop="demand"` configuré (rendu à la demande, pas en boucle infinie — économie CPU)
- Le composant est intégré dans `App.tsx` et s'affiche sans erreur

---

### #012 — Caméra Isométrique Orthographique

**Description :** Configurer la caméra orthographique à 45° pour obtenir la vue isométrique caractéristique du jeu. C'est la pièce centrale du rendu visuel.

**Critères d'acceptation :**
- Utilisation de `<OrthographicCamera>` de Drei (pas de perspective)
- Position de la caméra : angle isométrique standard (`position={[10, 10, 10]}`, `rotation` calculée)
- `makeDefault` activé sur cette caméra
- Le zoom est ajusté pour qu'un cube 1x1x1 soit visible et bien cadré
- La caméra ne bouge pas (fixe — pas de controls en Phase 1)
- Validation visuelle : un cube centré en `[0,0,0]` est visible sans déformation de perspective

**Paramètres de référence :**
```tsx
<OrthographicCamera
  makeDefault
  position={[10, 10, 10]}
  zoom={50}
  near={0.1}
  far={1000}
/>
```

---

### #013 — Éclairage de Base

**Description :** Ajouter un éclairage cohérent avec la vue isométrique : lumière ambiante + lumière directionnelle simulant un soleil venant de l'avant-gauche.

**Critères d'acceptation :**
- `<ambientLight intensity={0.4} />` pour éclairer les zones d'ombre
- `<directionalLight position={[5, 10, 5]} intensity={1} castShadow />` pour les ombres portées
- Les ombres sont visibles sur le sol (un `<mesh receiveShadow>` de test)
- Fichier `src/r3f/lights/SceneLights.tsx` créé et importé dans `GameCanvas`

---

### #014 — Cube de Validation Isométrique

**Description :** Placer un cube de test au centre de la scène pour valider visuellement que la caméra, l'éclairage et le rendu fonctionnent correctement ensemble.

**Critères d'acceptation :**
- `<mesh position={[0, 0.5, 0]} castShadow>` avec `<boxGeometry args={[1, 1, 1]} />`
- Matériau `<meshStandardMaterial color="#4f46e5" />` (violet)
- Plan de sol `<mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>` avec matériau gris
- Le cube projette une ombre sur le sol
- Fichier `src/r3f/objects/TestCube.tsx` — **à supprimer en Phase 2**

---

### #015 — Gestion du Redimensionnement de la Fenêtre

**Description :** S'assurer que le Canvas 3D se redimensionne correctement quand la fenêtre Electron est redimensionnée.

**Critères d'acceptation :**
- Le Canvas remplit toujours sa zone parente lors d'un resize
- Pas de barre de scroll apparente
- La caméra orthographique recalcule son `frustum` correctement (R3F gère cela nativement — valider que c'est le cas)
- Test : redimensionner la fenêtre Electron manuellement, le rendu reste propre

---

## Sprint 4 — Build, Tests & Validation Finale
> *Configurer le packaging `.exe`, mettre en place les tests et valider la Phase 1 dans son ensemble.*

---

### #016 — Configuration Electron Builder

**Description :** Configurer `electron-builder` pour packager l'application en installateur `.exe` Windows autonome.

**Critères d'acceptation :**
- Section `"build"` dans `package.json` (ou `electron-builder.yml`) configurée
- `appId`, `productName: "Open-Business"`, icône placeholder présents
- Target : `nsis` (installateur Windows) ET `portable` (`.exe` standalone)
- Le build produit un fichier dans `dist/` ou `release/` sans erreur
- L'`.exe` produit se lance et affiche la scène 3D

**Config `package.json` :**
```json
"build": {
  "appId": "com.openbusiness.app",
  "productName": "Open-Business",
  "directories": { "output": "release" },
  "win": {
    "target": ["nsis", "portable"],
    "icon": "src/assets/icon.ico"
  },
  "files": ["dist/**/*", "dist-electron/**/*"]
}
```

---

### #017 — Mise en Place de Vitest

**Description :** Configurer Vitest pour les tests unitaires. La Phase 1 ne teste pas la logique jeu (pas encore écrite), mais le setup doit être prêt.

**Critères d'acceptation :**
- `vitest` et `@testing-library/react` installés
- `vitest.config.ts` configuré avec `environment: 'jsdom'`
- `npm run test` s'exécute sans erreur (0 tests = succès)
- Un test trivial de smoke (`expect(1 + 1).toBe(2)`) dans `src/__tests__/smoke.test.ts` passe

---

### #018 — Test Unitaire : Store Zustand Initial

**Description :** Installer Zustand et écrire un premier store squelette représentant l'état global du jeu, avec un test unitaire validant sa structure. Pose les bases pour la Phase 3.

**Critères d'acceptation :**
- `zustand` installé
- `src/game/store/gameStore.ts` créé avec un état initial minimal :
  ```typescript
  interface GameState {
    phase: 'menu' | 'lobby' | 'playing' | 'ended';
    players: Player[];
    currentPlayerIndex: number;
  }
  ```
- `src/__tests__/gameStore.test.ts` teste :
  - L'état initial a `phase: 'menu'`
  - L'état initial a `players: []`
- `npm run test` passe avec ces 2 tests

---

### #019 — Checklist de Validation Phase 1

**Description :** Vérification finale que tous les critères de la Phase 1 sont atteints avant de passer à la Phase 2.

**Checklist :**

**Infrastructure**
- [ ] `npm run dev` lance Electron + Vite sans erreur ni warning critique
- [ ] `npm run lint` retourne 0 erreur
- [ ] `npm run format` n'introduit pas de diff sur le code existant
- [ ] `npm run test` passe tous les tests (au moins les 2 du store)

**Rendu 3D**
- [ ] La caméra est orthographique (aucun effet de perspective visible)
- [ ] L'angle isométrique à 45° est correct (les 3 faces du cube de test sont visibles)
- [ ] Les ombres sont visibles sur le sol
- [ ] Le redimensionnement de la fenêtre ne casse pas le rendu

**Electron & Build**
- [ ] `npm run package` produit un `.exe` dans `release/`
- [ ] L'`.exe` se lance sur une machine Windows sans installer Node.js
- [ ] `contextIsolation: true` et `nodeIntegration: false` vérifiés dans les DevTools

**Structure**
- [ ] L'architecture des dossiers correspond à la cible définie en #005
- [ ] Aucun fichier de démo Vite résiduel (`App.css`, logo Vite/React) dans le projet
- [ ] Le `README.md` du projet indique comment lancer le projet en dev et builder le `.exe`

---

## Récapitulatif des Issues

| #   | Sprint | Titre                                        | Estimation |
|-----|--------|----------------------------------------------|------------|
| 001 | 1      | Initialisation du dépôt Git                  | 0.5j       |
| 002 | 1      | Initialisation Vite + React + TypeScript     | 0.5j       |
| 003 | 1      | Configuration ESLint + Prettier              | 0.5j       |
| 004 | 1      | Configuration Tailwind CSS                   | 0.5j       |
| 005 | 1      | Définition de l'architecture des dossiers    | 0.5j       |
| 006 | 2      | Installation et configuration Electron       | 1j         |
| 007 | 2      | Création du processus principal (`main.ts`)  | 0.5j       |
| 008 | 2      | Configuration du script Preload              | 0.5j       |
| 009 | 2      | Scripts NPM de développement et validation   | 0.5j       |
| 010 | 3      | Installation R3F + Drei + Three.js           | 0.5j       |
| 011 | 3      | Création du composant `<GameCanvas />`        | 0.5j       |
| 012 | 3      | Caméra isométrique orthographique            | 1j         |
| 013 | 3      | Éclairage de base                            | 0.5j       |
| 014 | 3      | Cube de validation isométrique               | 0.5j       |
| 015 | 3      | Gestion du redimensionnement de la fenêtre   | 0.5j       |
| 016 | 4      | Configuration Electron Builder               | 1j         |
| 017 | 4      | Mise en place de Vitest                      | 0.5j       |
| 018 | 4      | Test unitaire : Store Zustand initial        | 0.5j       |
| 019 | 4      | Checklist de validation Phase 1              | 0.5j       |

**Total estimé : ~10 jours développeur**
