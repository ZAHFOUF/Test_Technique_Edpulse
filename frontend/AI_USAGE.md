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