import * as React from "react";
import { withSnackbar, WithSnackbarProps } from "notistack";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { removeSnackbar, SnackbarNotification } from "../../redux/actions/SnackbarActions";
import { ApplicationState } from "../../stores";

interface NotifierProps extends WithSnackbarProps {
    notifications: SnackbarNotification[];
    removeSnackbar: (key: React.ReactText) => void;
}

class Notifier extends React.Component<NotifierProps> {
    displayed = [] as React.ReactText[];

    storeDisplayed = (id: React.ReactText) => {
        this.displayed = [...this.displayed, id];
    };

    shouldComponentUpdate({ notifications: newSnacks = [] }) {
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

    render(): any {
        return null;
    }
}

const mapStateToProps = (store: ApplicationState) => ({
    notifications: store.notifications,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ removeSnackbar }, dispatch);

export default withSnackbar(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Notifier)
);
