import UserManager from '../services/UserManager';
import ReduxStore from '../ReduxStore';
import { openDialog, DialogContent } from '../redux/actions/DialogActions';
import { STATUS_CODES } from 'http';
import { AssertionError } from 'assert';

export interface IError {
    message: string;
    validationErrors: IValidationError[];
}

export interface IValidationError {
    name: string;
    reason: string;
}

export interface IRestResponse<T> {
    statusCode: number;
    message: string;
    isError: boolean;
    error?: IError;
    result?: T;
    correlationId?: string;
}

export default class RestUtilities {
    private static baseAddress = 'https://' + API_HOST + BASE_PATH;

    static get<T>(url: string): Promise<IRestResponse<T>> {
        url = RestUtilities.FormatUrl(url);
        return RestUtilities.request<T>('GET', url);
    }

    static delete(url: string, data?: any): Promise<IRestResponse<void>> {
        url = RestUtilities.FormatUrl(url);
        if (data) {
            return RestUtilities.request<void>('DELETE', url, data);
        } else {
            return RestUtilities.request<void>('DELETE', url);
        }
    }

    static put<T>(url: string, data: any): Promise<IRestResponse<T>> {
        url = RestUtilities.FormatUrl(url);
        return RestUtilities.request<T>('PUT', url, data);
    }

    static post<T>(url: string, data: any): Promise<IRestResponse<T>> {
        url = RestUtilities.FormatUrl(url);
        return RestUtilities.request<T>('POST', url, data);
    }

    static request<T>(method: string, url: string, data: any = null): Promise<IRestResponse<T>> {
        const user = ReduxStore.getStore().getState().oidc.user;
        let statusCode = 0;
        let message = '';
        let isError = false;
        let correlationId = '';
        let body = data;
        let headers = new Headers();

        if (user) {
            const accessToken = user.access_token;
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
        headers.set('Accept', 'application/json');
        headers.set('api-version', '1.0');
        headers.set('Content-Type', 'application/json');
        if (data) {
            body = JSON.stringify(data);
        }

        return fetch(url, {
            method: method,
            headers: headers,
            body: body,
        })
            .catch((response) => {
                // const store = ReduxStore.getStore();
                // const action = openDialog({ message: "An error occured." } as DialogContent);
                // store.dispatch(action);
            })
            .then((response: Response) => {
                isError = response.status === 304 || (response.status >= 400 && response.status <= 500) ? true : false;
                correlationId = response.headers.has('x-operation') ? response.headers.get('x-operation').replace('operations/', '') : null;
                statusCode = response.status;
                return response.text();
            })
            .then((responseContent: string) => {
                const responseContentJson = responseContent ? JSON.parse(responseContent) : undefined;
                this.assertIsRestResponse(responseContentJson);
                let response: IRestResponse<T> = {
                    statusCode: statusCode,
                    message: responseContentJson.message,
                    isError: isError,
                    error: isError ? (responseContentJson.error as IError) : undefined,
                    result: isError ? undefined : responseContentJson.result,
                    correlationId: correlationId,
                };
                return response;
            });
    }

    private static assertIsRestResponse(object: any): asserts object is IRestResponse<any> {
        if (
            !(object as IRestResponse<any>).statusCode &&
            !(object as IRestResponse<any>).message &&
            !(object as IRestResponse<any>).isError &&
            (!(object as IRestResponse<any>).error || !(object as IRestResponse<any>).result)
        ) {
            throw new AssertionError({ message: 'Value not a valid Rest Response!' });
        }
    }

    private static FormatUrl(url: string) {
        if (url.startsWith('/')) {
            url = this.baseAddress + url;
        } else {
            url = this.baseAddress + '/' + url;
        }
        return url;
    }
}
