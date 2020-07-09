import RestUtilities, { IRestResponse } from './RestUtilities';
import IContactForm from '../models/landing/IContactForm';

export default class ContactService {
    async postContactForm(contactForm: IContactForm): Promise<IRestResponse<void>> {
        return RestUtilities.post<void>('/contact', contactForm);
    }
}
