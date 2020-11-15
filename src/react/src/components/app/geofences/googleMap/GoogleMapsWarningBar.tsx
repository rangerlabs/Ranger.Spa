import * as React from 'react';
import { Theme, Typography, Grow, Grid, createStyles, withStyles, WithStyles } from '@material-ui/core';
import { createPortal } from 'react-dom';

const styles = (theme: Theme) =>
    createStyles({
        bar: {
            width: '100%',
            height: theme.toolbar.height,
            background: theme.palette.warning.main,
            zIndex: theme.mixins.toolbar.zIndex,
        },
        whiteText: {
            color: theme.palette.common.white,
        },
    });

interface GoogleMapsWarningBarProps extends WithStyles<typeof styles> {
    enabled: boolean;
    message: string;
    map: google.maps.Map;
}
class GoogleMapsWarningBar extends React.Component<GoogleMapsWarningBarProps> {
    constructor(props: GoogleMapsWarningBarProps) {
        super(props);
        this.googleMapsInfoWindowOpenerContainer = document.createElement('div');
        this.props.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.googleMapsInfoWindowOpenerContainer);
    }
    googleMapsInfoWindowOpenerContainer: HTMLDivElement = undefined;

    render() {
        return (
            this.props.enabled &&
            createPortal(
                <Grow in={this.props.enabled} timeout={550}>
                    <Grid container direction="column" justify="center" className={this.props.classes.bar}>
                        <Grid item>
                            <Typography className={this.props.classes.whiteText} align="center">
                                {this.props.message}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grow>,
                this.googleMapsInfoWindowOpenerContainer
            )
        );
    }
}

// const GoogleMapsWarningBar = function (props: GoogleMapsWarningBarProps) {
//     const classes = useStyles();
//         this.props.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.googleMapsInfoWindowOpenerContainer);
//     return (

//     );
// };

export default withStyles(styles)(GoogleMapsWarningBar);
