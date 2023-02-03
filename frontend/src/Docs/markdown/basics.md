# Basics

This section gives an overview of the basic ideas behind the language. For a starter project, see the Getting Started tutorial.

## Principles

This system was designed to alleviate some problems with the current way machine learning models are developed. In response to those problems, here are some principles this project tries to adhere to:

### Transparency

The goal is to hide as little as possible. All of the computations a model makes during inference should be clear. What is a parameter and what's not should be clear. What's ultimately abstracted away is restricted to the lowest level optimizations undergone during inference.

### Coherent Organization

Any logically coherent element of a model should be organized together. The code should be self-contained in one area of a file so that it is easily accessible. By signaling that certain computations exist as a part of a "block", you tell other people reading your program how to think about your model.

### Portability

Models should be able to be reused in parts of other people's programs in a self-contained way. Those models should be easily accessible in other frameworks and runtime environments.