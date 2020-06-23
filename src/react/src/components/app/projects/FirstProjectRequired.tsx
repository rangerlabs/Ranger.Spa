import * as React from 'react';
import { Theme, createStyles, withStyles, Typography, Button, WithStyles, Box, Grid, Paper } from '@material-ui/core';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';
import { User } from 'oidc-client';
import { UserProfile } from '../../../models/UserProfile';
import { RoleEnum } from '../../../models/RoleEnum';
import { userIsInRole } from '../../../helpers/Helpers';
import ArrowRight from 'mdi-material-ui/ArrowRight';
import Constants from '../../../theme/Constants';

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            padding: theme.spacing(4),
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
        white: {
            color: theme.palette.common.white,
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
                <Paper className={classes.layout}>
                    {userIsInRole(this.props.user, RoleEnum.ADMIN) ? (
                        <Grid container direction="column" justify="center">
                            <Grid item xs={12}>
                                {this.props.welcomeMessage && (
                                    <Typography gutterBottom variant="h4">
                                        Welcome to Ranger.
                                    </Typography>
                                )}
                                {!window.location.pathname.startsWith(RoutePaths.Dashboard) ? (
                                    <Typography gutterBottom variant="h6" className={classes.subFont}>
                                        Your organization must first create a project to access these resources.
                                    </Typography>
                                ) : userIsInRole(this.props.user, RoleEnum.ADMIN) ? (
                                    <Typography gutterBottom variant="h6" className={classes.subFont}>
                                        Your organization does not have any projects created yet.
                                    </Typography>
                                ) : (
                                    <Typography gutterBottom variant="h6" className={classes.subFont}>
                                        You have not been assigned to any projects.
                                    </Typography>
                                )}
                                <Typography gutterBottom variant="h6" className={classes.subFont}>
                                    Click below to create your organization's first project.
                                </Typography>
                            </Grid>
                            <Grid container item justify="flex-end">
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            this.props.push(RoutePaths.ProjectsNew);
                                        }}
                                    >
                                        New Project
                                        <ArrowRight fontSize="small" className={classes.white} />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container direction="column" justify="center">
                            <Grid item xs={12}>
                                {!window.location.pathname.startsWith(RoutePaths.Dashboard) ? (
                                    <Typography gutterBottom variant="h6" className={classes.subFont}>
                                        You must first be assigned a project to access these resources.
                                    </Typography>
                                ) : (
                                    <React.Fragment>
                                        <Typography gutterBottom variant="h6" className={classes.subFont}>
                                            You have not been assigned to any projects.
                                        </Typography>
                                        <Typography gutterBottom variant="h6" className={classes.subFont}>
                                            Please request an administrator to assign a project to you.
                                        </Typography>
                                    </React.Fragment>
                                )}
                            </Grid>
                        </Grid>
                    )}
                </Paper>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FirstProjectRequired));
