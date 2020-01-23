import { StatusEnum } from '../StatusEnum';
import CorrelationModel from '../CorrelationModel';

export default interface IUser {
    correlationModel: CorrelationModel;
    id: string; //assigned when correlationModel.status is Complete
    lastName: string;
    firstName: string;
    email: string;
    role: string;
    authorizedProjects?: string[];
    emailConfirmed: boolean;
}
