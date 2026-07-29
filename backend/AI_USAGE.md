## Model Used
- Opus 4.7 high performance

## Préparation

Avant de démarrer le développement, j'ai défini les contraintes techniques, les règles de développement et les bonnes pratiques que je souhaitais appliquer au projet.

À partir de ces exigences et de mes propres idées, j'ai utilisé l'IA pour générer un fichier `PROJECT_RULES.md`. 

Ce fichier a servi de contexte permanent pour l'assistant IA afin de lui fournir les règles du projet dès le départ, d'assurer la cohérence des générations de code et d'éviter de répéter les mêmes instructions à chaque interaction.

## Phase 1 – Initialisation de l'architecture

### Ce que j'ai demandé à Cursor (Plan Mode)

- Générer l'architecture initiale du backend NestJS à partir de l'architecture que j'avais définie.

src/
│
├── app/
│   └── products/
│       ├── products.module.ts
│       ├── products.controller.ts
│       ├── products.service.ts
│       └── README.md
│
├── cache/
│   └── README.md
│
├── common/
│   ├── filters/
│   └── README.md
│
├── app.module.ts
└── main.ts

## Products Module

Generate valid and minimal:

- ProductsModule
- ProductsController
- ProductsService

The project must compile successfully.

## Documentation

Create a `README.md` inside:

- app/products/
- cache/
- common/

- Créer uniquement la structure du projet, les composants NestJS minimaux (`ProductsModule`, `ProductsController`, `ProductsService`) ainsi que la documentation (`README.md`) des principaux dossiers.

### Comment j'ai utilisé les suggestions

- J'ai revu et validé le plan d'implémentation généré (`phase_1_backend_init_a2824e9c.plan.md`) avant le début du développement.
- J'ai utilisé ce plan comme feuille de route pour l'implémentation de la phase 1.
- J'ai accepté la suppression des fichiers de scaffolding générés par défaut par NestJS (`app.controller.ts`, `app.service.ts` et `app.controller.spec.ts`) afin d'adopter une architecture orientée fonctionnalités.

### Ce que j'ai rejeté

- Aucune suggestion n'a été rejetée lors de cette phase.

## Phase 2 – Modèle de données des produits

### Ce que j'ai demandé à Cursor (Plan Mode)

- Générer le code de la phase 2 à partir de l'architecture que j'avais définie.
- Implémenter le modèle de données (`Product`), l'énumération `StockStatus` et la source de données en mémoire conformément aux exigences du sujet.
- Générer pour la phase 2 le fichier `products.data.ts` avec les données de produits initiales ( 20 produits )

### Comment j'ai utilisé les suggestions

- J'ai validé le plan d'implémentation généré avant le développement.
- J'ai conservé l'architecture que j'avais proposée, avec les dossiers :
  - `data/`
  - `interfaces/`
  - `enums/`
- J'ai utilisé le plan comme guide pour l'implémentation de cette phase.


### Ce que j'ai rejeté

- Aucune suggestion n'a été rejetée lors de cette phase.


## Phase 3 – Query DTO

### Ce que j'ai demandé à Cursor (Plan Mode)

- Générer le DTO de validation des paramètres de requête pour l'endpoint `GET /products`.
- Produire un plan d'implémentation avant le développement.

### Comment j'ai utilisé les suggestions

- J'ai revu et validé le plan d'implémentation généré (`phase_3_query_dto_cc48735a.plan.md`) avant le développement.
- Après validation du plan, j'ai demandé une amélioration afin d'ajouter des contraintes de longueur maximale pour les champs texte (`category`) en complément de la validation des types et des paramètres numériques.
- J'ai utilisé le plan validé comme guide pour l'implémentation du DTO.

### Ce que j'ai rejeté

- Aucune suggestion n'a été rejetée lors de cette phase.

## Phase 4 – Products Service

### Ce que j'ai demandé à Cursor (Plan Mode)

- Générer le plan d'implémentation de la logique métier du `ProductsService`.
- Implémenter le filtrage et la pagination des produits en mémoire.

### Comment j'ai utilisé les suggestions

- J'ai revu et validé le plan d'implémentation généré (`phase_4_products_service_449b06c5.plan.md`) avant le développement.
- Après validation du plan, j'ai demandé une modification afin de retirer les blocs `try/catch` et la gestion des exceptions, car cette responsabilité est traitée dans une phase dédiée (`Exception Handling`).
- J'ai utilisé le plan mis à jour comme guide pour l'implémentation du service.

### Ce que j'ai rejeté

- J'ai rejeté l'ajout de blocs `try/catch` et de la gestion des exceptions dans le `ProductsService`, afin de conserver une séparation claire des responsabilités et de traiter les erreurs dans la phase dédiée aux filtres d'exceptions.


## Phase 5 – Products Controller

### Ce que j'ai demandé à Cursor (Plan Mode)

- Générer le plan d'implémentation du `ProductsController`.
- Implémenter l'endpoint `GET /products` en déléguant toute la logique métier au `ProductsService`.

