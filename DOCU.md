# Project Documentation

This is a document that explains and justifies notable features/functionality of my project.

## Notes

I was part way through implementing an order view page and such before realizing that completing this document was a
better use of time, as such the functionality is not completed and any pages related to viewing orders do not work.

API documentation can be viewed at http://localhost:8080/documenation

A staff account has been created with the following details

```
email: up2012320@myport.ac.uk
password: Admin12345
```

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

* [client/src/scripts/htmlX.ts](client/src/scripts/htmlX.ts)

## hookCallerStateManagement

### What is it?

A key aspect of modern front-end development is state management. Being able to store data bound to a component and
having your application update in response to state changes. hookCallerStateManager is a class employed by stateful
hooks to handle underlying state.

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

On of this foundation, I was able to write standard React hooks such useRef, useState and useEffect.

### Why did I add this?

Personally, development is agonizing without some form of state management.

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

* [client/src/scripts/diffing.ts](client/src/scripts/diffing.ts)
