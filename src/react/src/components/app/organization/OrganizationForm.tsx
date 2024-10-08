import * as React from 'react';
import { withStyles, createStyles, WithStyles, Paper, Theme, Typography, Grid, IconButton, Button, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { DialogContent, openDialog } from '../../../redux/actions/DialogActions';
import { ApplicationState } from '../../../stores/index';
import FormikDeleteButton from '../../form/FormikDeleteButton';
import DeleteOrganizationContent from '../dialogContents/DeleteOrganizationContent';
import ArrowLeft from 'mdi-material-ui/ArrowLeft';
import Constants from '../../../theme/Constants';
import classNames from 'classnames';
import populateOrganizationNameHOC from '../hocs/PopulateOrganizationNameHOC';
import { OrganizationState } from '../../../redux/actions/OrganizationActions';
import RoutePaths from '../../RoutePaths';
import ChangeOrganizationNameContent from '../dialogContents/ChangeOrganizationNameContent';
import ChangeOrganizationDomainContent from '../dialogContents/ChangeOrganizationDomainContent';

const styles = (theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(4),
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.spacing(3),
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        return: {
            position: 'sticky',
            top: theme.toolbar.height + theme.spacing(4),
            marginLeft: theme.spacing(4),
        },
        toolbar: {
            height: Constants.HEIGHT.TOOLBAR,
        },
        title: {
            marginTop: '0px',
            padding: '0px',
        },
        bottomPaper: {
            marginBottom: theme.spacing(3),
        },
    });
interface IOrganizationFormProps extends WithStyles<typeof styles> {
    push: typeof push;
    organization: OrganizationState;
    openDialog: (dialogContent: DialogContent) => void;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        openDialog: (dialogContent: DialogContent) => {
            const action = openDialog(dialogContent);
            dispatch(action);
        },
    };
};

const mapStateToProps = (state: ApplicationState) => {
    return { organization: state.organizationState };
};

class OrganizationForm extends React.Component<IOrganizationFormProps> {
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <IconButton className={classes.return} onClick={() => this.props.push(RoutePaths.Dashboard)}>
                    <ArrowLeft />
                </IconButton>
                <Typography className={classNames(classes.title, classes.paper)} align="left" variant="h5">
                    Edit Organization
                </Typography>
                <Paper className={classes.paper} elevation={3}>
                    <Typography variant="h6">Domain</Typography>
                    <Typography variant="subtitle1">Your organization's personalized domain</Typography>
                    <Grid container>
                        <Grid item>
                            <Box marginTop={3} whiteSpace="pre">
                                <Typography display="inline" variant="body1">
                                    {this.props.organization.domain}
                                </Typography>
                                <Typography display="inline" variant="body1" color="textSecondary">
                                    .rangerlabs.io
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button
                                onClick={() => {
                                    this.props.openDialog(new DialogContent(<ChangeOrganizationDomainContent />));
                                }}
                                color="primary"
                                variant="outlined"
                            >
                                Change
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper className={classes.paper} elevation={3}>
                    <Typography variant="h6">Organization Name</Typography>
                    <Typography variant="subtitle1">Your organization's name</Typography>
                    <Grid container>
                        <Grid item>
                            <Box marginTop={3}>
                                <Typography variant="body1">{this.props.organization.organizationName}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button
                                onClick={() => {
                                    this.props.openDialog(new DialogContent(<ChangeOrganizationNameContent />));
                                }}
                                color="primary"
                                variant="outlined"
                            >
                                Change
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper className={classNames(classes.bottomPaper, classes.paper)} elevation={3}>
                    <Typography variant="h6">Delete</Typography>
                    <Typography variant="subtitle1">Delete your organization</Typography>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <FormikDeleteButton
                                isSubmitting={false}
                                dialogTitle={`Delete ${this.props.organization.domain}?`}
                                dialogContent={<DeleteOrganizationContent />}
                            >
                                Delete
                            </FormikDeleteButton>
                        </Grid>
                    </Grid>
                </Paper>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateOrganizationNameHOC(OrganizationForm)));
