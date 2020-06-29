import RestUtilities, { IRestResponse } from './RestUtilities';
import { DocumentationSectionEnum } from '../models/landing/DocumentationSectionEnum';

export default class GithubService {
    async getSection(section: DocumentationSectionEnum): Promise<IRestResponse<string>> {
        let statusCode = 0;
        let isError = false;

        switch (section) {
            case DocumentationSectionEnum.GETTING_STARTED: {
                return fetch('https://raw.githubusercontent.com/rangerlabs/Ranger.Docs/master/GettingStarted/GettingStarted.md', {
                    method: 'GET',
                    mode: 'cors',
                })
                    .then((response: Response) => {
                        isError = response.status === 304 || (response.status >= 400 && response.status <= 500) ? true : false;
                        statusCode = response.status;
                        return response.text();
                    })
                    .then((responseContent: string) => {
                        const responseContentJson = responseContent ? responseContent : undefined;
                        let response: IRestResponse<string> = {
                            statusCode: statusCode,
                            message: '',
                            isError: isError,
                            result: isError ? undefined : responseContentJson,
                        };
                        return response;
                    });
            }
        }
    }
}
