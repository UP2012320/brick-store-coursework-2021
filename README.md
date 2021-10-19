## Plan

### Spec Requirements

* Inventory of items for sale and stock levels
* Shopping cart
* Adjustable quantity of purchases in shopping cart
* Simulated checkout

### Front-end

* Display available products
* Display product page with details
* Display stock levels of products
* Display shopping cart page with added items
* Display payment simulation

### API

* Retrieve product lists with stock level from database
* Upon checking out, communicate with database to update stock levels

### Back-end

* Serve SPA
* /api controller that provides interface for communicating with database

### Tooling

* Front-end - TypeScript/SCSS/CSS Grid/Flexbox
* API - JSON REST API
* Back-end - TypeScript/Fastify/PostgreSQL

### Implementation Flow

* Design and implement skeleton layout for front-end
* Use mock-data to verify front-end design layout
* Setup database with tables
* Implement /api controller for interacting with database
* Implement client-side javascript to communicate with the API
* Render front-end skeleton layout with data retrieved from the API
* Improve and further design and compatibility with other screen sizes
