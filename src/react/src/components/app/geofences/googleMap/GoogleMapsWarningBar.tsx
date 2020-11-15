import * as React from 'react';
import { Theme, Typography, Grow, Grid, createStyles, withStyles, WithStyles, IconButton } from '@material-ui/core';
import { createPortal } from 'react-dom';
import CloseCircle from 'mdi-material-ui/CloseCircle';
import Constants from '../../../../theme/Constants';

const styles = (theme: Theme) =>
    createStyles({
        bar: {
            position: 'absolute',
            height: theme.toolbar.height,
            zIndex: theme.mixins.toolbar.zIndex,
        },
        barItem: {
            background: theme.palette.warning.main,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
        },
        whiteText: {
            color: theme.palette.common.white,
        },
    });

interface GoogleMapsWarningBarProps extends WithStyles<typeof styles> {
    enabled: boolean;
    message: string;
    onDismiss: () => void;
}
class GoogleMapsWarningBar extends React.Component<GoogleMapsWarningBarProps> {
    render() {
        return (
            <Grow in={this.props.enabled} timeout={550}>
                <Grid container className={this.props.classes.bar}>
                    <Grid item className={this.props.classes.barItem}>
                        <Typography className={this.props.classes.whiteText} align="center">
                            {this.props.message}
                            <IconButton onClick={this.props.onDismiss} aria-label="close">
                                <CloseCircle htmlColor={Constants.COLORS.WHITE} fontSize="inherit" />
                            </IconButton>
                        </Typography>
                    </Grid>
                </Grid>
            </Grow>
        );
    }
}

export default withStyles(styles)(GoogleMapsWarningBar);