### Comment j'ai utilisé les suggestions

- J'ai revu et validé le plan d'implémentation généré (`phase_5_products_controller_9476d412.plan.md`) avant le développement.
- Le plan suggérait d'activer le `ValidationPipe` global. J'ai choisi de reporter cette configuration à une phase dédiée (`Exception Handling`) afin de conserver une séparation claire des responsabilités.
- J'ai utilisé le reste du plan comme guide pour implémenter le contrôleur.

### Ce que j'ai rejeté

- Je n'ai pas activé le `ValidationPipe` durant cette phase. Cette configuration sera réalisée dans la phase dédiée à la validation globale et à la gestion des exceptions.

## Phase 6 – Exception Handling

### Ce que j'ai demandé à Cursor (Plan Mode)

- Générer le plan d'implémentation de la gestion globale des exceptions et de la validation des requêtes.
- Configurer un `ValidationPipe` global et un `HttpExceptionFilter` conformément aux bonnes pratiques NestJS.

### Comment j'ai utilisé les suggestions

- J'ai revu et validé le plan d'implémentation généré (`phase_6_exception_handling_a1be69f4.plan.md`) avant le développement.
- J'ai utilisé le plan validé comme guide pour implémenter le `ValidationPipe` global et le `HttpExceptionFilter`.
- J'ai centralisé la validation et la gestion des erreurs dans `main.ts` et `common/filters`, sans modifier la logique métier du contrôleur ou du service.

### Ce que j'ai rejeté

- Aucune suggestion n'a été rejetée lors de cette phase.


## Phase 7 – In-Memory Cache

### Ce que j'ai demandé à Cursor (Plan Mode)

- Générer le plan d'implémentation d'un service de cache en mémoire.
- Intégrer le `CacheService` au `ProductsService` afin d'optimiser les requêtes répétées.
- Ajouter des journaux (`Logger`) pour distinguer explicitement les événements **Cache HIT**, **Cache MISS**, **Cache SET** et **Cache EXPIRED** afin de faciliter la vérification et le débogage du fonctionnement du cache.
- Mettre en place un mécanisme de nettoyage automatique des entrées expirées à l'aide d'un intervalle configurable (`setInterval`), en complément de la vérification du TTL lors de l'accès au cache.

### Comment j'ai utilisé les suggestions

- J'ai revu et validé le plan d'implémentation généré avant le développement.
- J'ai utilisé le plan validé comme guide pour implémenter le `CacheService` et son intégration dans le `ProductsService`.

### Ce que j'ai rejeté

- Aucune suggestion n'a été rejetée lors de cette phase.

Example of logs:

[Nest] 7040  - 29/07/2026 05:50:03   DEBUG [CacheService] MISS products:findAll:{"page":1,"limit":10,"category":null,"stock_status":null}
[Nest] 7040  - 29/07/2026 05:50:03   DEBUG [CacheService] SET products:findAll:{"page":1,"limit":10,"category":null,"stock_status":null}
[Nest] 7040  - 29/07/2026 05:50:10   DEBUG [CacheService] HIT products:findAll:{"page":1,"limit":10,"category":null,"stock_status":null}


## # Update — Add Product Name Filtering

### Ce que j'ai demandé à Cursor (Agent Mode)

- Ajouter le paramètre `name` au `ProductQueryDto` avec les validations appropriées.
- Implémenter un filtrage partiel insensible à la casse (`includes()` + `toLowerCase()`) dans le `ProductsService`.
- Mettre à jour la génération de la clé du cache afin d'inclure le paramètre `name` et garantir qu'une entrée de cache corresponde à une combinaison unique de paramètres de recherche.

### Comment j'ai utilisé les suggestions

- J'ai revu et validé le plan proposé avant l'implémentation.
- J'ai utilisé le plan comme guide pour étendre le DTO, le service et la logique de génération de la clé du cache, tout en conservant l'architecture existante.

### Ce que j'ai rejeté

- Aucune suggestion n'a été rejetée lors de cette modification.


## Phase 9 – End-to-End Testing

### Ce que j'ai demandé à Cursor (Plan Mode)

- Générer un plan pour mettre en place des tests End-to-End (E2E) avec Jest et Supertest.
- Configurer le projet afin de prendre en charge l'exécution des tests E2E (`npm run test:e2e`).
- Ajouter les dépendances et les fichiers de configuration nécessaires si ceux-ci n'étaient pas déjà présents.
- Générer une suite de tests couvrant les principales fonctionnalités de l'API : récupération des produits, pagination, filtres, validation des requêtes et comportement du cache.

### Comment j'ai utilisé les suggestions

- J'ai revu et validé le plan proposé avant l'implémentation.
- J'ai utilisé le plan comme guide pour configurer l'environnement de tests et créer une suite de tests E2E vérifiant le comportement de l'application à travers les endpoints HTTP.

### Ce que j'ai rejeté

- Aucune suggestion n'a été rejetée lors de cette phase.