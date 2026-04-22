# Phase 2 — Le Plateau de Jeu

> **Objectif :** Construire le plateau isométrique complet (40 cases), ses métadonnées de gameplay (types de cases, groupes de propriétés, prix), les labels lisibles et le placement initial des pions sur la case Départ.
>
> **Durée estimée :** 4 sprints (~2 semaines)
> **Définition of Done (DoD) globale :** Le plateau 40 cases est affiché correctement en isométrique, chaque case possède une définition de domaine exploitable par la logique de jeu, les labels sont lisibles et les pions (2 à 6 joueurs) apparaissent sur Départ sans collision visuelle majeure.

---

## Sprint 1 — Modélisation du Plateau & Génération 3D
> *Poser les fondations techniques du plateau : types, données, génération géométrique des 40 cases.*

---

### #020 — Définition des Types Métier du Plateau

**Description :** Créer les interfaces TypeScript du plateau pour séparer clairement la donnée de la représentation visuelle.

**Critères d'acceptation :**
- Fichier `src/game/types/board.ts` créé
- Types minimum présents : `TileType`, `TileGroup`, `TileDefinition`, `BoardDefinition`
- `TileDefinition` contient au moins : `index`, `name`, `type`, `price`, `rent`, `group`, `position`
- Les types permettent de représenter les 4 coins et les propriétés standards

**Exemple de structure :**
```typescript
export type TileType =
  | 'go'
  | 'property'
  | 'tax'
  | 'chance'
  | 'community'
  | 'jail'
  | 'free-parking'
  | 'go-to-jail'
  | 'utility'
  | 'railroad';

export interface TileDefinition {
  index: number;
  name: string;
  type: TileType;
  price?: number;
  rent?: number;
  group?: string;
  position: [number, number, number];
}
```

---

### #021 — Génération des 40 Positions (Boucle 11x11)

**Description :** Implémenter une fonction pure qui génère les 40 coordonnées du contour du plateau (coins inclus) avec index stable de 0 à 39.

**Critères d'acceptation :**
- Fichier `src/game/board/generateBoardPath.ts` créé
- La fonction retourne exactement 40 positions
- L'index 0 correspond à la case Départ
- Les positions suivent un parcours complet du plateau sans trou
- Un test unitaire valide le compte total et l'unicité des positions

**API cible :**
```typescript
export function generateBoardPath(size = 11, tileSize = 1.2): [number, number, number][];
```

---

### #022 — Création des Données de Cases (Board Definition)

**Description :** Construire la définition initiale des 40 cases à partir des positions générées : noms, catégories, prix et loyers de base.

**Critères d'acceptation :**
- Fichier `src/game/board/boardDefinition.ts` créé
- Tableau de 40 `TileDefinition` exporté
- Les cases 0, 10, 20, 30 sont respectivement : Départ, Prison/Visite, Parking, Aller en prison
- Les propriétés possèdent un prix initial (> 0)
- Les cases non achetables n'ont pas de prix ou un `price` non défini

---

### #023 — Composant R3F Tile (Case Unitaire)

**Description :** Créer un composant réutilisable pour afficher une case du plateau en cube low-poly avec style conditionnel selon son type.

**Critères d'acceptation :**
- Fichier `src/r3f/objects/Tile.tsx` créé
- Le composant reçoit au moins : `tile`, `isCorner`, `onClick?`
- La hauteur et/ou couleur varie pour distinguer coins et cases standard
- Les ombres sont activées (`castShadow` / `receiveShadow` selon besoin)
- Le composant est purement visuel (pas de logique de règles)

---

### #024 — Composant BoardMesh (Rendu des 40 Cases)

**Description :** Assembler les 40 cases dans un composant unique affiché dans la scène isométrique.

**Critères d'acceptation :**
- Fichier `src/r3f/objects/BoardMesh.tsx` créé
- Les 40 cases sont rendues via mapping sur `boardDefinition`
- Aucun chevauchement visible entre les cases
- Les 4 coins ont un gabarit visuel distinct (taille/couleur)
- `BoardMesh` est intégré dans `GameCanvas`

---

## Sprint 2 — Catégorisation & Direction Artistique des Cases
> *Structurer les familles de cases et rendre le plateau immédiatement lisible visuellement.*

---

### #025 — Système de Groupes de Propriétés

**Description :** Définir les groupes de propriétés (couleurs) pour préparer les règles de possession et de loyers en Phase 3.

**Critères d'acceptation :**
- Fichier `src/game/board/propertyGroups.ts` créé
- Chaque propriété est rattachée à un groupe cohérent
- Un mapping `group -> color` est centralisé et réutilisable côté R3F et UI
- Vérification : toutes les propriétés ont un groupe valide

**Exemple de mapping :**
```typescript
export const PROPERTY_GROUP_COLORS: Record<string, string> = {
  brown: '#8b5a2b',
  lightBlue: '#6ec6ff',
  pink: '#ff6fae',
  orange: '#ff9f43',
  red: '#ff4d4f',
  yellow: '#ffd666',
  green: '#52c41a',
  blue: '#2f54eb',
};
```

