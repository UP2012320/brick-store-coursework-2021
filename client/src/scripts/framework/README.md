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

### The bigger picture

Ultimately, the second solution would also require the creation of a virtual DOM and diffing.

This would mean one big change to the current way components are built.

Currently, upon calling build(), a component and all it's children are added directly to the DOM.

Now, a call to build() is not a call to add to the DOM but to enqueue its creation in the virtual DOM.
