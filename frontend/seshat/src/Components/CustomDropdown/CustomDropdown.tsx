import * as React from "react";
// nodejs library that concatenates classes
import * as classNames from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import Popper from "@material-ui/core/Popper";

// core components
import Button from "../CustomButtons/Button";

import customDropdownStyle from "./customDropdownStyle";

interface CustonDropDownState {
    open: boolean
}

interface CustomDropDownProps {
  classes?: any,
  hoverColor?: string,
  buttonText: any,
  buttonIcon: Function,
  dropdownList: any[];
  buttonProps: any,
  dropup?: boolean,
  dropdownHeader?: any,
  rtlActive?: boolean,
  caret?: boolean,
  left?: boolean,
  noLiPadding?: boolean,
  // function that retuns the selected item
  onClick?: Function
}

class CustomDropdown extends React.Component<CustomDropDownProps, CustonDropDownState> {
  anchorEl: any ;
  constructor(props:CustomDropDownProps) {
    super(props);    
    this.state = {
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClick() {
    this.setState(state => ({ open: !state.open }));
  }
  handleClose(param:any) {
    this.setState({ open: false });
    if(this.props && this.props.onClick){
      this.props.onClick(param);
    }
  }
  handleCloseAway = (event:any) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  }
  render() {
    const { open } = this.state;
    const {
      classes,
      buttonText,
      buttonIcon,
      dropdownList,
      buttonProps,
      dropup,
      dropdownHeader,
      caret,
      hoverColor,
      left,
      rtlActive,
      noLiPadding
    } = this.props;
    const caretClasses = classNames({
      [classes.caret]: true,
      [classes.caretActive]: open,
      [classes.caretRTL]: rtlActive
    });
    const dropdownItem = classNames({
      [classes.dropdownItem]: true,
      [classes[hoverColor + "Hover"]]: true,
      [classes.noLiPadding]: noLiPadding,
      [classes.dropdownItemRTL]: rtlActive
    });
    let icon = null;
    switch (typeof buttonIcon) {
      case "function":
        icon = <this.props.buttonIcon className={classes.buttonIcon} />;
        break;
      case "string":
        icon = (
          <Icon className={classes.buttonIcon}>{this.props.buttonIcon}</Icon>
        );
        break;
      default:
        icon = null;
        break;
    }
    return (
      <div>
        <div>
          <Button
            aria-label="Notifications"
            aria-owns={open ? "menu-list" : null}
            aria-haspopup="true"
            {...buttonProps}
            buttonRef={(node:any) => {
              this.anchorEl = node;
            }}
            onClick={this.handleClick}
          >
            {icon}
            {buttonText !== undefined ? buttonText : null}
            {caret ? <b className={caretClasses} /> : null}
          </Button>
        </div>
        <Popper
          open={open}
          anchorEl={this.anchorEl}
          transition
          disablePortal
          placement={
            dropup
              ? left ? "top-start" : "top"
              : left ? "bottom-start" : "bottom"
          }
          className={classNames({
            [classes.popperClose]: !open,
            [classes.pooperResponsive]: true
          })}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              in={open}            
              style={
                dropup
                  ? { transformOrigin: "0 100% 0" }
                  : { transformOrigin: "0 0 0" }
              }
            >
              <Paper className={classes.dropdown}>
                <ClickAwayListener onClickAway={this.handleCloseAway}>
                  <MenuList role="menu" className={classes.menuList}>
                    {dropdownHeader !== undefined ? (
                      <MenuItem
                        onClick={this.handleClose}
                        className={classes.dropdownHeader}
                      >
                        {dropdownHeader}
                      </MenuItem>
                    ) : null}
                    {dropdownList.map((prop, key) => {
                      if (prop.divider) {
                        return (
                          <Divider
                            key={key}
                            onClick={this.handleClose}
                            className={classes.dropdownDividerItem}
                          />
                        );
                      }
                      return (
                        <MenuItem
                          key={key}
                          onClick={this.handleClose}
                          className={dropdownItem}
                        >
                          {prop}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

export default withStyles(customDropdownStyle)(CustomDropdown);