---

### #026 — Palette Visuelle des Types de Cases

**Description :** Attribuer une identité visuelle aux types de cases (taxe, chance, prison, etc.) pour faciliter la compréhension du plateau.

**Critères d'acceptation :**
- Fichier `src/r3f/theme/tileTheme.ts` créé
- Couleurs distinctes définies pour chaque `TileType`
- Contraste suffisant entre case et texte des labels
- Les couleurs sont utilisées par `Tile.tsx`
- Aucune couleur codée en dur directement dans `Tile.tsx`

---

### #027 — Marqueur de Propriété (Bandeau de Groupe)

**Description :** Ajouter un bandeau coloré sur les cases propriétés pour afficher leur groupe de manière immédiate.

**Critères d'acceptation :**
- Les cases `type: 'property'` affichent un bandeau de couleur en bord de case
- Le bandeau est orienté correctement selon le côté du plateau
- Le bandeau reste visible en vue isométrique fixe
- Le rendu reste performant (pas de chute de FPS notable)

---

### #028 — Rotation des Cases selon le Côté du Plateau

**Description :** Ajuster orientation et contenu visuel des cases selon leur côté (bas, gauche, haut, droite) pour préparer des labels lisibles.

**Critères d'acceptation :**
- Une logique de `tileSide` (bottom/left/top/right/corner) est implémentée
- Les éléments visuels de case respectent cette orientation
- Les coins gardent une orientation dédiée
- Pas d'inversion gauche/droite sur les côtés verticaux

---

### #029 — Test Visuel Régression Plateau

**Description :** Ajouter un test de non-régression basique sur la structure du plateau (nombre de cases, coins, groupes) pour éviter les régressions pendant les phases suivantes.

**Critères d'acceptation :**
- Fichier `src/__tests__/boardDefinition.test.ts` créé
- Teste que le plateau contient 40 cases
- Teste la présence des 4 coins spéciaux aux index attendus
- Teste qu'au moins une case par groupe de propriété est présente
- `npm run test` passe

---

## Sprint 3 — Labels & Overlay HTML
> *Afficher les informations métier (nom, prix) de manière lisible sans dégrader le rendu 3D.*

---

### #030 — Composant TileLabel en Overlay HTML

**Description :** Créer un composant de label basé sur `Html` (Drei) pour afficher le nom et le prix des cases.

**Critères d'acceptation :**
- Fichier `src/r3f/overlay/TileLabel.tsx` créé
- Le label affiche `name` et `price` (si applicable)
- Les cases non achetables n'affichent pas de prix
- Taille et style adaptés à la lisibilité en vue isométrique

---

### #031 — Rendu Conditionnel des Labels

**Description :** Implémenter une stratégie de rendu pour éviter la surcharge visuelle (affichage complet pour propriétés, affichage simplifié pour coins/spéciales).

**Critères d'acceptation :**
- Les propriétés affichent nom + prix
- Les cases spéciales affichent uniquement le nom
- Les labels ne se chevauchent pas de façon majeure sur la scène par défaut
- Un paramètre `showAllLabels` (booléen) permet d'afficher/masquer tous les labels

---

### #032 — Style CSS des Labels du Plateau

**Description :** Ajouter une couche de styles dédiée pour les labels (lisibilité, contraste, taille responsive).

**Critères d'acceptation :**
- Fichier `src/r3f/overlay/tile-label.css` créé
- Style low-poly cohérent avec la direction artistique globale
- Texte lisible en 1280x800 et en résolution supérieure
- Utilisation de classes dédiées (pas de style inline massif)

---

### #033 — Interaction Hover de Prévisualisation

**Description :** Ajouter un effet hover discret sur case + label (surbrillance) pour préparer les interactions d'achat de la Phase 3.

**Critères d'acceptation :**
- Survol d'une case : léger changement de matériau/couleur
- Le label de la case survolée gagne en priorité visuelle
- Aucun clic métier n'est exécuté (visual only)
- Comportement stable en mode dev et build

---

### #034 — Toggle Debug des Labels dans l'UI Dev

**Description :** Exposer un petit contrôle de debug (dev only) pour activer/désactiver l'affichage des labels et vérifier la lisibilité du plateau.

**Critères d'acceptation :**
- Un toggle est visible uniquement en mode développement
- Le toggle pilote `showAllLabels`
- L'état par défaut en production masque les éléments de debug
- Aucune dépendance supplémentaire requise

---

## Sprint 4 — Pions Joueurs & Validation de Phase
> *Positionner les pions sur Départ, gérer la répartition 2-6 joueurs et valider l'ensemble de la Phase 2.*

---

### #035 — Types Joueur pour Position Plateau

**Description :** Étendre ou ajuster les types joueur pour inclure les informations nécessaires au rendu des pions sur les cases.

