# NFT Marketplace XRP Ledger

## Vue d'ensemble

NFT Marketplace est une plateforme de création, d'achat et de vente de NFTs (Non-Fungible Tokens) construite sur le XRP Ledger. Cette application web développée avec Next.js permet aux utilisateurs de gérer leurs collections NFT, de minter de nouveaux NFTs et de faciliter les transactions de manière sécurisée. La plateforme prend en charge le wallet Xaman sur smartphone.

![Capture d'écran de la page d'accueil](/public/images/readme.png)

## Fonctionnalités

- **Création de NFT** : Mintez facilement vos propres NFTs avec upload d'images sur IPFS
- **Exploration de NFTs** : Parcourez les collections disponibles sur la marketplace
- **Profil utilisateur** : Gérez votre portefeuille et vos collections
- **Transactions sécurisées** : Achetez et vendez des NFTs via le XRP Ledger
- **Documentation** : Guides détaillés pour utiliser la plateforme
- **Interface réactive** : Design moderne et adaptatif grâce à Tailwind CSS

## Technologies utilisées

- **Frontend**: Next.js 13.5, React 18, TypeScript
- **Styles**: Tailwind CSS, Radix UI
- **Stockage décentralisé**: IPFS via Pinata
- **Base de données**: Supabase
- **Blockchain**: XRP Ledger (XRPL)
- **Authentification**: XUMM Wallet

## Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Compte XUMM pour l'authentification
- Compte Pinata pour le stockage IPFS (clés API configurées)
- Base de données Supabase configurée

## Installation

1. **Clonez le dépôt**
   ```bash
   git clone [url-du-repo]
   cd nft-marketplace
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuration des variables d'environnement**
   
   Créez un fichier `.env.local` à la racine du projet avec les variables nécessaires (voir `.env` pour référence):
   ```
   XUMM_API_KEY="votre-clé-api"
   XUMM_API_SECRET="votre-secret-api"
   NEXT_PUBLIC_SUPABASE_URL="votre-url-supabase"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-clé-anon-supabase"
   PINATA_API_KEY="votre-clé-api-pinata"
   PINATA_API_SECRET="votre-secret-api-pinata"
   PINATA_JWT="votre-jwt-pinata"
   ```

## Lancement de l'application

### Développement

Pour démarrer l'application en mode développement :
```bash
npm run dev
# ou
yarn dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

### Production

1. **Construction de l'application**
   ```bash
   npm run build
   # ou
   yarn build
   ```

2. **Lancement du serveur de production**
   ```bash
   npm start
   # ou
   yarn start
   ```

## Structure du projet

- `/app` - Routes et pages de l'application Next.js
- `/components` - Composants React réutilisables
- `/services` - Services pour les interactions NFT, IPFS et utilisateurs
- `/utils` - Fonctions utilitaires
- `/lib` - Bibliothèques et configurations
- `/types` - Définitions de types TypeScript
- `/hooks` - Hooks React personnalisés
- `/public` - Ressources statiques

## Utilisation de l'application

1. **Connexion** : Utilisez votre portefeuille XUMM pour vous connecter
2. **Exploration** : Parcourez les NFTs disponibles sur la page d'accueil
3. **Création** : Accédez à `/mint` pour créer votre propre NFT
4. **Collection** : Visualisez vos NFTs dans votre profil utilisateur
5. **Transactions** : Achetez ou vendez des NFTs via le système d'échange intégré
