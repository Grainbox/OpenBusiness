# 🏗️ Cahier des Charges : Projet "Open-Business"

## 📝 Description du Projet

Création d'un clone de jeu de société type "Business Tour" (Monopoly-like) en vue isométrique. Le projet doit être une application Desktop autonome permettant à un joueur d'héberger une partie localement et d'inviter ses amis (2 à 6 joueurs) sans passer par un serveur central payant ou un abonnement.

## 🎯 Objectifs Principaux

- **Zéro Coût** : Pas d'abonnement, pas de frais d'hébergement serveur.
- **Accessibilité** : Application légère distribuable sous forme d'exécutable (.exe).
- **Esthétique** : Look isométrique moderne et épuré en 3D (style Low-Poly / Cubes).
- **Multijoueur Local-Hébergé** : Système de "Host & Join" où un joueur fait office de serveur.

## ✅ Spécifications Fonctionnelles

### 🕹️ Gameplay (Version Simplifiée)

- **Capacité** : Support de 2 à 6 joueurs simultanés.
- **Plateau** : Carré de 40 cases (11x11 incluant les coins).
- **Mécaniques de base** :
  - Lancer de deux dés 6 faces.
  - Déplacement automatique du pion sur les cases.
  - Achat de propriétés (cases vides).
  - Paiement de loyers si arrêt sur une case adverse.
  - Gestion d'un capital de départ et banqueroute.
- **Système de Tours** : Gestion rigoureuse de l'ordre de passage (Tour par tour).

### 🖥️ Interface & Rendu

- **Vue Isométrique** : Caméra fixe à 45° (orthographique) pour un rendu 3D sans distorsion de perspective.
- **Design** : Utilisation de primitives géométriques (cubes pour les cases et les pions).
- **UI (Interface Utilisateur)** :
  - Affichage du budget de chaque joueur sur le côté.
  - Fenêtre modale lors de l'arrêt sur une case (Acheter ? / Payer).
  - Menu principal (Créer une partie / Rejoindre avec un ID).

## 🛠️ Stack Technique Recommandée (Optimisée IA)

### Frontend & Client Desktop

- **Runtime** : Electron.js (pour transformer le projet web en application desktop).
- **Framework** : React.js (pour la gestion de l'interface et de l'état).
- **Moteur de Rendu** : React Three Fiber (R3F) + Three.js (pour la scène isométrique).
- **Stylisation** : Tailwind CSS (pour des menus rapides et propres).

### Réseau & Logique

- **Communication P2P** : PeerJS (permet de connecter les joueurs entre eux via un ID unique sans serveur intermédiaire complexe).
- **Gestion d'État** : Zustand ou Redux (pour synchroniser l'état du plateau entre tous les clients).
- **Physique (Optionnel)** : Cannon.js (si besoin de faire rouler les dés physiquement).

## ❌ Hors de portée (Ce qu'on ne veut PAS)

- **Base de données persistante** : Pas de comptes utilisateurs ni de sauvegarde dans le cloud.
- **Graphismes complexes** : Pas de textures HD ou de modèles 3D complexes (focus sur les cubes).
- **Matchmaking** : Pas de recherche de partie publique ; uniquement par invitation via ID.
- **Animations avancées** : Pas de personnages animés (les cubes "sautent" ou "glissent").