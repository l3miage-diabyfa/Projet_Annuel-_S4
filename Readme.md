# Izzi - Plateforme de Collecte d'Avis Étudiants

## 📋 Description

Izzi est une plateforme web permettant aux établissements scolaires de collecter et gérer les retours d'expérience des étudiants sur leurs cours et intervenants.

### Fonctionnalités principales

- **Gestion multi-établissements** : Chaque école dispose de son espace dédié
- **Organisation des classes** : Création et gestion des classes avec leurs matières respectives
- **Gestion des utilisateurs** : Enseignants, étudiants et administrateurs
- **Formulaires de retour** : Création de questionnaires personnalisés
- **Distribution automatique** : Envoi de formulaires aux étudiants par email
- **Tableau de bord analytique** : Visualisation des statistiques et tendances
- **Système d'abonnement** : Plans gratuits et premium avec Stripe
- **Authentification sécurisée** : JWT + bcrypt pour la protection des données

## 🏗️ Architecture
```
┌─────────────┐      HTTPS      ┌──────────────┐      ┌─────────────┐
│   Frontend  │ ◄─────────────► │   Backend    │ ◄───►│  PostgreSQL │
│   Next.js   │                 │   NestJS     │      │  Database   │
└─────────────┘                 └──────────────┘      └─────────────┘
      │                               │
      │                               │
      └───────────────┬───────────────┘
                      │
                 ┌────▼────┐
                 │  Stripe │
                 │   API   │
                 └─────────┘
```

## 🛠️ Technologies

### Backend
- **Framework** : NestJS (Node.js)
- **Langage** : TypeScript
- **ORM** : Prisma
- **Base de données** : PostgreSQL 15
- **Authentification** : JWT (JSON Web Tokens)
- **Chiffrement** : bcrypt
- **Documentation API** : Swagger
- **Paiements** : Stripe API
- **Emails** : Service de mailing intégré

### Frontend
- **Framework** : Next.js 16
- **Langage** : TypeScript
- **Styling** : Tailwind CSS (probable)
- **Gestion d'état** : React Context API

### DevOps
- **Conteneurisation** : Docker + Docker Compose
- **Orchestration** : Docker Swarm
- **Reverse Proxy** : Traefik v2.10
- **CI/CD** : GitHub Actions
- **Registry** : GitHub Container Registry (GHCR)
- **Certificats SSL** : Let's Encrypt (via Traefik)

## 📁 Structure du projet
```
Projet-Annuel-S4/
├── backend/                    # Application NestJS
│   ├── src/
│   │   ├── user/              # API utilisateurs
│   │   ├── classes/           # API gestion des classes
│   │   ├── subjects/          # API matières
│   │   ├── reviews/           # API avis et formulaires
│   │   ├── establishment/     # API établissements
│   │   ├── subscription/      # API abonnements Stripe
│   │   └── prisma/            # Configuration Prisma ORM
│   ├── Dockerfile             # Image dev
│   ├── Dockerfile.prod        # Image production
│   └── prisma/schema.prisma   # Schéma base de données
│
├── frontend/                  # Application Next.js
│   ├── app/                   # Routes Next.js (App Router)
│   ├── components/            # Composants React réutilisables
│   ├── lib/                   # API client & utilitaires
│   ├── Dockerfile             # Image dev
│   └── Dockerfile.prod        # Image production
│
├── .github/workflows/         # Pipelines CI/CD
│   ├── ci-cd.yml             # Pipeline principal (main branch)
│   └── test-ci-cd.yml        # Pipeline de test (feature branches)
│
├── docker-compose.dev.yml     # Configuration développement local
├── docker-compose.prod.yml    # Configuration production simple
└── docker-swarm-stack.yml     # Configuration cluster haute disponibilité
```

## 🔌 APIs disponibles

Le backend expose plusieurs APIs RESTful documentées via Swagger :

- **`/user`** : Gestion des utilisateurs (inscription, connexion, profils)
- **`/classes`** : CRUD des classes et inscriptions étudiants
- **`/subjects`** : CRUD des matières et intervenants
- **`/reviews`** : Création et gestion des formulaires d'avis
- **`/establishment`** : Gestion des établissements scolaires
- **`/subscription`** : Gestion des abonnements et paiements Stripe

