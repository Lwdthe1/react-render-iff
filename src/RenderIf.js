/* eslint-disable no-console */
import React from "react";
import PropTypes from "prop-types";

function isFunc(functionToCheck) {
  if (!functionToCheck) return false;
  const getType = {};
  const toString = getType.toString.call(functionToCheck);

  return (
    toString === "[object Function]" ||
    toString === "[object AsyncFunction]" ||
    false
  );
}

const evaluateValue = (prop, data) =>
  prop && isFunc(prop) ? prop(data) : prop;

/**
 * A helper component to render a child component
 * conditionally.
 *
 * @param {{
		if: Boolean | (utils) => Boolean,
		ifFirst: Array<Number, Array>,
		ifLast: Array<Number, Array>,
		if2ndToLast: Array<Number, Array>,
		elseIf: Boolean | (utils) => Boolean
		else: Component | (utils) => Compoent,
		children: Component,
		render: Component | () => Component,
		elseIfRender: Component | () => Component,
		as: ?String,
		safeEval: ?String|Boolean,
 * }} props
 */
const RenderIf = React.forwardRef(function RenderIf(props, refToForward) {
  let ifCondition;
  const elseIfCondition = props.elseIf;

  const checkIsAtPositionInArray = (check, couple) => {
    const checkFirst = check === "first";
    const checkLast = check === "last";
    const check2ndToLast = check === "2ndToLast";

    // Create the if condition from the provided index and array
    const indexOfIndex = !Number.isNaN(couple[0])
      ? 0
      : !Number.isNaN(couple[1])
      ? 1
      : undefined;

    const index =
      indexOfIndex !== undefined
        ? couple[indexOfIndex === 0 ? 0 : 1]
        : undefined;

    const arr = couple[indexOfIndex === 0 ? 1 : 0];

    if (index === undefined) {
      console.warn(
        "Should always provide an index for ifFirst or ifLast check."
      );
    }

    if (checkFirst && index !== undefined) {
      return index === 0;
    }

    if (!arr) {
      console.warn("Should always provide an array for position check");
      // Default to ifLast=true
      return true;
    }

    if (checkLast) {
      return index === arr.length - 1;
    }

    if (check2ndToLast) {
      return index === arr.length - 2;
    }
    return false;
  };

  const mutuallyExclusiveIfProps = ["if", "ifFirst", "ifLast", "if2ndToLast"];
  const providedMutuallyExclusiveIfProps = mutuallyExclusiveIfProps.filter(
    key => props[key] !== undefined
  );

  const hasAnIfConditionProps = mutuallyExclusiveIfProps.some(key => {
    return Object.keys(props).includes(key);
  });

  if (providedMutuallyExclusiveIfProps.length > 1) {
    console.warn(
      "You've provided all of the following top-level conditional props. You should only provide one of these props to avoid unexpected consequences.\n\t",
      JSON.stringify(providedMutuallyExclusiveIfProps)
    );
  }

  const getArrayProp = () => props.ifFirst || props.ifLast || props.if2ndToLast;
  const cbData = {
    checkIsFirst: couple =>
      checkIsAtPositionInArray("first", couple || getArrayProp()),
    checkIsLast: couple =>
      checkIsAtPositionInArray("last", couple || getArrayProp()),
    checkIs2ndToLast: couple =>
      checkIsAtPositionInArray("2ndToLast", couple || getArrayProp())
  };

  const renderResult = v => {
    if (props.as) {
      const wrapperProps = { ...props };
      if (refToForward) {
        wrapperProps.ref = refToForward;
      }
      delete wrapperProps.if;
      delete wrapperProps.ifFirst;
      delete wrapperProps.ifLast;
      delete wrapperProps.if2ndToLast;
      delete wrapperProps.else;
      delete wrapperProps.elseIf;
      delete wrapperProps.elseIfRender;
      delete wrapperProps.as;
      delete wrapperProps.debugKey;
      delete wrapperProps.safeEval;

      switch (props.as) {
        case "span":
          return <span {...wrapperProps}>{v}</span>;
        case "strong":
          return <strong {...wrapperProps}>{v}</strong>;
        case "i":
          return <i {...wrapperProps}>{v}</i>;
        case "code":
          return <code {...wrapperProps}>{v}</code>;
        case "pre":
          return <pre {...wrapperProps}>{v}</pre>;
        case "a":
          return <a {...wrapperProps}>{v}</a>;
        case "button":
          return <button {...wrapperProps}>{v}</button>;
        case "div":
          return <div {...wrapperProps}>{v}</div>;
        case "p":
          return <p {...wrapperProps}>{v}</p>;
        case "h1":
          return <h1 {...wrapperProps}>{v}</h1>;
        case "h2":
          return <h2 {...wrapperProps}>{v}</h2>;
        case "h3":
          return <h3 {...wrapperProps}>{v}</h3>;
        case "h4":
          return <h4 {...wrapperProps}>{v}</h4>;
        case "h5":
          return <h5 {...wrapperProps}>{v}</h5>;
        case "h6":
          return <h6 {...wrapperProps}>{v}</h6>;
        case "img":
          return <img {...wrapperProps} />;
        case "form":
          return <form {...wrapperProps}>{v}</form>;
        case "input":
          return <input {...wrapperProps} />;
        case "textarea":
          return <textarea {...wrapperProps}>{v}</textarea>;
        case "select":
          return <select {...wrapperProps}>{v}</select>;
        case "option":
          return <option {...wrapperProps}>{v}</option>;
        case "li":
          return <li {...wrapperProps}>{v}</li>;
        case "ul":
          return <ul {...wrapperProps}>{v}</ul>;
        case "header":
          return <header {...wrapperProps}>{v}</header>;
        case "section":
          return <section {...wrapperProps}>{v}</section>;
        case "main":
          return <main {...wrapperProps}>{v}</main>;
        default:
          console.warn(
            "That prop.as is not recognized. Please provide a primitive HTML element name or none at all:",
            props.as
          );
      }
    } else {
      return v;
    }
  };

  if (
    props.ifFirst !== undefined ||
    props.ifLast !== undefined ||
    props.if2ndToLast
  ) {
    if (props.ifFirst) {
      ifCondition = cbData.checkIsFirst(props.ifFirst);
    } else if (props.ifLast) {
      ifCondition = cbData.checkIsLast(props.ifLast);
    } else if (props.if2ndToLast) {
      ifCondition = cbData.checkIs2ndToLast(props.if2ndToLast);
    }
  } else {
    ifCondition = props.if;
  }

  if (ifCondition === undefined && !hasAnIfConditionProps) {
    console.warn(
      `Should provide props.if\n${
        props.debugKey
          ? `Debug key: ${props.debugKey}. ${Object.keys(props)}`
          : ""
      }`
    );
  }

  if (props.elseIf !== undefined && !props.elseIfRender) {
    console.warn(
      "You provided props.elseIf without a corresponding props.elseIfRender. Nothing will be rendered if this condition evaluates to true"
    );
  }

  // Evaluate if condition
  let evaluatedIfCondition;
  try {
    evaluatedIfCondition = evaluateValue(ifCondition, cbData);
  } catch (err) {
    if (props.safeEval) {
      console.warn(
        `[safeEval: ${props.safeEval}] Error while evaluating if-condition:`,
        err.stack
      );
    } else {
      throw err;
    }
  }

  if (evaluatedIfCondition) {
    if (props.render) {
      return renderResult(evaluateValue(props.render));
    }
    return renderResult(props.children);
  }

  // Evaluate else-if condition
  let evaluatedElseIfCondition;
  try {
    evaluatedElseIfCondition = evaluateValue(elseIfCondition, cbData);
  } catch (err) {
    if (props.safeEval) {
      console.warn(
        "[safeEval] Error while evaluating else-if-condition:",
        err.stack
      );
    } else {
      throw err;
    }
  }

  if (evaluatedElseIfCondition) {
    if (props.elseIfRender) {
      return renderResult(evaluateValue(props.elseIfRender));
    }

    return null;
  }

  // Render the else contents
  if (props.else !== undefined) {
    return renderResult(evaluateValue(props.else, cbData));
  }
  return null;
});

RenderIf.propTypes = {
  if: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  ifFirst: PropTypes.array,
  ifLast: PropTypes.array,
  if2ndToLast: PropTypes.array,
  elseIf: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  else: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  children: PropTypes.node,
  render: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  elseIfRender: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  as: PropTypes.string,
  safeEval: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

RenderIf.defaultProps = {
  if: false,
  safeEval: false,
  as: undefined
};

export default RenderIf;