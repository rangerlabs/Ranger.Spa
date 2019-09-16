import * as React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Zoom, Fab } from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

interface ScrollTopProps {
    visible: boolean;
    onClick: () => void;
}

const ScrollTop: React.FC<ScrollTopProps> = props => {
    const classes = useStyles(props);

    return (
        <Zoom in={props.visible}>
            <div onClick={props.onClick} role="presentation" className={classes.root}>
                <Fab color="primary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </div>
        </Zoom>
    );
};

export default ScrollTop;
