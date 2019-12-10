import * as React from 'react';
import { Theme, createStyles, withStyles, Typography, Button, WithStyles, Box, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';
import { User } from 'oidc-client';
import { UserProfile } from '../../../models/UserProfile';
import { RoleEnum } from '../../../models/RoleEnum';
import { userIsInRole } from '../../../helpers/Helpers';

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.toolbar.height,
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        subFont: {
            fontWeight: theme.typography.fontWeightRegular,
        },
    });

interface FirstProjectRequiredProps extends WithStyles<typeof styles> {
    user: User;
    push: typeof push;
    welcomeMessage?: boolean;
}
const mapStateToProps = (state: ApplicationState) => {
    return {
        user: state.oidc.user,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
    };
};

class FirstProjectRequired extends React.Component<FirstProjectRequiredProps> {
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <div className={classes.layout}>
                    {userIsInRole(this.props.user, RoleEnum.ADMIN) ? (
                        <Grid container direction="column" alignItems="center" justify="center">
                            <Grid item xs={12}>
                                {this.props.welcomeMessage && (
                                    <Typography gutterBottom variant="h4" align="center">
                                        Welcome to Ranger.
                                    </Typography>
                                )}
                                {!window.location.pathname.startsWith(RoutePaths.Dashboard) ? (
                                    <Typography gutterBottom variant="h6" className={classes.subFont} align="center">
                                        You must first create a project to access these resources.
                                    </Typography>
                                ) : (
                                    <Typography gutterBottom variant="h6" className={classes.subFont} align="center">
                                        It looks like your organization hasn't created any projects yet.
                                    </Typography>
                                )}
                                <Typography gutterBottom variant="h6" className={classes.subFont} align="center">
                                    Click below to create your first project.
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        this.props.push(RoutePaths.ProjectsNew);
                                    }}
                                >
                                    New Project
                                </Button>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container direction="column" alignItems="center" justify="center">
                            <Grid item xs={12}>
                                <Typography gutterBottom variant="h6" className={classes.subFont} align="center">
                                    It looks like your organization hasn't created any projects yet.
                                </Typography>
                                <Typography gutterBottom variant="h6" className={classes.subFont} align="center">
                                    Please request someone with administrative privilages create one.
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FirstProjectRequired));
