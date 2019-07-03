import * as React from "react";
import Clear from "@material-ui/icons/Clear";
import Tooltip from "@material-ui/core/Tooltip";
import { IconButton } from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core/SvgIcon";

interface IFormCancelProps {
    onClick: () => void;
    classes?: any;
    SvgIconProps?: SvgIconProps;
}

export default class FormCancel extends React.Component<IFormCancelProps> {
    handleClick = () => {
        this.props.onClick();
    };

    render() {
        return (
            <React.Fragment>
                <Tooltip className={"float-right"} title={"Cancel"}>
                    <IconButton onClick={this.props.onClick}>
                        <Clear {...this.props} />
                    </IconButton>
                </Tooltip>
            </React.Fragment>
        );
    }
}
