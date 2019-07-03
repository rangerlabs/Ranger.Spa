import * as React from "react";
import { Theme, createStyles, WithStyles, Typography, withStyles } from "@material-ui/core";

const styles = (theme: Theme) =>
    createStyles({
        root: {},
    });

interface NotFoundProps extends WithStyles<typeof styles> {}

class NotFound extends React.Component<NotFoundProps> {
    render() {
        return (
            <React.Fragment>
                <Typography>Not Found</Typography>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(NotFound);
