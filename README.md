# 🚀 ARCHETYPES SERVER - LITE VERSION

Backend Node.js/Express (TypeScript) **SANS BASE DE DONNÉES**.

Reçoit les données → Transmet directement à Lindy Workflows.

## 📋 Vue d'ensemble

Version allégée du serveur qui fonctionne **100% en mémoire** :

- ❌ **Pas de PostgreSQL**
- ❌ **Pas de stockage persistant**
- ✅ **Messages en mémoire** (réinitialise au redémarrage)
- ✅ **Webhooks Lindy intégrés**
- ✅ **Direct forwarding** (reçoit → transmet)

## 🏗️ Architecture

```
Frontend (React/Vite)
    ↓
Serveur Lite (Node/Express)
    ↓
Lindy Workflows (via webhooks)
```

## 📦 Stack Technique

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Storage**: In-memory (aucune DB)
- **Package Manager**: npm

## 🔧 Installation

### 1. Installer les dépendances

```bash
cd /home/code/archetypes-server-lite
npm install
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
```

### 3. Démarrer le serveur

```bash
npm run dev
```

Le serveur démarre sur **http://localhost:3001**

## 📡 Endpoints API

### Chat

- **POST** `/api/send-popup-message` - Recevoir le premier message
- **POST** `/api/send-chat-message` - Recevoir les messages IA
- **GET** `/api/chat-response/:visitorId` - Polling pour les messages
- **POST** `/api/chat-opened` - Notifier l'ouverture du chat
- **POST** `/api/visitor-message` - Recevoir les messages utilisateur

### Tracking

- **POST** `/api/track-behavior` - Recevoir les données de tracking (25s)

### Analytics

- **POST** `/api/analytics/conversion` - Enregistrer une conversion
- **POST** `/api/analytics/product-update` - Mettre à jour le catalogue

### Health

- **GET** `/test` - Vérifier que le serveur est accessible

## 🔗 Webhooks Lindy

Le serveur envoie des webhooks vers Lindy avec authentification Bearer :

### Flow 1 - Tracking
```
URL: https://public.lindy.ai/api/v1/webhooks/lindy/6a4ca310-f11b-430c-a54a-35f8e7891cea
Key: ee24da04e7e5d5721dbced7aeb2143ce5866a96d65d57639b4569c28b6e37a31
```

### Flow 2 - Chat
```
URL: https://public.lindy.ai/api/v1/webhooks/lindy/3a1c0072-734d-4643-84e7-fc2206597980
Key: 5b7034f7edc85ce6fc8632a9ffcd7b2dc71feb8efcb21c7834ee6cfba5bba856
```

### Flow 3 - Conversions
```
URL: https://public.lindy.ai/api/v1/webhooks/lindy/e13676be-33b2-4c22-9f98-deace2dc9d3b
Key: cd386b6dbfc8b6c29677e00ec241e66edd2d7fd88ad1a9c2ce43577d3b273706
```

### Flow 4 - Produits
```
URL: https://public.lindy.ai/api/v1/webhooks/lindy/20a72a1f-6dcb-4f23-ac1b-2e21ca75bab3
Key: afefbeb3e1941a6e486dfd70b8a5f425962bcfb5b137a26ae7c8698ffcc6365e
```

## 📁 Structure des fichiers

```
src/
├── index.ts                 # Point d'entrée principal
├── types/
│   └── index.ts            # Interfaces TypeScript
├── services/
│   └── lindyService.ts     # Webhooks Lindy
└── routes/
    ├── chat.ts             # Routes chat
    ├── tracking.ts         # Routes tracking
    └── analytics.ts        # Routes analytics
```

## 🚀 Déploiement

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## 📊 Flux de données

### 1. Tracking (25 secondes)

```
Frontend (tracking 25s)
    ↓
POST /api/track-behavior
    ↓
Webhook → Lindy Flow 1
    ↓
Lindy analyse comportement
    ↓
Lindy envoie premier message
    ↓
POST /api/send-popup-message
    ↓
Frontend poll GET /api/chat-response/:visitorId
    ↓
Afficher popup + chat
```

### 2. Chat

```
Utilisateur ouvre chat
    ↓
POST /api/chat-opened
    ↓
Webhook → Lindy Flow 2
    ↓
Lindy envoie réponse
    ↓
POST /api/send-chat-message
    ↓
Frontend poll GET /api/chat-response/:visitorId
    ↓
Afficher message dans chat
```

### 3. Conversion

```
Utilisateur achète
    ↓
POST /api/analytics/conversion
    ↓
Webhook → Lindy Flow 3
    ↓
Enregistrer conversion
```

## 🔐 Sécurité

- ✅ Validation des inputs sur tous les endpoints
- ✅ Authentification Bearer pour les webhooks Lindy
- ✅ CORS configuré
- ✅ Gestion des erreurs centralisée

## 📝 Logs

Le serveur log toutes les requêtes avec timestamp :

```
[2026-01-18T02:08:00.000Z] POST /api/track-behavior
[2026-01-18T02:08:01.000Z] [tracking] 📊 Tracking data sent to Lindy for visitor: visitor_123
[2026-01-18T02:08:02.000Z] POST /api/send-popup-message
[2026-01-18T02:08:03.000Z] [chat] 📬 Popup message received for visitor: visitor_123
```

## ⚠️ Important

**Les messages sont stockés en mémoire** et réinitialisés au redémarrage du serveur.

Pour une solution persistante, utilisez la version complète avec PostgreSQL.

## 📞 Support

Pour toute question, consulter la documentation Lindy ou les logs du serveur.

---

**Version**: 1.0.0 (Lite)  
**Dernière mise à jour**: 2026-01-18
