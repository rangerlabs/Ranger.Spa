import * as React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Button, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { StylesProvider } from '@material-ui/styles';
import { jss, generateClassName } from '../../../../theme/StylesProviderPropsConfig';
import Constants from '../../../../theme/Constants';
import { Pencil, PencilPlus, Delete } from 'mdi-material-ui';

const styles = (theme: Theme) => {
    return createStyles({
        root: {
            textAlign: 'center',
            marginLeft: '7px',
            marginTop: '7px',
            marginBottom: '7px',
        },
        warning: {
            color: red[600],
            fontFamily: "'Lato', sans-serif",
            '&:hover': {
                backgroundColor: '#e539351c',
                color: theme.palette.error.main,
            },
            marginRight: theme.spacing(1),
        },
        primary: {
            backgroundColor: Constants.COLORS.PRIMARY_COLOR,
            color: Constants.COLORS.WHITE,
            fontFamily: "'Lato', sans-serif",
        },
    });
};

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
                                variant="contained"
                                onClick={e => {
                                    this.props.onEdit();
                                }}
                                startIcon={<Pencil />}
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
                                startIcon={<Delete />}
                            >
                                Clear
                            </Button>
                            <Button
                                className={classes.primary}
                                variant="contained"
                                onClick={e => {
                                    this.props.onCreate();
                                }}
                                startIcon={<PencilPlus />}
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
