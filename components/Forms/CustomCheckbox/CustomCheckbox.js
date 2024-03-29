// @TODO
// make animation conditional, should be able to disable
// allow supply of own SVG components
// allow 'children' prop for label text
import { Text } from "@chakra-ui/layout";
import React from "react";
import styles from "./../../../styles/CustomCheckbox.module.scss";

const { Component, PureComponent } = React;

class CustomCheckbox extends PureComponent {
  constructor(props) {
    super();

    this.state = {
      checked: false,
      isAnimating: false,
    };

    this.toggleChecked = this.toggleChecked.bind(this);
    this.ping = this.ping.bind(this);
    this.composeStateClasses = this.composeStateClasses.bind(this);

    if (props.checked) {
      this.state.checked = true;
    }
  }

  //
  toggleChecked(label) {
    if (this.state.isAnimating) return false;

    if (!this.props.cannotBeChecked) {
      this.setState(
        {
          checked: !this.state.checked,
          isAnimating: true,
        },
        () => {
          this.props.checkboxChange({ label, isChecked: this.state.checked });
        }
      );
    }
  }

  //
  ping() {
    this.setState({ isAnimating: false });
  }

  //
  composeStateClasses(core) {
    let result = core;

    if (this.state.checked) {
      result += ` ${styles["is-checked"]}`;
    } else {
      result += ` ${styles["is-unchecked"]}`;
    }

    if (this.state.isAnimating) {
      result += ` ${styles["do-ping"]}`;
    }
    return result;
  }

  //
  render() {
    const cl = this.composeStateClasses(styles["ui-checkbox-btn"]);

    return (
      <div className={cl} onClick={() => this.toggleChecked(this.props.label)}>
        <input
          className={styles["ui ui-checkbox"]}
          type="checkbox"
          defaultChecked={this.state.checked || this.props.checked}
          disabled={this.props.disabled}
        />

        {this.state.checked && (
          <i className={styles["icon"]}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M21 5q0.43 0 0.715 0.285t0.285 0.715q0 0.422-0.289 0.711l-12 12q-0.289 0.289-0.711 0.289t-0.711-0.289l-6-6q-0.289-0.289-0.289-0.711 0-0.43 0.285-0.715t0.715-0.285q0.422 0 0.711 0.289l5.289 5.297 11.289-11.297q0.289-0.289 0.711-0.289z"></path>
            </svg>
          </i>
        )}
        {!this.state.checked && (
          <i className={styles["icon"]}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 4q0.43 0 0.715 0.285t0.285 0.715q0 0.422-0.289 0.711l-6.297 6.289 6.297 6.289q0.289 0.289 0.289 0.711 0 0.43-0.285 0.715t-0.715 0.285q-0.422 0-0.711-0.289l-6.289-6.297-6.289 6.297q-0.289 0.289-0.711 0.289-0.43 0-0.715-0.285t-0.285-0.715q0-0.422 0.289-0.711l6.297-6.289-6.297-6.289q-0.289-0.289-0.289-0.711 0-0.43 0.285-0.715t0.715-0.285q0.422 0 0.711 0.289l6.289 6.297 6.289-6.297q0.289-0.289 0.711-0.289z"></path>
            </svg>
          </i>
        )}
        <label
          className="text"
          style={!this.props.cannotBeChecked ? { color: "beige" } : {}}
        >
          <Text as={"span"} fontSize={["xs"]}>
            {this.props.label}
          </Text>
        </label>
        <div
          className={styles["ui-btn-ping"]}
          onTransitionEnd={this.ping}
        ></div>
      </div>
    );
  }
}

export default CustomCheckbox;
