import * as React from 'react';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import Loading from '../../loading/Loading';
import ISubscriptionLimitDetails from '../../../models/app/ISubscriptionLimitDetails';
import SubscriptionsService from '../../../services/SubscriptionsService';
import { populateSubscriptionLimitDetails, SubscriptionLimitDetailsState } from '../../../redux/actions/SubscriptionLimitDetailsActions';

const subscriptionService = new SubscriptionsService();

interface PopulateSubscriptionLimitDetailsComponentProps {
    setSubscriptionLimitDetails: (limitDetails: ISubscriptionLimitDetails) => void;
    subscriptionLimitDetailsState: SubscriptionLimitDetailsState;
}
interface PopulateSubscriptionLimitDetailsComponentState {
    wasError: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return { subscriptionLimitDetailsState: state.subscriptionLimitDetailsState };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setSubscriptionLimitDetails: (subscriptionLimitDetails: ISubscriptionLimitDetails) => {
            const action = populateSubscriptionLimitDetails(subscriptionLimitDetails);
            dispatch(action);
        },
    };
};

const populateSubscriptionLimitDataHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulateSubscriptionLimitDetailsComponent extends React.Component<
        PopulateSubscriptionLimitDetailsComponentProps,
        PopulateSubscriptionLimitDetailsComponentState
    > {
        state: PopulateSubscriptionLimitDetailsComponentState = {
            wasError: false,
        };
        componentDidMount() {
            if (!this.props.subscriptionLimitDetailsState.isLoaded) {
                subscriptionService.getSubscriptionLimitDetails().then((response) => {
                    if (response.isError) {
                        this.setState({ wasError: true });
                    } else {
                        this.props.setSubscriptionLimitDetails(response.result ? response.result : ({} as ISubscriptionLimitDetails));
                    }
                });
            }
        }

        render() {
            return this.props.subscriptionLimitDetailsState.isLoaded && !this.state.wasError ? (
                <Component {...(this.props as P)} />
            ) : (
                <Loading wasError={this.state.wasError} />
            );
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(PopulateSubscriptionLimitDetailsComponent);
};

export default populateSubscriptionLimitDataHOC;
