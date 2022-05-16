# Introduction

### Run Steps

* Due to some Auth0 COOP problems, I'm having to run my backend server separately, with my client running on a webpack
  dev server. Auth0 has been a... *delight* to work with
* `npm run start`
* Access the website at http://localhost:8080/
* Look in the submission folder for transpiled JS
* SCSS files are still located in the original client folder

I was part way through implementing an order view page and such before realizing that completing this document was a
better use of time, as such the functionality is not completed and any pages related to viewing orders do not work.

API documentation can be viewed at http://localhost:8085/documentation

A staff account has been created with the following details

```
email: up2012320@myport.ac.uk
password: Admin12345
```

Login to this account for access to a staff management panel

I created some re-designs using Figma, though I never had to time to implement them

[Figma Project](https://www.figma.com/file/NwzdGfFro9puyR8tzCCOyS/Brick-Store-Coursework?node-id=0%3A1)

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
* Testing - Jest

### Implementation Flow

* Design and implement skeleton layout for front-end
* Use mock-data to verify front-end design layout
* Setup database with tables
* Implement /api controller for interacting with database
* Implement client-side javascript to communicate with the API
* Render front-end skeleton layout with data retrieved from the API
* Improve and further design and compatibility with other screen sizes

# Features

The following features are in order of what I think is most important, if you're low on time please skip later ones.

## htmlX

### What is it?

htmlX is a template literal function that enables me to write the final html structure of a component in a far more
readable and intuitive way. It replaces the consecutive and hard to parse .append() statements.

### Why did I add this?

The best way to explain why is with an example.

Below is an example using .append()

```ts
rightSectionContainer.append(search);

leftSectionContainer.append(sortBy, filterBy);

mainRow.append(leftSectionContainer, rightSectionContainer);

container.append(mainRow, createFilterBarOptions(filterToggle));

return container;
```

And below is the same code using htmlX

```ts
  return htmlx`
    <${container}>
      <${mainRow}>
        <${leftSectionContainer}>
          <${sortBy}/>
          <${filterBy}/>
        </leftSectionContainer>
        <${rightSectionContainer}>
          <${search}/>
        </rightSectionContainer>
      </mainRow>
      <${createFilterBarOptions(filterToggle)}/>
    </container>
  `;
```

For me, the second is easier and faster to read in terms of reading the tree structure. You can immediately look at it
and figure out where some new element should be inserted. Whereas with the first example you'd have to give it a quick
read from returned element, container, and work backwards to figure out what element contains what children etc.

You could alleviate this issue with the first example by splitting components into smaller components so there isn't too
much nesting in any one component. But htmlX accommodates these larger grouping of elements whilst maintaining the
readability.

### Where to look

* [submission/client/scripts/htmlX.js](submission/client/scripts/htmlX.js)

## hookCallerStateManagement

### What is it?

hookCallerStateManager is a class employed by stateful hooks to handle underlying state.

The functionality is quite simple in practice. It works based off my research into React stateful hooks. Essentially, it
is just a set of key-value pairs, with the key being the index of each caller. These key-value pairs are then grouped
together by a component key.

```ts
const [age, setAge] = useState('some-key', 20);
const [name, setName] = useState('some-key', 'Bob');
```

In the above example, "some-key" is the component key. The key for the age state would be 0, name would be 1. It simply
increments based off the call order. This is why with React hooks you're not allowed to change the order certain hooks
are declared in.

### Why did I add this?

Personally, development is agonizing without some form of state management. Having to manually update elements everytime
data changes is tedious and inefficient. So utilizing this underlying state management class, I was able to implement
standard React hooks such useRef, useState and useEffect.

The utilization of these hooks is near identical to how you would with React.

### Where to look

* [submission/client/hooks/hookCallerStateManager.js](submission/client/scripts/hooks/hookCallerStateManager.js)
* [submission/client/hooks/useState.js](submission/client/scripts/hooks/useState.js)
* [submission/client/hooks/useEffect.js](submission/client/scripts/hooks/useEffect.js)
* [submission/client/hooks/useRef.js](submission/client/scripts/hooks/useRef.js)

## createRouter

### What is it?

createRouter is a function used for mapping and declaring url routes in the context of an SPA. It allows me to map
certain url paths and path parameters to identifiers which I can then use to easily decide what components to render.

Additionally, it also allows me to parse and map the aforementioned path parameters to a record using a specified
identifier for each path parameter. An example path would be `product/:slug`, here `:slug` is a path parameter, denoted
by the `:`. It also returns any query string arguments, parsed via URLSearchParams, for convenience.

### Why did I add this?

Since I'm designing the storefront as an SPA, I needed a way to do client side routing. Initially I simply matched a
part of the `window.location` in a switch statement. But I thought about how I could extract more utility from this and
when I realised I'm going to be parsing REST and path arguments from the url I thought I may as well centralise that
functionality in a common function.

### Where to look

* [submission/client/scripts/createRouter.js](submission/client/scripts/createRouter.js)

### Notes

I eventually moved away from this personal solution to a library called morphdom. This was because it had to ability to
add hooks. However, in terms of functionality my function and the library are near identical.

## diffing

### What is it?

As the title suggests, this is a diffing function for comparing and merging two DOM trees. It takes two DOM trees,
iterates over them via a breadth-first traversal, compares the DOM nodes and decides what to do. It can either, do
nothing, modify a DOM node (i.e. The classlist changed), replace an entire node with another or delete a node.

### Why did I add this?

Before implementing this I was simply replacing the entire DOM tree with a new one everytime any component needed to
update. Though this was inefficient it was fine for a simple project like this. However, I encountered issues when I
tried to simply modify an elements classlist to trigger a transition. Since all elements were destroyed and re-created
this wouldn't work. So, I decided, as a side objective, to implement a function to only modify the DOM nodes that need
to be.

### Where to look

* [submission/client/scripts/diffing.ts](submission/client/scripts/diffing.js)

# Unfinished Work and Reflection

* I would've liked to have finished the orders view, allowing users who are signed up to see a list of their orders.
  Users who aren't signed up would be prompted with an input box asking for their email and order id.
* I was meant to add some form of homepage but prioritized other features.
* The way I modeled an inventory item was somewhat flawed. A particular brick could have multiple colours, yet my model
  requires an individual product for each colour. A much better system would've been to have a brick type that then has
  subtypes based on colours and perhaps other specifications I haven't even thought of.
* Early on in development I created some awful SQL functions (Location
  at [server/sql/functions.sql](server/sql/functions.sql)). These are absolutely unmaintainable.
* I didn't implement a mobile friendly view for the staff management panel, and it is basically unusable on mobile.
* I should've added a quantity selector to the product page, instead of just having it in the cart page.
* There is a noticeable progression and improvement in my styling proficiency over time. I would've liked to have gone
  back and tweaked my earlier styling applying what I'd learned.
* My ability to design re-usable components and such also increased over the course of the project, which I would've
  liked to have applied in hindsight (Common buttons, containers etc.).
* I would've liked to add some unit tests for key functionality.
