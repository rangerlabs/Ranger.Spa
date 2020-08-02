import ReduxStore from '../ReduxStore';
import { AssertionError } from 'assert';
import GlobalConfig from '../helpers/GlobalConfig';
import { camelCase } from 'change-case';

export interface IError {
    message: string;
    formikErrors: IFormikErrors;
}

export interface IFormikErrors {
    [key: string]: string | string[];
}

interface IValidationError {
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

export interface IRawRestResponse<T> {
    statusCode: number;
    message: string;
    isError: boolean;
    error?: IApiError;
    result?: T;
    correlationId?: string;
}

interface IApiError {
    message: string;
    validationErrors: IValidationError[];
}

export default class RestUtilities {
    private static baseAddress = 'https://' + GlobalConfig.API_HOST + GlobalConfig.BASE_PATH;

    private static toFormikErrors(error: IApiError) {
        const errors: IFormikErrors = {};
        error.validationErrors.forEach((v) => {
            const name = camelCase(v.name);
            if (errors[name]) {
                if (Array.isArray(errors[name])) {
                    errors[name] = [...errors[name], v.reason];
                } else {
                    errors[name] = [errors[name] as string, v.reason];
                }
            } else {
                errors[name] = v.reason;
            }
        });
        const formikErrors = {
            message: error.message,
            formikErrors: errors,
        } as IError;
        return formikErrors;
    }

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
                    error: isError ? this.toFormikErrors(responseContentJson.error) : undefined,
                    result: isError ? undefined : responseContentJson.result,
                    correlationId: correlationId,
                };
                return response;
            });
    }

    private static assertIsRestResponse(object: any): asserts object is IRawRestResponse<any> {
        if (
            !(object as IRawRestResponse<any>).statusCode &&
            !(object as IRawRestResponse<any>).message &&
            !(object as IRawRestResponse<any>).isError &&
            (!(object as IRawRestResponse<any>).error || !(object as IRawRestResponse<any>).result)
        ) {
            throw new AssertionError({ message: 'Value not a valid IRawRestResponse!' });
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
