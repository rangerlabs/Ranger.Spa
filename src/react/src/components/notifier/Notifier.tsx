import * as React from "react";
import { withSnackbar, WithSnackbarProps } from "notistack";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { removeSnackbar, SnackbarNotification } from "../../redux/actions/SnackbarActions";
import { ApplicationState } from "../../stores";
import Pusher from "pusher-js";
import ReduxStore from "../../ReduxStore";
import RegistrationHandler from "./pusherHandlers/RegistrationHandler";
import { StatusEnum } from "../../models/StatusEnum";
import { DomainState } from "../../redux/actions/DomainActions";

interface NotifierProps extends WithSnackbarProps {
    domain: DomainState;
    notifications: SnackbarNotification[];
    removeSnackbar: (key: React.ReactText) => void;
}

class Notifier extends React.Component<NotifierProps> {
    displayed = [] as React.ReactText[];
    pusher = undefined as Pusher.Pusher;
    channel = undefined as Pusher.Channel;

    componentDidUpdate() {
        const { notifications = [] } = this.props;
        notifications.forEach(({ key, message, options = {} }) => {
            // Do nothing if snackbar is already displayed
            if (this.displayed.includes(key)) return;
            // Display snackbar using notistack
            this.props.enqueueSnackbar(message, {
                ...options,
                onClose: (event, reason) => {
                    if (options.onClose) {
                        options.onClose(event, reason);
                    }
                    // Dispatch action to remove snackbar from redux store
                    this.props.removeSnackbar(key);
                },
            });
            // Keep track of snackbars that we've displayed
            this.storeDisplayed(key);
        });
    }

    shouldComponentUpdate({ notifications: newSnacks = [], domain }: NotifierProps) {
        if (domain) {
            if (!this.props.domain || this.props.domain.domain != domain.domain) {
                this.subscribeToTenantOnboard(domain);
            }
        }

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

            if (notExists) continue;
            notExists = notExists || !currentSnacks.filter(({ key }) => newSnack.key === key).length;
        }
        return notExists;
    }

    storeDisplayed = (id: React.ReactText) => {
        this.displayed = [...this.displayed, id];
    };

    private subscribeToTenantOnboard(domain: DomainState) {
        if (domain && domain.domain && domain.status === StatusEnum.PENDING) {
            if (this.channel && this.channel.subscribed) {
                this.channel.unbind_all();
                this.pusher.disconnect();
            }
            this.channel = this.pusher.subscribe(`ranger-labs-${domain.domain}`);
            this.channel.bind("tenant-onboard", RegistrationHandler);
        }
    }

    componentDidMount() {
        this.pusher = new Pusher("aed7ba7c7247aca9680e", {
            cluster: "us2",
            forceTLS: true,
        });
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

export default withSnackbar(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Notifier)
);
