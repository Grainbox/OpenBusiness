# Phase 3 — Logique de Jeu Core

> **Objectif :** Implémenter toutes les règles fondamentales du jeu : store d'état centralisé, lancer de dés, déplacement des pions, gestion des propriétés, transactions financières et conditions de fin de partie.
>
> **Durée estimée :** 4 sprints (~2 semaines)
> **Définition of Done (DoD) globale :** Une partie complète peut se dérouler du début à la fin en local : les joueurs lancent les dés chacun leur tour, se déplacent sur le plateau, achètent ou paient des loyers, et le dernier joueur solvable remporte la partie.

---

## Sprint 1 — Store Zustand & Boucle de Tour
> *Poser le système nerveux du jeu : état global partagé, machine d'état du tour, ordre des joueurs.*

---

### #040 — Architecture du Store Zustand de Jeu

**Description :** Créer le store Zustand central qui sera la source de vérité unique pour toute la logique de jeu.

**Critères d'acceptation :**
- Fichier `src/game/store/gameStore.ts` créé
- Le store expose au minimum : `players`, `currentPlayerIndex`, `phase`, `dice`, `properties`, `turnCount`
- Aucune donnée de jeu n'est maintenue en state React local hors du store
- Le store est importable depuis les composants R3F et les composants UI sans couplage circulaire
- Les actions sont des fonctions nommées de manière explicite (`rollDice`, `movePawn`, `buyProperty`, etc.)

**Structure cible :**
```typescript
interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  phase: TurnPhase;
  dice: [number, number] | null;
  properties: Record<number, PropertyState>;
  turnCount: number;
}

type TurnPhase =
  | 'idle'
  | 'rolling'
  | 'moving'
  | 'acting'
  | 'end-turn';
```

---

### #041 — État Initial de Partie

**Description :** Implémenter l'action `initGame` qui initialise une partie avec 2 à 6 joueurs, distribuant le capital de départ et plaçant tout le monde sur Départ.

**Critères d'acceptation :**
- Action `initGame(playerNames: string[])` disponible dans le store
- Chaque joueur reçoit 1500 € de capital de départ (convention Monopoly standard)
- `tileIndex` de chaque joueur initialisé à `0` (Départ)
- `properties` initialisé : aucune propriété achetée
- `currentPlayerIndex` initialisé à `0`
- `phase` initialisé à `'idle'`
- Un test unitaire valide l'état initial pour 2, 4 et 6 joueurs

---

### #042 — Machine d'État du Tour (Turn State Machine)

**Description :** Implémenter la progression des phases d'un tour dans le store pour garantir un déroulement cohérent et sans état incohérent.

**Critères d'acceptation :**
- Fichier `src/game/store/turnMachine.ts` créé avec les transitions valides
- Transitions autorisées uniquement : `idle → rolling → moving → acting → end-turn → idle`
- Une action invalide (ex. lancer les dés en phase `moving`) est silencieusement ignorée ou log un warning en dev
- La phase courante est exposée en lecture depuis tout composant via le store
- Test unitaire couvrant les transitions valides et les tentatives de transition invalide

**Transitions :**
```
idle       → rolling    : joueur clique "Lancer les dés"
rolling    → moving     : résultat des dés calculé
moving     → acting     : pion arrivé sur la case de destination
acting     → end-turn   : action résolue (achat, loyer, ou case spéciale)
end-turn   → idle       : passage au joueur suivant
```

---

### #043 — Passage au Joueur Suivant

**Description :** Implémenter l'action `endTurn` qui incrémente `currentPlayerIndex` (modulo nombre de joueurs) et réinitialise les variables de tour.

**Critères d'acceptation :**
- Action `endTurn()` disponible dans le store
- `currentPlayerIndex` passe au joueur suivant de manière circulaire (ex. joueur 3 → joueur 0 si 4 joueurs)
- `dice` remis à `null` après le tour
- `phase` remis à `'idle'`
- Les joueurs en banqueroute sont automatiquement sautés dans l'ordre de passage
- `turnCount` incrémenté à chaque tour complet (retour au joueur 0)

---

## Sprint 2 — Dés & Déplacement des Pions
> *Implémenter le cœur de la mécanique de jeu : lancer de dés, déplacement animé case par case, passage sur Départ.*

