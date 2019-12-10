import Breadcrumb from "./Breadcrumb";

export default class BreadcrumbPath {
    constructor(public breadcrumbs: Array<Breadcrumb>, public requiresLeadingProjectBreadcrumb: boolean = false) {}
}
