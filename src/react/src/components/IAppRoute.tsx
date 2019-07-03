import { RouteProps } from "react-router";
import BreadcrumbPath from "../models/app/BreadcrumbPath";

export default interface IAppRoute extends RouteProps {
    breadcrumbPath: BreadcrumbPath;
}
