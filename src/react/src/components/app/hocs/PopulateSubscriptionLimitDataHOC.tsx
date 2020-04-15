import * as React from 'react';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import Loading from '../loading/Loading';
import ISubscriptionLimitDetails from '../../../models/app/ISubscriptionLimitDetails';
import SubscriptionsService from '../../../services/SubscriptionsService';
import { populateSubscriptionLimitDetails, SubscriptionLimitDetailsState } from '../../../redux/actions/SubscriptionLimitDetailsActions';

const subscriptionService = new SubscriptionsService();

interface PopulateSubscriptionLimitDetailsComponentProps {
    setSubscriptionLimitDetails: (limitDetails: ISubscriptionLimitDetails) => void;
    subscriptionLimitDetailsState: SubscriptionLimitDetailsState;
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
    class PopulateSubscriptionLimitDetailsComponent extends React.Component<PopulateSubscriptionLimitDetailsComponentProps> {
        componentDidMount() {
            if (!this.props.subscriptionLimitDetailsState.isLoaded) {
                subscriptionService.getSubscriptionLimitDetails().then((response) => {
                    if (!response.isError) {
                        this.props.setSubscriptionLimitDetails(response.result ? response.result : ({} as ISubscriptionLimitDetails));
                    }
                });
            }
        }

        render() {
            return this.props.subscriptionLimitDetailsState.isLoaded ? (
                <Component {...(this.props as P)} />
            ) : (
                <Loading message="Retrieving subscription details." />
            );
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(PopulateSubscriptionLimitDetailsComponent);
};

export default populateSubscriptionLimitDataHOC;
