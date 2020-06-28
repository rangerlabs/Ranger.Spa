import RestUtilities, { IRestResponse } from './RestUtilities';
import { DocumentationSectionEnum } from '../models/landing/DocumentationSectionEnum';

export default class GithubService {
    async getSection(section: DocumentationSectionEnum): Promise<IRestResponse<string>> {
        switch (section) {
            case DocumentationSectionEnum.GETTING_STARTED: {
                return RestUtilities.request<string>('GET', 'https://raw.githubusercontent.com/rangerlabs/Ranger.Docs/master/GettingStarted/GettingStarted.md');
            }
        }
    }
}
