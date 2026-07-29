## Model Used
- Opus 4.7 high performance

## Préparation

Avant de démarrer le développement du frontend, j'ai défini les technologies à utiliser, les bonnes pratiques React, les conventions TypeScript ainsi que les exigences en matière d'interface utilisateur, de responsive design et de qualité du code.

À partir de ces exigences et de mes propres choix techniques (React, TypeScript, Tailwind CSS et `useState` pour la gestion d'état), j'ai utilisé l'IA pour générer un fichier `PROJECT_RULES.md`.

Ce fichier a servi de contexte permanent pour l'assistant IA afin de garantir des générations de code cohérentes, conformes aux standards définis, et d'éviter de répéter les mêmes consignes à chaque interaction tout au long du développement.


## Phase 1 — Application Setup

Avant de développer les fonctionnalités du frontend, j'ai défini l'architecture de base de l'application, notamment le routage, la configuration des variables d'environnement, la communication avec l'API et l'organisation de la couche de services.

À partir de ces exigences, j'ai utilisé l'IA pour générer le code d'initialisation comprenant la configuration de React Router, la création de `ProductsPage`, la configuration d'Axios avec une URL d'API dynamique via un fichier `.env`, ainsi que la mise en place du `ProductService` afin de centraliser les appels HTTP.

J'ai également demandé à l'IA de configurer le backend NestJS afin d'activer la politique CORS pour permettre au frontend React de communiquer avec l'API pendant le développement.

L'IA a uniquement assisté la mise en place de l'infrastructure technique de l'application, sans implémenter les fonctionnalités métier ni l'interface utilisateur.

# Phase 2 — Products Table

Après avoir mis en place la communication avec l'API, j'ai défini les exigences de l'interface utilisateur pour l'affichage des produits, notamment la structure du tableau, les informations à présenter, les états de chargement, d'erreur et de liste vide, ainsi que les principes de responsive design et d'expérience utilisateur.

À partir de ces exigences, j'ai utilisé l'IA pour générer le composant `ProductTable` en React avec Tailwind CSS, en appliquant les bonnes pratiques d'accessibilité, de responsive design et de séparation entre la logique métier et la couche de présentation.

# Phase 3 — Product Filters

Après avoir implémenté l'affichage des produits, j'ai défini les exigences relatives au filtrage côté serveur, notamment l'utilisation d'un menu déroulant pour les catégories, de boutons avec icônes pour le statut de stock, ainsi que les interactions avec l'API et les principes d'expérience utilisateur.

À partir de ces exigences, j'ai utilisé l'IA pour générer le composant `ProductFilters`, intégrer les contrôles de filtrage avec le `ProductService` et concevoir une interface moderne et responsive avec Tailwind CSS, tout en respectant la séparation entre la logique métier et la présentation.

# Phase 4 — Pagination

Après avoir implémenté l'affichage et le filtrage des produits, j'ai défini les exigences de la pagination côté serveur, notamment les contrôles de navigation, la synchronisation avec l'API, la conservation des filtres actifs et les bonnes pratiques d'expérience utilisateur.

À partir de ces exigences, j'ai utilisé l'IA pour générer le composant `Pagination`, intégrer la pagination avec le `ProductService` et concevoir une interface responsive avec Tailwind CSS, tout en respectant la séparation entre la logique métier et la couche de présentation.

# Phase 5 — Responsive Design

Après avoir implémenté les principales fonctionnalités du frontend, j'ai défini les exigences relatives au responsive design, notamment la vérification du rendu sur mobile, tablette et ordinateur, ainsi que l'utilisation des media queries de Tailwind CSS pour adapter l'interface aux différentes tailles d'écran.

À partir de ces exigences, j'ai utilisé l'IA pour vérifier et ajuster les composants existants en appliquant les bonnes pratiques de responsive design avec les breakpoints (`sm`, `md`, `lg`, `xl`) et, lorsque nécessaire, les media queries de Tailwind CSS, tout en préservant la logique métier de l'application.