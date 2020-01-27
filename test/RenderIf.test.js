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

test("Example 6: Should catch thrown error", () => {
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
    `[safeEval: my-safe-eval-debug-key] Error while evaluating if-condition:`
  );
  expect(consoleWarnSpy.mock.calls[0][1]).toInclude(
    `Error: Oh no! An error occurred while evaluating the if condition!`
  );
  consoleWarnSpy.mockRestore();
});

test("Should fail when error thrown without safeEval", () => {
  let thrownError;
  try {
    renderer.create(
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
});
