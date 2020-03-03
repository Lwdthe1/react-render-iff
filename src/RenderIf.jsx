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

  const consoleWarn = function() {
    console.warn.apply(undefined, arguments);
  };

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
      consoleWarn(
        "Should always provide an index for ifFirst or ifLast check."
      );
    }

    if (checkFirst && index !== undefined) {
      return index === 0;
    }

    if (!arr) {
      consoleWarn("Should always provide an array for position check");
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
    consoleWarn(
      "You've provided more than one of the following top-level conditional props. You should only provide one of these props to avoid unexpected consequences.\n\t",
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

      return <props.as {...wrapperProps}>{v}</props.as>;
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
    consoleWarn(
      `Should provide props.if\n${
        props.debugKey
          ? `Debug key: ${props.debugKey}. ${Object.keys(props)}`
          : ""
      }`
    );
  }

  if (props.elseIf !== undefined && !props.elseIfRender) {
    consoleWarn(
      "You provided props.elseIf without a corresponding props.elseIfRender. Nothing will be rendered if this condition evaluates to true"
    );
  }

  // Evaluate if condition
  let evaluatedIfCondition;
  try {
    evaluatedIfCondition = evaluateValue(ifCondition, cbData);
  } catch (err) {
    if (props.safeEval) {
      consoleWarn(
        `[safeEval: ${props.safeEval}] Error while evaluating "if" condition:`,
        err.stack
      );
    } else {
      throw err;
    }
  }

  if (evaluatedIfCondition) {
    if (props.render) {
      try {
        return renderResult(evaluateValue(props.render));
      } catch (err) {
        if (props.safeEval) {
          consoleWarn(
            `[safeEval: ${props.safeEval}] Error while evaluating "render" prop:`,
            err.stack
          );
        } else {
          throw err;
        }
      }
    }
    return renderResult(props.children);
  }

  // Evaluate else-if condition
  let evaluatedElseIfCondition;
  try {
    evaluatedElseIfCondition = evaluateValue(elseIfCondition, cbData);
  } catch (err) {
    if (props.safeEval) {
      consoleWarn(
        `[safeEval: ${props.safeEval}] Error while evaluating "elseIf" condition:`,
        err.stack
      );
    } else {
      throw err;
    }
  }

  if (evaluatedElseIfCondition) {
    if (props.elseIfRender) {
      try {
        return renderResult(evaluateValue(props.elseIfRender));
      } catch (err) {
        if (props.safeEval) {
          consoleWarn(
            `[safeEval: ${props.safeEval}] Error while evaluating "elseIfRender" prop:`,
            err.stack
          );
        } else {
          throw err;
        }
      }
    }

    return null;
  }

  // Render the else contents
  if (props.else !== undefined) {
    try {
      return renderResult(evaluateValue(props.else, cbData));
    } catch (err) {
      if (props.safeEval) {
        consoleWarn(
          `[safeEval: ${props.safeEval}] Error while evaluating "else" prop:`,
          err.stack
        );
      } else {
        throw err;
      }
    }
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
