import * as React from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import LeaningRangerPin from '../../../../assets/Leaning-Ranger-Pin-Green.svg';
import MapBackground from '../../../../assets/map-background.png';

const styles = (theme: Theme) =>
    createStyles({
        appBarPush: {
            height: theme.toolbar.height,
            width: '100%',
        },
        background: {
            height: '100%',
            width: '100%',
            opacity: 0.07,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -1,
        },
        pin: {
            width: '15%',
            position: 'absolute',
            bottom: 0,
            left: '3px',
        },
    });

interface BackgroundLayerProps extends WithStyles<typeof styles> {}

class BackgroundLayer extends React.Component<BackgroundLayerProps> {
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <img className={classes.background} src={MapBackground} alt="Map Background" />
                <div className={classes.pin}>
                    <LeaningRangerPin />
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(BackgroundLayer);
