import * as React from 'react';
import { Theme, Typography, Grow, Grid, createStyles, withStyles, WithStyles, IconButton } from '@material-ui/core';
import CloseCircle from 'mdi-material-ui/CloseCircle';
import Constants from '../../../../theme/Constants';
import { orange } from '@material-ui/core/colors';

const styles = (theme: Theme) =>
    createStyles({
        bar: {
            position: 'absolute',
            height: theme.toolbar.height,
            zIndex: 1,
            width: `calc(100% - ${theme.drawer.width}px) !important`,
        },
        barItem: {
            background: Constants.COLORS.WARNING,
            borderRadius: 5,
        },
        whiteText: {
            color: theme.palette.common.white,
            padding: theme.spacing(1),
        },
    });

interface GoogleMapsWarningBarProps extends WithStyles<typeof styles> {
    enabled: boolean;
    message: string;
    onDismiss: () => void;
    persistent: boolean;
}
class GoogleMapsWarningBar extends React.Component<GoogleMapsWarningBarProps> {
    render() {
        return (
            <Grow in={this.props.enabled}>
                <Grid container className={this.props.classes.bar} alignItems="center" justify="center">
                    <Grid item className={this.props.classes.barItem} sm={6}>
                        <Typography className={this.props.classes.whiteText} align="center">
                            {this.props.message}
                            {!this.props.persistent && (
                                <IconButton onClick={this.props.onDismiss} aria-label="close">
                                    <CloseCircle htmlColor={Constants.COLORS.WHITE} fontSize="inherit" />
                                </IconButton>
                            )}
                        </Typography>
                    </Grid>
                </Grid>
            </Grow>
        );
    }
}

export default withStyles(styles)(GoogleMapsWarningBar);
