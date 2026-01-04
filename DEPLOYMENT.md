# Guide de Déploiement - Izzi Platform

Ce guide détaille le déploiement de la plateforme Izzi en production avec Docker Swarm pour une haute disponibilité.

## 📋 Table des matières

1. [Architecture de déploiement](#architecture-de-déploiement)
2. [Prérequis](#prérequis)
3. [Configuration Docker](#configuration-docker)
4. [Déploiement Docker Swarm](#déploiement-docker-swarm)
5. [Vérification et tests](#vérification-et-tests)
6. [Maintenance](#maintenance)
7. [Dépannage](#dépannage)

---

## 🏗️ Architecture de déploiement

### Configuration Docker Swarm
```
┌─────────────────────────────────────────────┐
│          Traefik (Load Balancer)            │
│        Ports 80, 443, 8080                  │
│     SSL/TLS (Let's Encrypt)                 │
└──────────────┬──────────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────┐           ┌────▼───┐
│Frontend│           │Backend │
│ (x3)   │           │ (x2)   │
│Next.js │           │NestJS  │
└───┬────┘           └────┬───┘
    │                     │
    └──────────┬──────────┘
               │
         ┌─────▼──────┐
         │ PostgreSQL │
         │    (x1)    │
         └────────────┘
```

### Répartition des services

| Service | Replicas | Rôle |
|---------|----------|------|
| **Traefik** | 1 | Reverse proxy, SSL, load balancing |
| **Frontend** | 3 | Interface utilisateur Next.js |
| **Backend** | 2 | API NestJS |
| **PostgreSQL** | 1 | Base de données (stateful) |

**Note** : La base de données utilise 1 replica en raison de son aspect stateful.

---

## ✅ Prérequis

### Serveurs requis

- **Minimum** : 1 manager + 2 workers (3 VPS total)
- **Recommandé** : 1 manager + 2 workers
- **OS** : Ubuntu 20.04/22.04/24.04 LTS
- **RAM** : 4GB minimum par serveur
- **CPU** : 2 cores minimum
- **Stockage** : 40GB minimum

### Logiciels nécessaires
```bash
# Sur chaque serveur
sudo apt update
sudo apt install -y docker.io docker-compose git curl

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
# Déconnectez-vous et reconnectez-vous pour appliquer les changements
```

### Ports à ouvrir

**Manager et Workers** :
- `2377/tcp` : Communication cluster Swarm
- `7946/tcp` : Communication entre nœuds
- `7946/udp` : Communication entre nœuds
- `4789/udp` : Overlay network

**Manager uniquement** :
- `80/tcp` : HTTP
- `443/tcp` : HTTPS
- `8080/tcp` : Dashboard Traefik (optionnel)

---

## 🐳 Configuration Docker

### Structure des fichiers

Le projet contient 3 fichiers de configuration Docker :

#### 1. `docker-compose.dev.yml`
Configuration pour développement local avec volumes montés pour hot-reload.

**Utilisation** :
```bash
docker compose -f docker-compose.dev.yml up -d --build
```

**Services** :
- PostgreSQL (port 5432)
- Backend (port 3000) avec volumes pour hot-reload
- Frontend (port 3001) avec volumes pour hot-reload
- Stripe CLI pour webhooks locaux

#### 2. `docker-compose.prod.yml`
Configuration production simple (serveur unique) avec images pré-buildées.

**Utilisation** :
```bash
docker compose -f docker-compose.prod.yml up -d
```

**Services** :
- PostgreSQL avec volume persistant
- Backend (image GHCR)
- Frontend (image GHCR)

#### 3. `docker-swarm-stack.yml`
Configuration pour déploiement haute disponibilité avec Docker Swarm.

**Caractéristiques** :
- Réplication automatique (Frontend x3, Backend x2)
- Load balancing natif
- Rolling updates
- Secrets management
- Traefik pour SSL/TLS automatique
- Réseaux overlay isolés

---

## 🚀 Déploiement Docker Swarm

### Étape 1 : Initialiser le cluster Swarm

#### Sur le serveur Manager
```bash
# Initialiser Swarm
docker swarm init --advertise-addr <IP-DU-MANAGER>

# Exemple :
docker swarm init --advertise-addr 192.168.1.100

# Vous obtiendrez un token de type :
# docker swarm join --token SWMTKN-1-xxxxx <IP-DU-MANAGER>:2377
```

**Sauvegarder le token** : Copiez-le, vous en aurez besoin pour les workers.

#### Sur chaque serveur Worker
```bash
# Utiliser le token obtenu précédemment
docker swarm join --token SWMTKN-1-xxxxx <IP-DU-MANAGER>:2377
```

#### Vérifier le cluster
```bash
# Sur le Manager uniquement
docker node ls

# Sortie attendue :
# ID                HOSTNAME   STATUS    AVAILABILITY   MANAGER STATUS   
# abc123 *          manager    Ready     Active         Leader           
# def456            worker1    Ready     Active                          
# ghi789            worker2    Ready     Active                          
```

---

### Étape 2 : Récupérer le code source

#### Sur le serveur Manager

**Option A : Clonage avec token GitHub**
```bash
# 1. Créer un Personal Access Token sur GitHub
#    Settings → Developer settings → Personal access tokens → Generate new token
#    Sélectionner scope: repo

# 2. Cloner le repository
cd /opt
git clone https://VOTRE_TOKEN@github.com/l3miage-diabyfa/Projet_Annuel-_S4.git
cd Projet_Annuel-_S4
```

**Option B : Clonage avec SSH Deploy Key**
```bash
# 1. Générer une clé SSH sur le serveur
ssh-keygen -t ed25519 -C "deploy-key-izzi"
cat ~/.ssh/id_ed25519.pub

# 2. Ajouter la clé publique à GitHub
#    Repo → Settings → Deploy keys → Add deploy key

# 3. Cloner
cd /opt
git clone git@github.com:l3miage-diabyfa/Projet_Annuel-_S4.git
cd Projet_Annuel-_S4
```

---

### Étape 3 : Créer les secrets Docker

Les secrets Docker permettent de stocker de manière sécurisée les informations sensibles.
```bash
# Depuis le répertoire du projet sur le Manager

# 1. Créer le secret pour l'utilisateur de la base de données
echo "school_admin" | docker secret create db_user -

# 2. Créer le secret pour le mot de passe de la base de données
echo "VOTRE_MOT_DE_PASSE_SECURISE" | docker secret create db_password -

# 3. Créer le secret JWT (générer une clé aléatoire forte)
openssl rand -base64 32 | docker secret create jwt_secret -

# Vérifier que les secrets sont créés
docker secret ls

# Sortie attendue :
# ID                NAME          CREATED          UPDATED
# abc123            db_user       10 seconds ago   10 seconds ago
# def456            db_password   8 seconds ago    8 seconds ago
# ghi789            jwt_secret    5 seconds ago    5 seconds ago
```

**⚠️ Important** : Ne jamais commiter les secrets dans Git !

---

### Étape 4 : Configurer les variables d'environnement

Créer un fichier `.env` pour les variables non-sensibles :
```bash
nano /opt/school-app/.env
```

Contenu du fichier `.env` :
```env
# Database
POSTGRES_DB=school_db

# Frontend
NEXT_PUBLIC_API_URL=https://api.izzi.local
FRONTEND_URL=https://izzi.local

# Stripe (clés publiques OK dans .env)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

---

### Étape 5 : Se connecter au registry GitHub

Les images Docker sont hébergées sur GitHub Container Registry (GHCR).
```bash
# Créer un Personal Access Token avec scope read:packages
# GitHub → Settings → Developer settings → Personal access tokens

# Se connecter au registry
echo "VOTRE_TOKEN" | docker login ghcr.io -u VOTRE_USERNAME --password-stdin

# Ou de manière interactive
docker login ghcr.io
# Username: votre-github-username
# Password: votre-token
```

---

### Étape 6 : Déployer la stack
```bash
# Depuis le répertoire contenant docker-swarm-stack.yml
docker stack deploy -c docker-swarm-stack.yml school-app

# Sortie attendue :
# Creating network school-app_traefik-public
# Creating network school-app_backend-network
# Creating service school-app_traefik
# Creating service school-app_postgres
# Creating service school-app_backend
# Creating service school-app_frontend
```

**Note** : Le déploiement peut prendre 2-5 minutes le temps de télécharger les images.

---

### Étape 7 : Vérifier le déploiement
```bash
# 1. Vérifier les services
docker service ls

# Sortie attendue (après quelques minutes) :
# ID       NAME                   MODE        REPLICAS   IMAGE
# abc123   school-app_traefik     replicated  1/1        traefik:v2.10
# def456   school-app_postgres    replicated  1/1        postgres:15-alpine
# ghi789   school-app_backend     replicated  2/2        ghcr.io/l3miage-diabyfa/...:latest
# jkl012   school-app_frontend    replicated  3/3        ghcr.io/l3miage-diabyfa/...:latest

# 2. Voir la répartition des conteneurs sur les nœuds
docker service ps school-app_backend
docker service ps school-app_frontend

# 3. Vérifier les logs
docker service logs school-app_backend --tail 50
docker service logs school-app_frontend --tail 50
docker service logs school-app_postgres --tail 50

# 4. Vérifier les réseaux
docker network ls | grep school-app
```

---

### Étape 8 : Configurer le DNS

#### Option A : Fichier `/etc/hosts` (test local)

Sur votre machine locale :
```bash
# Linux/Mac
sudo nano /etc/hosts

# Windows (en tant qu'administrateur)
notepad C:\Windows\System32\drivers\etc\hosts
```

Ajouter :
```
<IP-DU-MANAGER>   izzi.local
<IP-DU-MANAGER>   api.izzi.local
<IP-DU-MANAGER>   traefik.izzi.local
```

#### Option B : DNS réel (production)

Configurer des enregistrements DNS A chez votre registrar :
```
izzi.votredomaine.com      A    <IP-DU-MANAGER>
api.izzi.votredomaine.com  A    <IP-DU-MANAGER>
```

Puis modifier `docker-swarm-stack.yml` avec vos vrais domaines :
```yaml
- "traefik.http.routers.frontend.rule=Host(`izzi.votredomaine.com`)"
- "traefik.http.routers.backend.rule=Host(`api.izzi.votredomaine.com`)"
```

Redéployer :
```bash
docker stack deploy -c docker-swarm-stack.yml school-app
```

---

## 📞 Support

En cas de problème persistant :

1. Consulter les logs : `docker service logs <service> --tail 200`
2. Vérifier l'état du cluster : `docker node ls`
3. Ouvrir une issue sur GitHub avec les logs
4. Contacter l'équipe de développement

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2026  
**Auteurs** : Groupe 3 - 5IWJ
Salim TIZI
Vu Quang Anh DOAN
Arthur VALENTIM
Fatoumata DIABY