---

### #044 — Logique de Lancer de Dés

**Description :** Implémenter la fonction de lancer de deux dés avec gestion des doubles (rejouer le tour).

**Critères d'acceptation :**
- Fichier `src/game/logic/dice.ts` créé
- Fonction `rollDice(): [number, number]` retourne deux valeurs entre 1 et 6
- Action `rollDice()` dans le store met à jour `dice` et passe la phase en `moving`
- Si les deux dés sont identiques (double) : le joueur rejouera après son action (flag `hasDouble` dans le store)
- Trois doubles consécutifs → le joueur va directement en prison
- Tests unitaires de la répartition aléatoire (distribution sur 1000 tirages)

---

### #045 — Composant UI Dés

**Description :** Créer un composant visuel pour afficher le résultat du lancer de dés avec une animation simple de "vibration" avant affichage du résultat.

**Critères d'acceptation :**
- Fichier `src/ui/components/DiceDisplay.tsx` créé
- Les deux valeurs de dés sont affichées après le lancer
- Animation CSS de 600ms simulant le roulement avant le résultat final
- Le composant est désactivé (grisé) si `phase !== 'idle'` ou si ce n'est pas le tour du joueur local
- Affichage du label "Double !" si les deux dés sont identiques

**Check visuel demandé :** Lancer les dés depuis l'UI et confirmer que l'animation et le résultat s'affichent correctement.

---

### #046 — Déplacement Case par Case avec Délai

**Description :** Implémenter la logique de déplacement progressif du pion : le pion se déplace case par case avec un délai entre chaque, puis déclenche la résolution de la case finale.

**Critères d'acceptation :**
- Fichier `src/game/logic/movePawn.ts` créé
- Le déplacement est séquentiel : une case toutes les 250ms
- L'état `tileIndex` du joueur dans le store est mis à jour à chaque étape intermédiaire
- À la fin du déplacement, la phase passe en `'acting'`
- Le passage sur Départ (index 0) est détecté et déclenche le versement du salaire
- Le pion 3D se met à jour visuellement à chaque changement de `tileIndex`

**Check visuel demandé :** Lancer les dés et confirmer que le pion se déplace case par case de manière fluide et s'arrête sur la bonne case.

---

### #047 — Passage sur Départ (Salaire)

**Description :** Détecter le passage sur ou par la case Départ (index 0) pendant un déplacement et créditer automatiquement le joueur.

