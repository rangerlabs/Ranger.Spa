import * as React from 'react';
import { Typography, LinearProgress, createStyles, Theme, WithStyles, Button, withStyles, Grid } from '@material-ui/core';
import UserService from '../../../services/UserService';
import * as queryString from 'query-string';
import ITransferPrimaryOwnershipModel from '../../../models/landing/ITransferPrimaryOwnershipModel';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import { TransferPrimaryOwnershipResponseEnum } from '../../../models/TransferPrimaryOwnershipResponseEnum';
import { getSubDomain } from '../../../helpers/Helpers';

const userService = new UserService();

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: 'auto',
            marginTop: theme.toolbar.height * 2,
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        flexButtonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
    });

interface TransferPrimaryOwnershipProps extends WithStyles<typeof styles> {
    push: typeof push;
}

interface TransferPrimaryOwnershipState {
    confirmed: boolean;
    isRequesting: boolean;
}

class TransferPrimaryOwnership extends React.Component<TransferPrimaryOwnershipProps, TransferPrimaryOwnershipState> {
    state: TransferPrimaryOwnershipState = {
        confirmed: undefined,
        isRequesting: true,
    };

    getCorrelationIdFromParams(): string {
        const params = queryString.parse(window.location.search);
        const correlationId = params['correlationId'] as string;
        return correlationId;
    }

    componentDidMount() {
        const correlationId = this.getCorrelationIdFromParams();
        const confirmModel = {
            CorrelationId: correlationId,
        } as ITransferPrimaryOwnershipModel;

        userService
            .cancelPrimaryOwnershipTransfer(getSubDomain(), confirmModel)
            .then(v => {
                this.setState({ confirmed: v, isRequesting: false });
            })
            .catch(r => {
                this.setState({ isRequesting: false });
            });
    }

    render() {
        return (
            <div className={this.props.classes.layout}>
                {this.state.isRequesting && (
                    <Grid container spacing={3} justify="center" alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h5">Please wait while we process your cancellation request.</Typography>
                            <LinearProgress />
                        </Grid>
                    </Grid>
                )}
                {!this.state.isRequesting && this.state.confirmed && (
                    <React.Fragment>
                        <Grid direction="column" container spacing={3} justify="center" alignItems="center">
                            <Grid item>
                                <React.Fragment>
                                    <Typography gutterBottom align="center" variant="h5">
                                        Your request to cancel the transfer the of Primary Owner role has been accepted.
                                    </Typography>
                                    <Typography gutterBottom align="center" variant="subtitle1">
                                        Click below to login to Ranger.
                                    </Typography>
                                </React.Fragment>
                            </Grid>
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        getSubDomain()
                                            ? window.location.assign(`https://${getSubDomain()}.${SPA_HOST}${RoutePaths.Login}`)
                                            : this.props.push(RoutePaths.Landing);
                                    }}
                                >
                                    Sign in
                                </Button>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                )}
                {!this.state.isRequesting && !this.state.confirmed && (
                    <Grid container spacing={3} justify="center" alignItems="center">
                        <Grid item xs={12}>
                            <Typography align="center" variant="h5">
                                Failed to submit your request to cancel the Primary Owner Transfer.
                            </Typography>
                            <Typography align="center" variant="subtitle1">
                                Verify the cancellation link was correct.
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </div>
        );
    }
}

export default connect(null, { push })(withStyles(styles, { withTheme: true })(TransferPrimaryOwnership));
