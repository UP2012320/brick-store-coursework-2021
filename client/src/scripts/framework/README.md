## The Plan

### What does a component need?

1. To be able to keep stateful variables that trigger a re-render
2. To be able to keep stateful variables that don't trigger a re-render
3. To be able to register lifecycle hooks in a useEffect() way
4. To be able to track and potentially persist instances of imported components
5. To be able to receive props from a parent

### How do we achieve these things?

These requirements must not be handled directly by the component instance itself but by a global store that manages
state.

This global store needs a way to identify a component instance to be able to map its state to it.

This cannot be done by the instantiation of a component since that instantiation will be called on every render and the
objects' equality will be false.

The component has to be instantiated, then afterwards an identifier must be created.

The first solution is to require a component to be registered on every instance with a unique human provided ID.

I don't like having to do this everytime and would prefer to avoid it.

The second solution is to for an unintelligent index based system accompanied by comparisons with sibling nodes.

This would work in the following way.

#### Initialise the component instances

```typescript
const component = new Component();
const component2 = new Component();

return [
  component,
  component2
];
```

* Component would be assigned the index 0 and component2 the index of 1.
* This order does not follow the order of instantiation but the order in the return

#### Added to the global store

The components would then be indexed by and with the following.

* Order index as the key
* The value would be an object containing all the various states

#### Accessing the global store

If the order of the elements in the return does not change, nothing happens and the state data is returned.

But if the order has changed then two things need to happen.

1. 