**Critères d'acceptation :**
- Fichier `src/game/logic/goReward.ts` créé
- Montant du salaire : 200 € (convention standard)
- La détection se fait pendant le déplacement intermédiaire (pas uniquement à l'arrivée)
- Une notification textuelle "Vous passez par Départ : +200 €" est affichée brièvement
- Le capital du joueur dans le store est mis à jour immédiatement
- Test unitaire : vérifier que le joueur sur l'index 38 qui fait 5 sur les dés collecte bien le salaire

---

## Sprint 3 — Transactions & Cases Spéciales
> *Mettre en place toute la mécanique économique du jeu : achat, loyers, cases spéciales et gestion du capital.*

---

### #048 — Logique d'Achat de Propriété

**Description :** Implémenter la résolution d'une case propriété libre : proposer l'achat au joueur actif si son capital est suffisant.

**Critères d'acceptation :**
- Fichier `src/game/logic/buyProperty.ts` créé
- Si la case est libre et le joueur a assez d'argent → `phase` passe en `'acting'` avec une proposition d'achat
- Action `buyProperty(tileIndex)` dans le store : déduit le prix, enregistre le propriétaire dans `properties`
- Action `declineBuy()` : refuse l'achat, passe directement en `'end-turn'`
- Si le capital est insuffisant, la proposition n'est pas affichée
- Test unitaire : joueur avec 300 € sur une propriété à 200 € → peut acheter / joueur avec 100 € → ne peut pas

**Check visuel demandé :** Atterrir sur une case libre et confirmer que la boîte de dialogue "Acheter ?" s'affiche avec le nom et le prix de la propriété.

---

### #049 — Logique de Loyer

**Description :** Implémenter la résolution d'une case propriété appartenant à un autre joueur : déduire le loyer automatiquement.

**Critères d'acceptation :**
- Fichier `src/game/logic/payRent.ts` créé
- Si la case appartient à un autre joueur → transfert automatique du loyer
- Le loyer est lu depuis `TileDefinition.rent`
- Le capital du joueur actif est débité, le capital du propriétaire est crédité
- Une notification "Vous payez X € de loyer à [joueur]" s'affiche
- Si le joueur actif est propriétaire de sa propre case → aucun loyer
- Test unitaire : joueur A sur propriété de joueur B → capital A diminue, capital B augmente

---

### #050 — Gestion des Transactions Financières

**Description :** Centraliser toutes les opérations financières dans un module unique pour éviter les incohérences et faciliter les tests.

**Critères d'acceptation :**
- Fichier `src/game/logic/transactions.ts` créé
- Fonction `transferMoney(fromId, toId, amount, store)` : valide et exécute le transfert
- Fonction `creditPlayer(playerId, amount, store)` : crédite un joueur (salaire Départ, etc.)
- Fonction `debitPlayer(playerId, amount, store)` : débite un joueur (taxes, etc.)
- Toutes les opérations passent par ces fonctions — aucun accès direct à `player.money` hors de ce module
- Chaque transaction est loggée en console en mode `dev` avec from/to/amount

---

### #051 — Résolution des Cases Spéciales

**Description :** Implémenter la logique pour les cases non-propriétés : Taxe, Chance, Communauté, Aller en Prison, Prison (visite), Parking.

**Critères d'acceptation :**
- Fichier `src/game/logic/resolveSpecialTile.ts` créé
- Cases résolues :
  - `'go'` : rien (salaire géré par #047)
  - `'tax'` : débit fixe de 200 € au joueur
  - `'go-to-jail'` : joueur envoyé en prison (index 10), `inJail: true`
  - `'jail'` : si `inJail: false` → visite simple, si `inJail: true` → joueur paye 50 € ou attend
  - `'free-parking'` : aucune action (Parking gratuit)
  - `'chance'` / `'community'` : pioche une carte aléatoire parmi un set prédéfini minimal (5 cartes chacune)
- Chaque résolution passe la phase en `'end-turn'` une fois terminée

**Check visuel demandé :** Atterrir successivement sur une case Taxe, une case Parking, et la case "Aller en Prison" et confirmer que chaque cas est résolu correctement.

---

## Sprint 4 — Fin de Partie & Validation de Phase
> *Gérer la banqueroute, la victoire et valider l'intégralité de la boucle de jeu de la Phase 3.*

---

### #052 — Détection de Banqueroute

**Description :** Détecter quand un joueur ne peut plus payer une dette et le marquer comme éliminé.

**Critères d'acceptation :**
- Fichier `src/game/logic/bankruptcy.ts` créé
- Un joueur est en banqueroute si son capital passe en dessous de 0 après une transaction obligatoire (loyer, taxe)
- Le joueur est marqué `bankrupt: true` dans le store
- Ses propriétés sont libérées (remises au marché)
- Un message "Joueur X est en banqueroute !" est affiché
- Le joueur est exclu de l'ordre de passage (voir #043)
- Test unitaire : joueur avec 50 € qui doit payer 100 € de loyer → banqueroute

**Check visuel demandé :** Provoquer volontairement une banqueroute (capital insuffisant pour payer un loyer) et confirmer que le joueur est éliminé et ses propriétés libérées.

---

### #053 — Condition de Victoire

**Description :** Détecter la fin de partie (un seul joueur solvable restant) et exposer le résultat dans le store.

**Critères d'acceptation :**
- Vérification après chaque banqueroute : si `players.filter(p => !p.bankrupt).length === 1` → fin de partie
- `phase` passe en `'game-over'`
- `winnerId` est enregistré dans le store
- La boucle de jeu se stoppe (plus aucune action de tour possible)
- Test unitaire : 3 joueurs, 2 mis en banqueroute → le troisième est déclaré vainqueur

**Check visuel demandé :** Simuler une fin de partie à 2 joueurs (en ajustant temporairement le capital de départ) et confirmer que l'écran de victoire se déclenche correctement.

---

### #054 — Tests Unitaires de la Logique de Jeu

**Description :** Écrire une suite de tests couvrant les cas critiques de toute la logique de jeu de la Phase 3.

**Critères d'acceptation :**
- Fichier `src/__tests__/gameLogic.test.ts` créé
- Tests présents pour :
  - Distribution des dés (1-6 par dé, doubles détectés)
  - Déplacement avec passage sur Départ
  - Achat de propriété (fonds suffisants / insuffisants)
  - Paiement de loyer (transfert correct)
  - Banqueroute après dette impossible à couvrir
  - Victoire avec un seul joueur solvable
  - Machine d'état du tour (transitions valides et invalides)
- `npm run test` passe avec 0 échec

---

### #055 — Checklist de Validation Phase 3

**Description :** Vérification finale de la logique de jeu avant passage à la Phase 4 (Interface Utilisateur).

**Checklist :**

**Store & Tour**
- [ ] Le store Zustand est la seule source de vérité de l'état de jeu
- [ ] La machine d'état du tour empêche les transitions invalides
- [ ] L'ordre des joueurs est correct et tourne de manière circulaire
- [ ] Les joueurs en banqueroute sont sautés automatiquement

**Dés & Mouvement**
- [ ] Les dés retournent des valeurs entre 1 et 6
- [ ] Les doubles sont détectés et accordent un tour supplémentaire
- [ ] Trois doubles consécutifs envoient le joueur en prison
- [ ] Le pion se déplace visuellement case par case avec délai
- [ ] Le passage sur Départ déclenche le versement des 200 €

**Propriétés & Transactions**
- [ ] L'achat d'une propriété libre est proposé si le joueur a les fonds
- [ ] Le refus d'achat passe bien au tour suivant
- [ ] Le loyer est prélevé automatiquement et transféré au propriétaire
- [ ] Aucun loyer n'est payé si le joueur est propriétaire de sa case
- [ ] Toutes les transactions passent par le module centralisé

**Cases Spéciales**
- [ ] Taxe : 200 € débités correctement
- [ ] Aller en Prison : pion envoyé à l'index 10, flag `inJail` positionné
- [ ] Parking Gratuit : aucune action
- [ ] Cartes Chance / Communauté : une carte tirée parmi le set minimal

**Fin de Partie**
- [ ] La banqueroute est détectée correctement (capital < 0)
- [ ] Les propriétés du joueur en banqueroute sont libérées
- [ ] La victoire est déclarée quand un seul joueur reste solvable
- [ ] La boucle de jeu se fige proprement après `game-over`

**Qualité**
- [ ] `npm run lint` retourne 0 erreur
- [ ] `npm run test` passe (tous les tests Phase 3)
- [ ] `npm run dev` lance l'app sans warning critique
- [ ] Une partie de 2 joueurs peut se dérouler jusqu'à la victoire sans crash

---

## Récapitulatif des Issues

| #   | Sprint | Titre                                                  | Estimation |
|-----|--------|--------------------------------------------------------|------------|
| 040 | 1      | Architecture du Store Zustand de Jeu                   | 1j         |
| 041 | 1      | État Initial de Partie                                 | 0.5j       |
| 042 | 1      | Machine d'État du Tour (Turn State Machine)            | 1j         |
| 043 | 1      | Passage au Joueur Suivant                              | 0.5j       |
| 044 | 2      | Logique de Lancer de Dés                               | 0.5j       |
| 045 | 2      | Composant UI Dés                                       | 0.5j       |
| 046 | 2      | Déplacement Case par Case avec Délai                   | 1j         |
| 047 | 2      | Passage sur Départ (Salaire)                           | 0.5j       |
| 048 | 3      | Logique d'Achat de Propriété                           | 1j         |
| 049 | 3      | Logique de Loyer                                       | 0.5j       |
| 050 | 3      | Gestion des Transactions Financières                   | 0.5j       |
| 051 | 3      | Résolution des Cases Spéciales                         | 1j         |
| 052 | 4      | Détection de Banqueroute                               | 0.5j       |
| 053 | 4      | Condition de Victoire                                  | 0.5j       |
| 054 | 4      | Tests Unitaires de la Logique de Jeu                   | 1j         |
| 055 | 4      | Checklist de Validation Phase 3                        | 0.5j       |

**Total estimé : ~10 jours développeur**
