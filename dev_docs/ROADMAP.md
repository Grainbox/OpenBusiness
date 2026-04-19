# Roadmap — Open-Business

> Jeu de société Monopoly-like en vue isométrique, multijoueur P2P, distribué comme application desktop autonome.

---

## Phase 1 — Fondations du Projet
*Mise en place de l'environnement de développement et de la structure de base.*

- Initialiser le projet Electron + React + Vite
- Configurer Tailwind CSS et l'architecture des dossiers
- Intégrer React Three Fiber / Three.js et valider le rendu isométrique (caméra orthographique à 45°)
- Poser la scène 3D vide : plateau carré, éclairage, couleurs de base
- Configurer le build Electron pour produire un `.exe` distribuable

---

## Phase 2 — Le Plateau de Jeu
*Construire le cœur visuel du jeu : les 40 cases et leur disposition.*

- Générer les 40 cases (11x11, coins inclus) en cubes isométriques
- Catégoriser les cases : propriétés, coins spéciaux (départ, prison, parking, etc.)
- Attribuer des couleurs de groupe aux propriétés (groupes de cases)
- Afficher les labels des cases (nom, prix) via des éléments HTML overlay
- Positionner les pions-joueurs (cubes colorés) sur la case Départ

---

## Phase 3 — Logique de Jeu Core
*Implémenter les règles du jeu, gestion d'état centralisée.*

- Mettre en place le store Zustand : état du plateau, joueurs, tour courant
- Lancer de deux dés (aléatoire, avec animation simple)
- Déplacement automatique du pion case par case avec délai visuel
- Gestion du tour : ordre de passage, passage de tour, boucle de jeu
- Logique d'achat de propriété (case libre → proposition d'achat)
- Logique de loyer (case adverse → paiement automatique)
- Gestion du capital : déduction/ajout d'argent, détection de banqueroute
- Condition de victoire (dernier joueur solvable)

---

## Phase 4 — Interface Utilisateur
*Rendre le jeu jouable et lisible via une UI claire.*

- Menu principal : boutons "Créer une partie" et "Rejoindre une partie"
- Affichage latéral des budgets de chaque joueur (nom, solde, propriétés)
- Fenêtre modale contextuelle : "Acheter ?" / "Payer le loyer" / "Banqueroute"
- Bouton "Lancer les dés" actif uniquement pendant son propre tour
- Indicateur visuel du joueur actif (surbrillance pion, nom mis en évidence)
- Écran de fin de partie avec classement

---

## Phase 5 — Multijoueur P2P
*Connecter plusieurs joueurs sur le même réseau local ou via Internet sans serveur central.*

- Intégrer PeerJS : génération d'un ID de partie unique pour l'hôte
- Flux "Host" : créer une partie, afficher l'ID à partager, attendre les connexions
- Flux "Join" : saisir un ID, se connecter à l'hôte
- Lobby d'attente : afficher les joueurs connectés, bouton "Lancer" pour l'hôte
- Synchronisation de l'état de jeu : diffusion des actions de l'hôte vers tous les clients
- Gestion des déconnexions : joueur retiré ou remplacé par un bot passif
- Tests de connexion LAN et via Internet (STUN/TURN de PeerJS)

---

## Phase 6 — Polish & Distribution
*Finitions visuelles, robustesse et packaging final.*

- Animations des pions (saut ou glissement entre les cases)
- Animation des dés (rotation rapide avant résultat)
- Sons d'interface simples (lancer de dés, achat, loyer)
- Écran de chargement / splash screen au lancement de l'app
- Icône de l'application et nom dans la barre de titre
- Build et packaging `.exe` Windows avec Electron Builder
- Tests end-to-end complets (2 à 6 joueurs, scénarios de banqueroute, déconnexion)
- README utilisateur : comment installer et lancer une partie

---

## Objectif Final

Une application `.exe` autonome, sans abonnement ni serveur, où un groupe de 2 à 6 amis peut lancer une partie de Business depuis n'importe quel réseau en partageant simplement un code de partie.
