import IOrganizationForm from '../IOrganizationForm';
import IUserForm from './IUserForm';

export default interface IReviewForm {
    organizationForm: IOrganizationForm;
    userForm: IUserForm;
}
