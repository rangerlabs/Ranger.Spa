import Breadcrumb from "./Breadcrumb";

export default class BreadcrumbPath {
    constructor(public breadcrumbs: Array<Breadcrumb>, public requiresLeadingAppBreadcrumb: boolean = false) {}
}
