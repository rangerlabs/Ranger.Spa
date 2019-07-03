import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";

interface CustomAddToolbarProps {
    toggleFormFlag: () => void;
}

const defaultToolbarStyles = {
    iconButton: {},
};

class CustomAddToolbar extends React.Component<CustomAddToolbarProps> {
    render() {
        const classes = this.props as any;

        return (
            <React.Fragment>
                <Tooltip title={"Add"}>
                    <IconButton className={classes.iconButton} onClick={this.props.toggleFormFlag}>
                        <AddIcon className={classes.deleteIcon} />
                    </IconButton>
                </Tooltip>
            </React.Fragment>
        );
    }
}

export default withStyles(defaultToolbarStyles, { name: "CustomAddToolbar" })(CustomAddToolbar);
