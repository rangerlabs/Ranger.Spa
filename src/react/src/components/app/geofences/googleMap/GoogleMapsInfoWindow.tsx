import * as React from "react";
import { Theme, createStyles, withStyles, WithStyles, Button, Typography } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { StylesProvider } from "@material-ui/styles";
import { jss, generateClassName } from "../../../../theme/StylesProviderPropsConfig";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            paddingRight: "12px",
            paddingBottom: "12px",
            textAlign: "center",
        },
        warning: {
            color: red[600],
            fontSize: 16,
            fontFamily: "'Lato', sans-serif",
        },
        primary: {
            color: "#7e57c2",
            fontSize: 16,
            fontFamily: "'Lato', sans-serif",
        },
    });

interface GoogleMapsInfoWindowProps extends WithStyles<typeof styles> {
    name?: string;
    onEdit?: () => void;
    onCreate?: () => void;
    clear?: () => void;
}
class GoogleMapsInfoWindow extends React.Component<GoogleMapsInfoWindowProps> {
    render() {
        const { classes } = this.props;
        return (
            <StylesProvider jss={jss} generateClassName={generateClassName}>
                <div className={classes.root}>
                    {this.props.name ? (
                        <React.Fragment>
                            <Typography align="center" variant="subtitle1">
                                {this.props.name}
                            </Typography>
                            <Button
                                className={classes.primary}
                                variant="text"
                                onClick={e => {
                                    this.props.onEdit();
                                }}
                            >
                                Edit
                            </Button>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Button
                                className={classes.warning}
                                variant="text"
                                onClick={e => {
                                    this.props.clear();
                                }}
                            >
                                Clear
                            </Button>
                            <Button
                                className={classes.primary}
                                variant="text"
                                onClick={e => {
                                    this.props.onCreate();
                                }}
                            >
                                Create
                            </Button>
                        </React.Fragment>
                    )}
                </div>
            </StylesProvider>
        );
    }
}

export default withStyles(styles, { withTheme: true })(GoogleMapsInfoWindow);