**Documentation interactive** : `http://localhost:3000/api` (en développement)

**Collection Postman** : https://gym-challenge-api.postman.co/workspace/Personal-Workspace~2b10435d-92be-4e4e-adf3-a23675778594/collection/27114032-e9056d77-94ff-4f93-ade9-06641d8d22e4?action=share&source=copy-link&creator=27114032

## 🚀 Démarrage rapide

### Prérequis

- Node.js 25+
- Docker & Docker Compose
- PostgreSQL 15 (ou via Docker)

### Installation en développement

1. **Cloner le repository**
```bash
   git clone https://github.com/l3miage-diabyfa/Projet_Annuel-_S4.git
   cd Projet-Annuel-S4
```

2. **Configurer les variables d'environnement**
```bash
   # Backend
   cp backend/.env.example backend/.env
   # Éditer backend/.env avec vos configurations

   # Frontend (optionnel)
   cp frontend/.env.example frontend/.env
```

3. **Lancer avec Docker Compose à la racine du projet**
```bash
   docker compose -f docker-compose.dev.yml up -d --build
```

4. **Accéder aux services**
   - Frontend : http://localhost:3001
   - Backend : http://localhost:3000
   - API Docs : http://localhost:3000/api
   - Database : localhost:5432

### Installation manuelle (sans Docker)
```bash
# Backend
cd backend
npm install
npx prisma migrate deploy
npx prisma generate
npm run start:dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

## 🔐 Configuration des secrets

Variables d'environnement critiques :

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/izzi_db"
JWT_SECRET="votre-clé-secrète-jwt"
FRONTEND_URL="http://localhost:3001"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"  # Google Analytics (optionnel)
```

## 📦 Déploiement en production

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions complètes de déploiement avec Docker Swarm.

### Déploiement rapide (Docker Compose simple)
```bash
# 1. Build et push des images (automatique via CI/CD)
# 2. Sur le serveur de production
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### Déploiement haute disponibilité (Docker Swarm)

Voir documentation dédiée : [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🧪 Tests et CI/CD

### Pipeline CI/CD

Le projet utilise GitHub Actions avec 3 workflows :

1. **Tests Backend** : Lint, tests unitaires, migrations Prisma
2. **Tests Frontend** : Lint, build de production
3. **Build & Deploy** : Construction des images Docker et déploiement automatique

**Déclencheurs** :
- `push` sur `main` → Tests + Build + Deploy production
- `push` sur `feature/**` → Tests uniquement
- `pull_request` sur `main`/`dev` → Tests complets

### Lancer les tests localement
```bash
# Backend
cd backend
npm test
npm run lint

# Frontend
cd frontend
npm run build
npm run lint
```

## 📊 Modèle de données (simplifié)
```
Establishment (Établissement)
  ├── Users (Utilisateurs)
  │     ├── role: ADMIN | TEACHER | STUDENT | REFERENT
  │     └── subscription: Plan d'abonnement
  │
  └── Classes
        ├── Teacher (Enseignant responsable)
        ├── Students (Étudiants inscrits via Enrollments)
        └── Subjects (Matières)
              └── ReviewForms (Formulaires d'avis)
                    └── Responses (Réponses étudiants)
```

## 🎯 Feuille de route

- [x] Architecture multi-établissements
- [x] Système d'authentification JWT
- [x] Gestion des classes et matières
- [x] Formulaires de retour personnalisables
- [x] Intégration Stripe pour abonnements
- [x] Dockerisation complète
- [x] CI/CD avec GitHub Actions
- [x] Application mobile (Responsive)
- [ ] Notifications en temps réel (WebSocket)
- [?] Export des données (CSV/Excel)

## 👥 Contributeurs

- **Équipe de développement** : 
- **Encadrement** : Amin NAIRI & Vincent LAINE (ESGI)

## 📄 Licence

Ce projet est développé dans le cadre d'un projet académique.

## 📞 Contact & Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2026
**Auteurs** : Groupe 3 - 5IWJ
Salim TIZI
Vu Quang Anh DOAN
Arthur VALENTIM
Fatoumata DIABY