# TSDoc and Code Commenting

## 1. TSDoc

* Write concise, meaningful TSDoc for public/exported APIs and non-obvious behavior.
* Explain **why** something exists when the reason is not obvious from the code; don't merely restate the implementation.
* Use tags such as `@param`, `@returns`, and `@throws` only when they provide useful information.
* For functions/components with multiple props or parameters, document each prop/parameter with its own `@param` tag. Do not use a single `@param props` tag to encompass multiple props.
* Never invent behavior, constraints, or guarantees not supported by the code.

## 2. Inline Comments

* Add inline comments only when they clarify non-obvious intent, reasoning, or behavior.
* Prefer explaining **why** over **what** the code is doing.
* Avoid comments that simply restate the code.
* Keep comments concise and update them when the associated code changes.

## 3. Complex Algorithm Explanations

* For complex algorithms or non-obvious logic, explain the key reasoning, invariants, assumptions, or trade-offs.
* Focus on the concepts needed to understand or safely modify the algorithm rather than describing every line.
* Keep explanations concise and colocated with the relevant code.
