import * as React from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import MapBackground from '../../../../assets/map-background.png';
import LeaningRangerPin from '../../../../assets/Leaning-Ranger-Pin-Green.svg';

const styles = (theme: Theme) =>
    createStyles({
        appBarPush: {
            height: theme.toolbar.height,
            width: '100%',
        },
        background: {
            // backgroundImage: "linear-gradient(-45deg, #b230ae 0%, #e94057 30%, #f27121 80%)",
            backgroundImage: 'linear-gradient(-45deg, rgba(204,153,204,1) 0%,rgba(126,87,194,1) 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            height: '100%',
            width: '100%',
            opacity: 0.3,
            position: 'absolute',
            top: 0,
            left: 0,
        },
        pin: {
            width: '20%',
            opacity: 0.7,
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
                <div className={classes.background}>
                    <MapBackground />
                </div>
                <div className={classes.pin}>
                    <LeaningRangerPin />
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(BackgroundLayer);
