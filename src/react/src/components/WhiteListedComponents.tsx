import Landing from './landing/Landing';
import RoutePaths from './RoutePaths';
import SignUp from './landing/signup/SignUp';
import EnterDomain from './landing/enterDomain/EnterDomain';
import ErrorPage from './error/Error';
import LoginRedirect from './auth/LoginRedirect';
import IRoute from './ILandingRoute';
import LogoutRedirect from './auth/LogoutRedirect';
import Docs from './landing/documentation/Docs';
import Pricing from './landing/pricing/Pricing';
import Company from './landing/company/Company';
import ConfirmDomain from './landing/confirmations/ConfirmDomain';
import ConfirmUser from './landing/confirmations/ConfirmUser';
import PasswordReset from './landing/confirmations/PasswordReset';
import EmailChange from './landing/confirmations/EmailChange';
import TransferPrimaryOwnership from './landing/confirmations/TransferPrimaryOwnership';
import CancelTransferPrimaryOwnership from './landing/confirmations/CancelTransferPrimaryOwnership';

export const WhiteListedComponents: IRoute[] = [
    { exact: true, path: '/error/:code?', component: ErrorPage },
    { exact: true, path: RoutePaths.Landing, component: Landing },
    { exact: true, path: RoutePaths.SignUp, component: SignUp },
    { exact: true, path: RoutePaths.EnterDomain, component: EnterDomain },
    { exact: false, path: RoutePaths.Docs, component: Docs },
    { exact: true, path: RoutePaths.Company, component: Company },
    { exact: true, path: RoutePaths.Pricing, component: Pricing },
    { exact: true, path: RoutePaths.Login, component: LoginRedirect },
    { exact: true, path: RoutePaths.Logout, component: LogoutRedirect },
    { exact: true, path: RoutePaths.ConfirmDomain, component: ConfirmDomain },
    { exact: true, path: RoutePaths.ConfirmUser, component: ConfirmUser },
    { exact: true, path: RoutePaths.PasswordReset, component: PasswordReset },
    { exact: true, path: RoutePaths.EmailChange, component: EmailChange },
    { exact: true, path: RoutePaths.TransferPrimaryOwnership, component: TransferPrimaryOwnership },
    { exact: true, path: RoutePaths.CancelTransferPrimaryOwnership, component: CancelTransferPrimaryOwnership },
];
