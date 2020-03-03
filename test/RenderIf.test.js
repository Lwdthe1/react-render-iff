import React from "react";
import pjson from "../package.json";
import path from "path";
import renderer from "react-test-renderer";

// Test the root of the lib
const RenderIf = require(path.join(__dirname, "../", pjson.main)).default;

const isTrue = true;
const isFalse = false;

test("Example 1", () => {
  const component = renderer.create(
    <RenderIf
      if={isTrue}
      render={"Hello, world. The expression evaluated to true 😎"}
      elseIf={() => 1 === 1}
      elseIfRender={() => "This will do!"}
      else={"Bye, world. Both expressions evaluated to false 😥"}
    />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Example 2", () => {
  const component = renderer.create(
    <RenderIf
      if={() => isTrue}
      elseIf={() => 1 === 1}
      elseIfRender={() => "This will do!"}
      else={() => <p>Bye, world. Both expressions evaluated to false 😥</p>}
    >
      Hello, world. The expression evaluated to true 😎
    </RenderIf>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Example 3", () => {
  const component = renderer.create(
    <RenderIf
      if={() => isFalse}
      elseIf={() => 1 === 1}
      elseIfRender={() => "This will do!"}
      else={() => <p>Bye, world. Both expressions evaluated to false 😥</p>}
    >
      Hello, world. The expression evaluated to true 😎
    </RenderIf>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Example 4", () => {
  const component = renderer.create(
    <RenderIf
      if={() => isTrue}
      elseIf={() => 1 === 1}
      elseIfRender={() => "This will do!"}
      else={() => <p>Bye, world. Both expressions evaluated to false 😥</p>}
    >
      <p>Hello, world.</p>
      <p>The expression evaluated to true 😎</p>
    </RenderIf>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Example 5", () => {
  const component = renderer.create(
    <RenderIf
      as="section"
      className="u-textColorRed u-marginBottom10"
      style={{ background: "blue" }}
      title="Some cool stuff!"
      if={() => isFalse}
      elseIf={isTrue}
      elseIfRender={<p>This will do!</p>}
      else={() => <p>Bye, world. Both expressions evaluated to false 😥</p>}
    >
      <p>Hello, world.</p>
      <p>The expression evaluated to true 😎</p>
    </RenderIf>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Example 6: Should catch thrown error in if condition when safeEval provided as true", () => {
  const consoleWarnSpy = jest.spyOn(global.console, "warn");
  const component = renderer.create(
    <RenderIf
      as="header"
      if={() => {
        throw new Error(
          "Oh no! An error occurred while evaluating the if condition!"
        );
      }}
      elseIf={() => isTrue}
      elseIfRender={<p>This will do!</p>}
      else={() => <p>Bye, world. Both expressions evaluated to false 😥</p>}
      safeEval={"my-safe-eval-debug-key"}
    >
      <p>Hello, world.</p>
      <p>The expression evaluated to true 😎</p>
    </RenderIf>
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  expect(consoleWarnSpy.mock.calls[0][0]).toInclude(
    `[safeEval: my-safe-eval-debug-key] Error while evaluating "if" condition:`
  );
  expect(consoleWarnSpy.mock.calls[0][1]).toInclude(
    `Error: Oh no! An error occurred while evaluating the if condition!`
  );
  consoleWarnSpy.mockRestore();
});

test("Example 6: Should catch thrown error in elseIf condition when safeEval provided as true", () => {
  const consoleWarnSpy = jest.spyOn(global.console, "warn");
  const component = renderer.create(
    <RenderIf
      as="header"
      if={() => false}
      elseIf={() => {
        throw new Error(
          `Oh no! An error occurred while evaluating the "elseIf" condition!`
        );
      }}
      elseIfRender={<p>This will do!</p>}
      else={() => <p>Bye, world. Both expressions evaluated to false 😥</p>}
      safeEval={"my-safe-eval-debug-key"}
    >
      <p>Hello, world.</p>
      <p>The expression evaluated to true 😎</p>
    </RenderIf>
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  expect(consoleWarnSpy.mock.calls[0][0]).toInclude(
    `[safeEval: my-safe-eval-debug-key] Error while evaluating "elseIf" condition:`
  );
  expect(consoleWarnSpy.mock.calls[0][1]).toInclude(
    `Error: Oh no! An error occurred while evaluating the "elseIf" condition!`
  );
  consoleWarnSpy.mockRestore();
});

test("Example 6: Should catch thrown error in render render-prop when safeEval provided as true", () => {
  const consoleWarnSpy = jest.spyOn(global.console, "warn");
  const component = renderer.create(
    <RenderIf
      as="header"
      if={() => true}
      elseIf={() => false}
      elseIfRender={<p>This will do!</p>}
      else={() => <p>Bye, world. Both expressions evaluated to false 😥</p>}
      safeEval={"my-safe-eval-debug-key"}
      render={() => {
        <div>{undefinedField123.hello}</div>;
      }}
    />
  );

  expect(consoleWarnSpy.mock.calls[0][0]).toInclude(
    `[safeEval: my-safe-eval-debug-key] Error while evaluating "render" prop:`
  );
  expect(consoleWarnSpy.mock.calls[0][1]).toInclude(
    `ReferenceError: undefinedField123 is not defined`
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  consoleWarnSpy.mockRestore();
});

test("Example 6: Should catch thrown error in elseIfRender render-prop when safeEval provided as true", () => {
  const consoleWarnSpy = jest.spyOn(global.console, "warn");
  const component = renderer.create(
    <RenderIf
      as="header"
      if={() => false}
      elseIf={() => true}
      elseIfRender={() => {
        <div>{undefinedField123.hello}</div>;
      }}
      else={() => <p>Bye, world. Both expressions evaluated to false 😥</p>}
      safeEval={"my-safe-eval-debug-key"}
      render={() => "Hello, world!"}
    />
  );

  expect(consoleWarnSpy.mock.calls[0][0]).toInclude(
    `[safeEval: my-safe-eval-debug-key] Error while evaluating "elseIfRender" prop:`
  );
  expect(consoleWarnSpy.mock.calls[0][1]).toInclude(
    `ReferenceError: undefinedField123 is not defined`
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  consoleWarnSpy.mockRestore();
});

test("Example 6: Should catch thrown error in else render-prop when safeEval provided as true", () => {
  const consoleWarnSpy = jest.spyOn(global.console, "warn");
  const component = renderer.create(
    <RenderIf
      as="header"
      if={() => false}
      elseIf={() => false}
      elseIfRender={() => "Cool world ..."}
      else={() => {
        <div>{undefinedField123.hello}</div>;
      }}
      safeEval={"my-safe-eval-debug-key"}
      render={() => "Hello, world!"}
    />
  );

  expect(consoleWarnSpy.mock.calls[0][0]).toInclude(
    `[safeEval: my-safe-eval-debug-key] Error while evaluating "else" prop:`
  );
  expect(consoleWarnSpy.mock.calls[0][1]).toInclude(
    `ReferenceError: undefinedField123 is not defined`
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  consoleWarnSpy.mockRestore();
});

test("Should fail when error thrown without safeEval", () => {
  let thrownError;
  let component;
  try {
    component = renderer.create(
      <RenderIf
        as="header"
        if={() => {
          throw new Error(
            "Oh no! An error occurred while evaluating the if condition!"
          );
        }}
        elseIf={() => isTrue}
        elseIfRender={<p>This will do!</p>}
        else={() => <p>Bye, world. Both expressions evaluated to false 😥</p>}
      >
        <p>Hello, world.</p>
        <p>The expression evaluated to true 😎</p>
      </RenderIf>
    );
  } catch (err) {
    thrownError = err;
  }

  expect(thrownError.message).toBe(
    "Oh no! An error occurred while evaluating the if condition!"
  );
  expect(component).toBeNil();
});

test("Render 'as' prop when provided as string", () => {
  const component = renderer.create(
    <RenderIf
      as="h7"
      className="u-textColorRed u-marginBottom10"
      style={{ background: "blue" }}
      title="Some cool stuff!"
      if={() => isFalse}
      elseIf={isTrue}
      elseIfRender={<p>This will do!</p>}
      else={() => <p>Bye, world. Both expressions evaluated to false 😥</p>}
    >
      <p>Hello, world.</p>
      <p>The expression evaluated to true 😎</p>
    </RenderIf>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Render 'as' prop when provided a React functional component", () => {
  const CompA = props => {
    return <div {...props}>CompA stuff {props.children}</div>;
  };

  const component = renderer.create(
    <RenderIf
      as={CompA}
      className="u-textColorRed u-marginBottom10"
      style={{ background: "blue" }}
      title="Some cool stuff!"
      if={() => isFalse}
      elseIf={isFalse}
      elseIfRender={<p>This will do!</p>}
      else={() => <p>Bye, world. Both expressions evaluated to false 😥</p>}
    >
      <p>Hello, world.</p>
      <p>The expression evaluated to true 😎</p>
    </RenderIf>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
