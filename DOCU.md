# Project Documentation

This is a document that explains and justifies notable features/functionality of my project.

For a more technical overview, please refer to the comments left in the code of the following features/functionality.
There will be a list of relevant files for each item, so you'll know where to look.

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

* [client/src/scripts/htmlX.ts](client/src/scripts/htmlX.ts)

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

* [client/src/scripts/createRouter.ts](client/src/scripts/createRouter.ts)

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

* [client/src/scripts/diffing.ts](client/src/scripts/diffing.ts)
