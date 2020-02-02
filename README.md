# react-render-iff

![carbon (34)](https://user-images.githubusercontent.com/5778798/73144670-158b7100-4076-11ea-84e0-6b01bf1a42e1.png)

[![NPM](https://img.shields.io/npm/v/react-render-iff.svg)](https://www.npmjs.com/package/react-render-iff) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-render-iff
```

## Usage

Import as "RenderIf" and use as illustrated in the examples below. There are many more powerful usages that may not be illustrated, so take a look at the source code to see what more you can do.

```jsx
import React, { Component } from "react";

import RenderIf from "react-render-iff";

class Example extends Component {
  render() {
    const isTrue = 1 == 1;
    const isFalse = 1 == 2;

    const ExampleComp = props => {
      return <div {...props}>My wrapper comp stuff: {props.children}</div>;
    };

    return (
      <div>
        <h1>Example uses</h1>

        <div>
          <h2>Example 1:</h2>
          <p>
            Provide render conditions and render props.
            <br />
            <br />
            The "if" will succeed and render its render prop, "elseIfRender" as a
            plain Text node.
          </p>
          <RenderIf
            if={isTrue}
            render={"Hello, world. The expression evaluated to true 😎"}
            elseIf={() => 1 === 1}
            elseIfRender={() => "This will do!"}
            else={"Bye, world. Both expressions evaluated to false 😥"}
          />

          <div>
            <h3>🌴 The output of this example should be:</h3>
            Hello, world. The expression evaluated to true 😎
          </div>
        </div>

        <div>
          <h2>Example 2:</h2>
          <p>
            Render consitions and render props with a child node for the "if"
            condition.
            <br />
            <br />
            The "if" will succeed and render the child node.
          </p>
          <RenderIf
            if={() => isTrue}
            elseIf={() => 1 === 1}
            elseIfRender={() => "This will do!"}
            else={() => (
              <p>Bye, world. Both expressions evaluated to false 😥</p>
            )}
          >
            Hello, world. The expression evaluated to true 😎
          </RenderIf>

          <div>
            <h3>🌴 The output of this example should be:</h3>
            Hello, world. The expression evaluated to true 😎
          </div>
        </div>

        <div>
          <h2>Example 3:</h2>
          <p>
            The "elseIf" will succeed and render its "elseIfRender" prop, which
            happens to be an arrow function that will be evaluated.
          </p>
          <RenderIf
            if={() => isFalse}
            elseIf={() => 1 === 1}
            elseIfRender={() => "This will do!"}
            else={() => (
              <p>Bye, world. Both expressions evaluated to false 😥</p>
            )}
          >
            Hello, world. The expression evaluated to true 😎
          </RenderIf>

          <div>
            <h3>🌴 The output of this example should be:</h3>
            This will do!
          </div>
        </div>

        <div>
          <h2>Example 4:</h2>
          <p>
            You can use an arrow function to evaluate conditionals as well as
            for rendering.
            <br />
            <br />
            The "if" will succeed.
          </p>
          <RenderIf
            if={() => isTrue}
            elseIf={() => 1 === 1}
            elseIfRender={() => "This will do!"}
            else={() => (
              <p>Bye, world. Both expressions evaluated to false 😥</p>
            )}
          >
            <p>Hello, world.</p>
            <p>The expression evaluated to true 😎</p>
          </RenderIf>

          <div>
            <h3>🌴 The output of this example should be:</h3>

            <p>Hello, world.</p>
            <p>The expression evaluated to true 😎</p>
          </div>
        </div>

        <div>
          <h2>Example 5:</h2>
          <p>
            ✨ You can provide an "as" prop to render a parent element with the
            properties you provide.
            <br />
            <br />
            The "as" prop supports all HTML elements and any react components you
            provide to it. If you choose to provide a react component, your component
            must render the "props.children" that will be provided to it.
            <br />
            <br />
            The "elseIf" will succeed. "<RenderIf />" will be rendered as a "
            <section />" node with the provided classes and style, as well as any
            other allowed properties; the properties specific to "
            <RenderIf />" will be ignored when rendering.
          </p>

          <RenderIf
            as="section"
            className="u-textColorRed u-marginBottom10"
            style={{ background: "blue" }}
            title="Some cool stuff!"
            if={() => isFalse}
            elseIf={isTrue}
            elseIfRender={<p>This will do!</p>}
            else={() => (
              <p>Bye, world. Both expressions evaluated to false 😥</p>
            )}
          >
            <p>Hello, world.</p>
            <p>The expression evaluated to true 😎</p>
          </RenderIf>

          <div>
            <h3>🌴 The output of this example should be:</h3>

            <section
              class="u-textColorRed u-marginBottom10"
              style="background: blue;"
              title="Some cool stuff!"
            >
              <p>This will do!</p>
            </section>
          </div>
        </div>

        <div>
          <h2>Example 6:</h2>
          <p>
            Here, we provide a react component to the "as" prop. If you choose
            to provide a react component, your component must render the
            "props.children" that will be provided to it.
            <br />
            <br />
            The "else" will succeed. "<RenderIf />" will be rendered as a "
            <ExampleComp />" node with the provided classes and style, as well
            as any other allowed properties; the properties specific to "
            <RenderIf />" will be ignored when rendering.
          </p>

          <RenderIf
            as={ExampleComp}
            className="u-textColorRed u-marginBottom10"
            style={{ background: "blue" }}
            title="Some cool stuff!"
            if={() => isFalse}
            elseIf={isFalse}
            elseIfRender={<p>This will do!</p>}
            else={() => (
              <p>Bye, world. Both expressions evaluated to false 😥</p>
            )}
          >
            <p>Hello, world.</p>
            <p>The expression evaluated to true 😎</p>
          </RenderIf>

          <div>
            <h3>🌴 The output of this example should be:</h3>

            <div
              class="u-textColorRed u-marginBottom10"
              style="background: blue;"
              title="Some cool stuff!"
            >
              My wrapper comp stuff:
              <p>Bye, world. Both expressions evaluated to false 😥</p>
            </div>
          </div>
        </div>

        <div>
          <h2>Example 7:</h2>
          <p>
            ⚠️ You can specify whether to evaluate all conditions safely by
            providing a truthy value to the "safeEval" prop.
            <br />
            <br />
            If an error occurs while evaluating the conditions, a warning will be
            printed to the console with the value of "safeEval" as the key for debugging.
            This only works when the conditionals are provided as arrow functions,
            so keep that in mind.
            <br />
            <br />
            This can come in handy when rewriting your AngularJs app in React
            because AngularJs evaluates its "ng-if" and "ng-show" directives
            safely, which you would be accustomed to and thrown off by the lack
            their of when transitioning to React.
            <br />
            <br />
            The "if" condition's function throws an error for some reason, so it
            evaluates to false and we move on to the next condition. The "elseIf"
            condition evaluates to true.
          </p>
          <RenderIf
            as="header"
            if={() => {
              throw new Error(
                "Oh no! An error occurred while evaluating the if condition!"
              );
            }}
            elseIf={() => isTrue}
            elseIfRender={<p>This will do!</p>}
            else={() => (
              <p>Bye, world. Both expressions evaluated to false 😥</p>
            )}
            safeEval={"my-safe-eval-debug-key"}
          >
            <p>Hello, world.</p>
            <p>The expression evaluated to true 😎</p>
          </RenderIf>

          <div>
            <h3>🌴 The output of this example should be:</h3>

            <header>
              <p>This will do!</p>
            </header>
          </div>
        </div>
      </div>
    );
  }
}
```

## License

By [Lincoln W Daniel](https://lincolnwdaniel.com)

MIT © [Lwdthe1](https://github.com/Lwdthe1)
