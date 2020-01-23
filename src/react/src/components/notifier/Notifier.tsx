import * as React from 'react';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { removeSnackbar, SnackbarNotification } from '../../redux/actions/SnackbarActions';
import { ApplicationState, OidcState } from '../../stores';
import Pusher from 'pusher-js';
import ReduxStore from '../../ReduxStore';
import RegistrationHandler from './pusherHandlers/RegistrationHandler';
import { StatusEnum } from '../../models/StatusEnum';
import { DomainState } from '../../redux/actions/DomainActions';
import { User } from 'oidc-client';
import GenericDomainUserHandler from './pusherHandlers/GenericDomainUserHandler';
import TokenRefreshHandler from './pusherHandlers/TokenRefreshHandler';
import PermissionsUpdatedHandler from './pusherHandlers/PermissionsUpdatedHandler';
import ForceSignoutHandler from './pusherHandlers/ForceSignoutHandler';
import GeofenceUpsertHandler from './pusherHandlers/GeofenceUpsertHandler
import GeofenceDeleteHandler from './pusherHandlers/GeofenceDeleteHandler';

interface NotifierProps extends WithSnackbarProps {
    notifications: SnackbarNotification[];
    removeSnackbar: (key: React.ReactText) => void;
}

class Notifier extends React.Component<NotifierProps> {
    displayed = [] as React.ReactText[];
    pusher = undefined as Pusher.Pusher;
    registrationChannel = undefined as Pusher.Channel;
    domainUserChannel = undefined as Pusher.Channel;
    currentTenantOnbaordChannel = '';

    componentDidUpdate() {
        const { notifications = [] } = this.props;
        notifications.forEach(({ key, message, options = {} }) => {
            if (!this.displayed.includes(key)) {
                this.props.enqueueSnackbar(message, {
                    ...options,
                    onClose: (event, reason) => {
                        if (options.onClose) {
                            options.onClose(event, reason);
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
        this.pusher = new Pusher(PUSHER_KEY, {
            cluster: 'us2',
            forceTLS: true,
        });

        ReduxStore.getStore().subscribe(() => {
            const stateDomain = ReduxStore.getState().domain;
            const oidcState = ReduxStore.getState().oidc;
            if (this.canSubscribeToRegistration(stateDomain)) {
                if (!this.registrationChannel) {
                    this.subscribeTenantOnboardChannelEvent(stateDomain);
                } else if (this.registrationChannel.name !== this.currentTenantOnbaordChannel) {
                    this.pusher.unsubscribe(this.currentTenantOnbaordChannel);
                    this.subscribeTenantOnboardChannelEvent(stateDomain);
                }
            } else if (this.canSubscribeToDomainUser(stateDomain, oidcState)) {
                this.pusher.config.authEndpoint = 'https://' + API_HOST + BASE_PATH + '/pusher/auth';
                this.pusher.config.auth = {
                    headers: {
                        Authorization: 'Bearer ' + oidcState.user.access_token,
                        'x-ranger-domain': stateDomain.domain,
                        'api-version': '1.0',
                    },
                    params: {
                        userEmail: oidcState.user.profile.email,
                    },
                };

                if (!this.domainUserChannel) {
                    this.subscribeDomainUserChannelEvents(stateDomain, oidcState.user);
                }
            }
        });
    }

    private canSubscribeToDomainUser(stateDomain: DomainState, oidc: OidcState) {
        return stateDomain && stateDomain.domain && !oidc.isLoadingUser && oidc.user && !oidc.user.expired;
    }

    private canSubscribeToRegistration(stateDomain: DomainState) {
        return stateDomain && stateDomain.domain && stateDomain.status === StatusEnum.PENDING;
    }

    private subscribeDomainUserChannelEvents(stateDomain: DomainState, user: User) {
        const channel = `private-${stateDomain.domain}-${user.profile.email}`;
        this.domainUserChannel = this.pusher.subscribe(channel);
        this.domainUserChannel.bind('user-created', GenericDomainUserHandler);
        this.domainUserChannel.bind('user-updated', GenericDomainUserHandler);
        this.domainUserChannel.bind('token-refresh', TokenRefreshHandler);
        this.domainUserChannel.bind('permissions-updated', PermissionsUpdatedHandler);
        this.domainUserChannel.bind('force-signout', ForceSignoutHandler);
        this.domainUserChannel.bind('geofence-created', GeofenceUpsertHandler);
        this.domainUserChannel.bind('geofence-updated', GeofenceUpsertHandler);
        this.domainUserChannel.bind('geofence-deleted', GeofenceDeleteHandler);
    }

    private subscribeTenantOnboardChannelEvent(stateDomain: DomainState) {
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
    domain: store.domain,
    notifications: store.notifications,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ removeSnackbar }, dispatch);

export default withSnackbar(connect(mapStateToProps, mapDispatchToProps)(Notifier));
