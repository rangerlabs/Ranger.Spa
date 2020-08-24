import * as React from 'react';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { bindActionCreators, Unsubscribe } from 'redux';
import { connect } from 'react-redux';
import { removeSnackbar, SnackbarNotification } from '../../redux/actions/SnackbarActions';
import { ApplicationState, OidcState } from '../../stores';
import Pusher, { Channel, AuthOptions } from 'pusher-js';
import ReduxStore from '../../ReduxStore';
import RegistrationHandler from './pusherHandlers/RegistrationHandler';
import { StatusEnum } from '../../models/StatusEnum';
import { OrganizationState } from '../../redux/actions/OrganizationActions';
import { User } from 'oidc-client';
import GenericDomainUserHandler from './pusherHandlers/GenericDomainUserHandler';
import TokenRefreshHandler from './pusherHandlers/TokenRefreshHandler';
import PermissionsUpdatedHandler from './pusherHandlers/PermissionsUpdatedHandler';
import ForceSignoutHandler from './pusherHandlers/ForceSignoutHandler';
import GeofenceUpdateHandler from './pusherHandlers/GeofenceUpdateHandler';
import GeofenceCreateHandler from './pusherHandlers/GeofenceCreateHandler';
import GeofenceDeleteHandler from './pusherHandlers/GeofenceDeleteHandler';
import IntegrationUpdateHandler from './pusherHandlers/IntegrationUpdateHandler';
import IntegrationCreateHandler from './pusherHandlers/IntegrationCreateHandler';
import IntegrationDeleteHandler from './pusherHandlers/IntegrationDeleteHandler';
import SubscriptionChangedHandler from './pusherHandlers/SubscriptionChangedHandler';
import GlobalConfig from '../../helpers/GlobalConfig';
import OrganizationUpdateHandler from './pusherHandlers/OrganizationUpdateHandler';
import OrganizationDomainUpdateHandler from './pusherHandlers/OrganizationDomainUpdateHandler';
import UserCreateHandler from './pusherHandlers/UserCreateHandler';
import UserUpdateHandler from './pusherHandlers/UserUpdateHandler';
import UserDeleteHandler from './pusherHandlers/UserDeleteHandler';
import AccountDeleteHandler from './pusherHandlers/AccountDeleteHandler';

interface NotifierProps extends WithSnackbarProps {
    notifications: SnackbarNotification[];
    removeSnackbar: (key: React.ReactText) => void;
}

class Notifier extends React.Component<NotifierProps> {
    displayed = [] as React.ReactText[];
    pusher = undefined as Pusher;
    registrationChannel = undefined as Channel;
    userChannel = undefined as Channel;
    domainChannel = undefined as Channel;
    currentTenantOnbaordChannel = '';
    unsubscribe: Unsubscribe;

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidUpdate() {
        const { notifications = [] } = this.props;
        notifications.forEach(({ key, message, options = {} }) => {
            if (!this.displayed.includes(key)) {
                this.props.enqueueSnackbar(message, {
                    key,
                    ...options,
                    onClose: (event, reason, myKey) => {
                        if (options.onClose) {
                            options.onClose(event, reason, myKey);
                        }
                        this.props.removeSnackbar(key);
                    },
                });
                this.storeDisplayed(key);
            }
        });
    }

    shouldComponentUpdate({ notifications: newSnacks = [] }: NotifierProps) {
        if (!newSnacks.length) {
            this.displayed = [];
            return false;
        }

        const { notifications: currentSnacks } = this.props;
        let notExists = false;
        for (let i = 0; i < newSnacks.length; i += 1) {
            const newSnack = newSnacks[i];
            if (newSnack.dismissed) {
                this.props.closeSnackbar(newSnack.key);
                this.props.removeSnackbar(newSnack.key);
            }

            if (notExists) {
                continue;
            }
            notExists = notExists || !currentSnacks.filter(({ key }) => newSnack.key === key).length;
        }
        return notExists;
    }

    storeDisplayed = (id: React.ReactText) => {
        this.displayed = [...this.displayed, id];
    };

