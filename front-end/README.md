[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0.1-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.2-7952B3?logo=bootstrap)](https://getbootstrap.com/)

La plateforme de référence pour trouver votre stage idéal. Connectez-vous avec les meilleures entreprises et lancez votre carrière !

## ✨ Fonctionnalités

- 🔐 **Authentification complète** - Inscription, connexion, gestion de profil
- 🔍 **Recherche avancée** - Filtres multiples pour trouver le stage parfait
- 💼 **Gestion de candidatures** - Postulez et suivez vos candidatures
- ❤️ **Favoris** - Sauvegardez vos offres préférées
- 🎨 **Interface moderne** - Design responsive avec Bootstrap personnalisé
- ⚡ **Performance optimale** - Architecture Redux pour une gestion d'état efficace

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v16+)
- npm (v7+)

### Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/stage-finder.git
cd stage-finder

# Installer les dépendances
npm install

# Démarrer en mode développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📦 Scripts disponibles

```bash
npm start          # Démarre le serveur de développement
npm run build      # Build pour la production
npm test           # Lance les tests
npm run eject      # Ejecte la configuration (irréversible)
```

## 🛠️ Technologies utilisées

- **Frontend**: React 18, React Router 6
- **State Management**: Redux Toolkit
- **UI Framework**: Bootstrap 5, React Bootstrap
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Styling**: CSS Modules

## 📁 Structure du projet

```
stage-finder/
├── public/              # Fichiers statiques
├── src/
│   ├── components/      # Composants réutilisables
│   ├── pages/          # Pages de l'application
│   ├── store/          # Configuration Redux
│   ├── services/       # Services API
│   ├── utils/          # Utilitaires
│   ├── styles/         # Styles globaux
│   └── data/           # Données mock
└── package.json
```

## 🎨 Personnalisation

Les couleurs principales sont définies dans `src/styles/custom-bootstrap.css`:

```css
:root {
  --primary-blue: #0066CC;
  --secondary-green: #00C853;
}
```

## 🔌 Configuration de l'API

Créez un fichier `.env` à la racine :

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Stage Finder
```

## 👥 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📧 Contact

Email: contact@stagefinder.com
Site web: https://stagefinder.com

---

Fait avec ❤️ par l'équipe Stage Finder
*/