**Critères d'acceptation :**
- Type `Player` inclut au minimum : `id`, `name`, `color`, `tileIndex`, `money`
- `tileIndex` initialisé à 0 (Départ)
- Les types sont partagés entre store et rendu R3F
- Pas de duplication de type entre dossiers

---

### #036 — Composant PlayerPawn (Pion Cube)

**Description :** Créer un composant 3D de pion joueur en cube coloré avec petite variation visuelle par joueur.

**Critères d'acceptation :**
- Fichier `src/r3f/objects/PlayerPawn.tsx` créé
- Le pion affiche la couleur du joueur
- Le pion projette une ombre
- Le composant accepte un offset local pour éviter les superpositions

---

### #037 — Positionnement Multi-Joueurs sur une Même Case

**Description :** Implémenter une stratégie d'offset pour afficher jusqu'à 6 pions sur la même case sans recouvrement total.

**Critères d'acceptation :**
- Algorithme d'offset déterministe pour 1 à 6 joueurs
- Aucun pion ne sort visiblement de la case Départ
- L'ordre d'affichage est stable entre re-renders
- Fichier `src/game/board/getPawnOffsets.ts` créé avec tests unitaires

---

### #038 — Intégration des Pions dans BoardMesh

**Description :** Afficher les pions à partir de la liste des joueurs du store sur la position de leur `tileIndex`.

**Critères d'acceptation :**
- Les pions lisent l'état joueur depuis le store Zustand
- Au lancement, tous les joueurs apparaissent sur Départ
- Le rendu supporte de 2 à 6 joueurs configurables
- Aucun crash si la liste de joueurs est vide

---

### #039 — Checklist de Validation Phase 2

**Description :** Vérification finale de la phase avant passage à la logique de jeu (Phase 3).

**Checklist :**

**Plateau 3D**
- [x] Le plateau affiche exactement 40 cases
- [x] Les 4 coins spéciaux sont correctement positionnés
- [x] Les propriétés affichent un groupe couleur identifiable
- [x] Le rendu reste lisible en vue isométrique fixe

**Données Métier**
- [x] Chaque case a un `index` unique de 0 à 39
- [x] Les cases achetables ont un `price` valide
- [x] Les types de cases couvrent tout le plateau sans valeur inconnue
- [x] Les groupes de propriétés sont cohérents et complets

**Labels & UX**
- [x] Les noms de cases sont visibles sans chevauchement majeur
- [x] Les prix sont affichés uniquement pour les cases achetables
- [x] Le hover visuel fonctionne sans glitch
- [x] Le toggle debug labels est actif uniquement en dev

**Pions**
- [x] Les pions 2 à 6 joueurs sont visibles sur Départ
- [x] Les offsets évitent les superpositions bloquantes
- [x] Les couleurs joueurs sont distinctes
- [x] Le rendu des pions n'impacte pas notablement les performances

**Qualité**
- [x] `npm run lint` retourne 0 erreur
- [x] `npm run test` passe (tests board + offsets)
- [x] `npm run dev` lance l'app sans warning critique

---

## Récapitulatif des Issues

| #   | Sprint | Titre                                              | Estimation |
|-----|--------|----------------------------------------------------|------------|
| 020 | 1      | Définition des types métier du plateau             | 0.5j       |
| 021 | 1      | Génération des 40 positions (boucle 11x11)         | 0.5j       |
| 022 | 1      | Création des données de cases                      | 1j         |
| 023 | 1      | Composant R3F Tile                                 | 0.5j       |
| 024 | 1      | Composant BoardMesh                                | 0.5j       |
| 025 | 2      | Système de groupes de propriétés                   | 0.5j       |
| 026 | 2      | Palette visuelle des types de cases                | 0.5j       |
| 027 | 2      | Marqueur de propriété (bandeau de groupe)          | 0.5j       |
| 028 | 2      | Rotation des cases selon le côté du plateau        | 0.5j       |
| 029 | 2      | Test visuel régression plateau                     | 0.5j       |
| 030 | 3      | Composant TileLabel en overlay HTML                | 0.5j       |
| 031 | 3      | Rendu conditionnel des labels                      | 0.5j       |
| 032 | 3      | Style CSS des labels du plateau                    | 0.5j       |
| 033 | 3      | Interaction hover de prévisualisation              | 0.5j       |
| 034 | 3      | Toggle debug des labels dans l'UI dev              | 0.5j       |
| 035 | 4      | Types joueur pour position plateau                 | 0.5j       |
| 036 | 4      | Composant PlayerPawn (pion cube)                   | 0.5j       |
| 037 | 4      | Positionnement multi-joueurs sur une même case     | 1j         |
| 038 | 4      | Intégration des pions dans BoardMesh               | 0.5j       |
| 039 | 4      | Checklist de validation Phase 2                    | 0.5j       |

**Total estimé : ~11 jours développeur**
