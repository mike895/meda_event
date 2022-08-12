import React, { Component, ReactNode } from "react";
import { Popover, Button } from "antd";
import { FilterCtx } from "../../Context/Context";
import { DownOutlined } from "@ant-design/icons";
type Props = {
  title: any | undefined;
  name: string;
};
type State = {
  clicked: boolean;
};
class FilterContainer extends Component<Props, State> {
  static contextType = FilterCtx;
  state = {
    clicked: false,
  };
  hide = () => {
    this.setState({
      clicked: false,
    });
  };
  handleClickChange = (visible: boolean) => {
    if (!visible) {
      if (this.context.onUpdate) this.context.onUpdate();
    }
    this.setState({
      clicked: visible,
    });
  };
  shouldBeHighlighted = () => {
    let filterParams = this.context.filters;
    if (filterParams[this.props.name] == undefined) {
      return false;
    }
    return true;
  };
  render() {
    return (
      <Popover
        arrowPointAtCenter={false}
        // arrow={false}
        placement="bottom"
        content={this.props.children}
        //   <div>
        //     <a onClick={this.hide}>Close</a>
        //   </div>

        // title={this.props.title}
        trigger="click"
        visible={this.state.clicked}
        onVisibleChange={this.handleClickChange}
      >
        <Button
          type={this.shouldBeHighlighted() ? "primary" : "default"}
        >
          {this.props.title} <DownOutlined style={{ fontSize: "10px" }} />
        </Button>
      </Popover>
    );
  }
}

export default FilterContainer;
