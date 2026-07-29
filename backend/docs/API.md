# Documentation API — Produits

API REST pour la gestion et la consultation du catalogue produits.

**Format :** JSON  
**Encodage :** UTF-8

---

## GET /products

Liste les produits du catalogue avec **pagination** et **filtres optionnels**.

Un seul endpoint couvre l'ensemble des cas d'usage : liste paginée, filtrage par catégorie, par statut de stock, et combinaison des filtres. La pagination s'applique toujours **après** le filtrage.

### Requête

```
GET /products
```

#### Paramètres de requête (query string)

Tous les paramètres sont **optionnels**.

| Paramètre       | Type     | Défaut | Description |
|-----------------|----------|--------|-------------|
| `page`          | `number` | `1`    | Numéro de page (entier ≥ 1). |
| `limit`         | `number` | `10`   | Nombre d'éléments par page (entier ≥ 1). |
| `category`      | `string` | —      | Filtre par catégorie exacte (correspondance stricte, sensible à la casse). |
| `stock_status`  | `string` | —      | Filtre par statut de stock. Valeurs acceptées : `in_stock`, `low_stock`, `out_of_stock`. |
| `name`          | `string` | —      | Recherche partielle dans le nom du produit (insensible à la casse, max. 150 caractères). |

#### Règles de filtrage

- Les filtres `category` et `stock_status` peuvent être utilisés **individuellement** ou **ensemble**.
- Le filtre `name` peut être combiné avec les autres filtres.
- Les filtres sont appliqués en **ET** logique : un produit doit satisfaire tous les critères fournis.
- Si aucun produit ne correspond, la réponse est `200 OK` avec `data: []`, `total: 0` et `totalPages: 0`.

#### Catégories disponibles

Les catégories présentes dans le jeu de données :

| Catégorie       | Nombre de produits |
|-----------------|--------------------|
| `Electronics`   | 5                  |
| `Clothing`      | 5                  |
| `Home & Garden` | 5                  |
| `Sports`        | 4                  |
| `Books`         | 1                  |

> **Total du catalogue :** 20 produits.

#### Valeurs de `stock_status`

| Valeur           | Signification                          |
|------------------|----------------------------------------|
| `in_stock`       | Produit disponible en stock            |
| `low_stock`      | Stock faible                           |
| `out_of_stock`   | Produit en rupture de stock            |

### Réponse — 200 OK

Corps de type objet paginé :

```json
{
  "data": [
    {
      "id": 1,
      "name": "Sony WH-1000XM5 Wireless Headphones",
      "category": "Electronics",
      "price": 349.99,
      "stock_status": "in_stock"
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

#### Structure d'un produit (`data[]`)

| Champ           | Type     | Description |
|-----------------|----------|-------------|
| `id`            | `number` | Identifiant unique du produit. |
| `name`          | `string` | Nom du produit. |
| `category`      | `string` | Catégorie (ex. `Electronics`, `Clothing`, `Food`, etc.). |
| `price`         | `number` | Prix unitaire (décimal). |
| `stock_status`  | `string` | Statut de stock : `in_stock`, `low_stock` ou `out_of_stock`. |

#### Métadonnées de pagination

| Champ         | Type     | Description |
|---------------|----------|-------------|
| `total`       | `number` | Nombre total de produits **après filtrage**. |
| `page`        | `number` | Page courante demandée. |
| `limit`       | `number` | Taille de page demandée. |
| `totalPages`  | `number` | Nombre total de pages (`0` si `total` vaut `0`). |

### Réponse — 400 Bad Request

Renvoyée lorsque les paramètres de requête sont invalides (validation DTO).

```json
{
  "statusCode": 400,
  "timestamp": "2026-07-29T12:00:00.000Z",
  "path": "/products?page=-1",
  "message": ["page must not be less than 1"]
}
```

#### Cas d'erreur courants

| Situation | Code HTTP |
|-----------|-----------|
| `page` < 1 ou non numérique | `400` |
| `limit` < 1 ou non numérique | `400` |
| `stock_status` avec une valeur non autorisée | `400` |
| `name` dépassant 150 caractères | `400` |
| Paramètre inconnu (ex. `?foo=1`) | `400` |

---

## Exemples

### Liste paginée (valeurs par défaut)

```http
GET /products
```

Retourne la page 1 avec 10 produits sur 20 (`totalPages: 2`).

### Pagination personnalisée

```http
GET /products?page=2&limit=5
```

Retourne les produits 6 à 10 (5 éléments, page 2).

### Filtrer par catégorie

```http
GET /products?category=Electronics
```

Retourne les 5 produits de la catégorie `Electronics`. La pagination s'applique sur ce sous-ensemble.

### Filtrer par statut de stock

```http
GET /products?stock_status=in_stock
```

Retourne les 12 produits en stock.

### Combiner catégorie et statut de stock

```http
GET /products?category=Sports&stock_status=low_stock
```

Retourne les produits Sports en stock faible (ex. Peloton Bike+).

### Pagination avec filtres

```http
GET /products?category=Electronics&stock_status=in_stock&page=1&limit=5
```

Applique d'abord les filtres, puis pagine le résultat filtré.

### Recherche par nom (partielle, insensible à la casse)

```http
GET /products?name=phone
```

Retourne les produits dont le nom contient « phone » (ex. *Headphones*).

### Page hors limites

```http
GET /products?page=999&limit=10
```

Retourne `data: []` avec les métadonnées intactes (`total: 20`, `totalPages: 2`, `page: 999`).

---

## Notes techniques

- **Cache :** les réponses sont mises en cache en mémoire (TTL 5 minutes) par combinaison de paramètres. Deux requêtes identiques renvoient le même corps de réponse.
- **Validation :** les paramètres sont validés à la frontière HTTP via `class-validator`. Seuls les champs documentés ci-dessus sont acceptés.
- **Données :** catalogue statique en mémoire (`products.data.ts`), sans persistance base de données.
