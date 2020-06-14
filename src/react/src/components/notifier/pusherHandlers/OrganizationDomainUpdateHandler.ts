import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { DialogContent, openDialog } from '../../../redux/actions/DialogActions';
import { push } from 'connected-react-router';
import GlobalConfig from '../../../helpers/GlobalConfig';
import RoutePaths from '../../RoutePaths';

export default function OrganizationDomainUpdateHandler(data: PusherNotificationModel & { newDomain: string }): void {
    var openDialogAction = openDialog(
        new DialogContent(data.message, 'Domain update', 'Ok', () => {
            push('https://' + data.newDomain + '.' + GlobalConfig.SPA_HOST + RoutePaths.Login);
        })
    );
    const store = ReduxStore.getStore();
    store.dispatch(openDialogAction);
}
