import Landing from "./landing/Landing";
import RoutePaths from "./RoutePaths";
import SignUp from "./landing/signup/SignUp";
import EnterDomain from "./landing/enterDomain/EnterDomain";
import ErrorPage from "./error/Error";
import LoginRedirect from "./landing/login/LoginRedirect";
import IRoute from "./ILandingRoute";
import Logout from "./auth/Logout";

export const WhiteListedComponents: IRoute[] = [
    { exact: true, path: "/error/:code?", component: ErrorPage },
    { exact: true, path: RoutePaths.Landing, component: Landing },
    { exact: true, path: RoutePaths.SignUp, component: SignUp },
    { exact: true, path: RoutePaths.EnterDomain, component: EnterDomain },
    { exact: true, path: RoutePaths.Login, component: LoginRedirect },
    { exact: true, path: RoutePaths.Logout, component: Logout },
];