    componentDidMount() {
        this.pusher = new Pusher(GlobalConfig.PUSHER_API_KEY, {
            cluster: 'us2',
            forceTLS: true,
            authEndpoint: 'https://' + GlobalConfig.API_HOST + GlobalConfig.BASE_PATH + '/pusher/auth',
        });

        this.unsubscribe = ReduxStore.getStore().subscribe(() => {
            const stateDomain = ReduxStore.getState().organizationState;
            const oidcState = ReduxStore.getState().oidc;
            if (this.cancomponentDidMountToRegistration(stateDomain)) {
                if (!this.registrationChannel) {
                    this.componentDidMountTenantOnboardChannelEvent(stateDomain);
                } else if (this.registrationChannel.name !== this.currentTenantOnbaordChannel) {
                    this.pusher.unsubscribe(this.currentTenantOnbaordChannel);
                    this.componentDidMountTenantOnboardChannelEvent(stateDomain);
                }
            } else if (this.cancomponentDidMountToDomainUser(stateDomain, oidcState)) {
                this.pusher.config.auth = {
                    headers: {
                        Authorization: 'Bearer ' + oidcState.user.access_token,
                        'api-version': '1.0',
                    },
                    params: {
                        userEmail: oidcState.user.profile.email,
                    },
                };

                if (!this.userChannel) {
                    this.componentDidMountDomainUserChannelEvents(stateDomain, oidcState.user);
                }
            }
        });
    }

    private cancomponentDidMountToDomainUser(stateDomain: OrganizationState, oidc: OidcState) {
        return stateDomain && stateDomain.domain && !oidc.isLoadingUser && oidc.user && !oidc.user.expired;
    }

    private cancomponentDidMountToRegistration(stateDomain: OrganizationState) {
        return stateDomain && stateDomain.domain && stateDomain.status === StatusEnum.PENDING;
    }

    private componentDidMountDomainUserChannelEvents(stateDomain: OrganizationState, user: User) {
        const userChannel = `private-${stateDomain.domain}-${user.profile.email}`;
        const domainChannel = `private-${stateDomain.domain}`;
        this.userChannel = this.pusher.subscribe(userChannel);
        this.domainChannel = this.pusher.subscribe(domainChannel);
        this.userChannel.bind('user-created', UserCreateHandler);
        this.userChannel.bind('user-updated', UserUpdateHandler);
        this.userChannel.bind('user-deleted', UserDeleteHandler);
        this.userChannel.bind('account-deleted', AccountDeleteHandler);
        this.userChannel.bind('token-refresh', TokenRefreshHandler);
        this.userChannel.bind('permissions-updated', PermissionsUpdatedHandler);
        this.userChannel.bind('force-signout', ForceSignoutHandler);
        this.userChannel.bind('geofence-created', GeofenceCreateHandler);
        this.userChannel.bind('geofence-updated', GeofenceUpdateHandler);
        this.userChannel.bind('geofence-deleted', GeofenceDeleteHandler);
        this.userChannel.bind('integration-created', IntegrationCreateHandler);
        this.userChannel.bind('integration-updated', IntegrationUpdateHandler);
        this.userChannel.bind('integration-deleted', IntegrationDeleteHandler);
        this.userChannel.bind('organization-updated', OrganizationUpdateHandler);

        this.domainChannel.bind('organization-domain-updated', OrganizationDomainUpdateHandler);
        this.domainChannel.bind('subscription-changed', SubscriptionChangedHandler);
    }

    private componentDidMountTenantOnboardChannelEvent(stateDomain: OrganizationState) {
        const channel = `ranger-labs-${stateDomain.domain}`;
        this.registrationChannel = this.pusher.subscribe(channel);
        this.registrationChannel.bind('tenant-onboard', RegistrationHandler);
        this.currentTenantOnbaordChannel = channel;
    }

    render(): any {
        return null;
    }
}

const mapStateToProps = (store: ApplicationState) => ({
    domain: store.organizationState,
    notifications: store.notifications,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ removeSnackbar }, dispatch);

export default withSnackbar(connect(mapStateToProps, mapDispatchToProps)(Notifier));
