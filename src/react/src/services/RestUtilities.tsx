import UserManager from "../services/UserManager";
import ReduxStore from "../ReduxStore";
import TheatersRounded from "@material-ui/icons/TheatersRounded";
import { openDialog, DialogContent } from "../redux/actions/DialogActions";

export interface IErrorContent {
    errors: { [key: string]: string[] };
    title: string;
    [key: string]: any;
}

export interface IRestResponse<T> {
    is_error?: boolean;
    error_content?: IErrorContent;
    content?: T;
}

export default class RestUtilities {
    private static baseAddress = "http://" + API_HOST + BASE_PATH;

    static get<T>(url: string): Promise<IRestResponse<T>> {
        url = RestUtilities.FormatUrl(url);
        return RestUtilities.request<T>("GET", url);
    }

    static delete(url: string): Promise<IRestResponse<void>> {
        url = RestUtilities.FormatUrl(url);
        return RestUtilities.request<void>("DELETE", url);
    }

    static put<T>(url: string, data: any): Promise<IRestResponse<T>> {
        url = RestUtilities.FormatUrl(url);
        return RestUtilities.request<T>("PUT", url, data);
    }

    static post<T>(url: string, data: any): Promise<IRestResponse<T>> {
        url = RestUtilities.FormatUrl(url);
        return RestUtilities.request<T>("POST", url, data);
    }

    static request<T>(method: string, url: string, data: any = null): Promise<IRestResponse<T>> {
        const user = ReduxStore.getStore().getState().oidc.user;
        let isBadRequest = false;
        let body = data;
        let headers = new Headers();

        if (user) {
            const accessToken = user.access_token;
            headers.set("Authorization", `Bearer ${accessToken}`);
        }
        headers.set("Accept", "application/json");
        headers.set("Domain", location.host.split(".")[0]);
        headers.set("Content-Type", "application/json");
        if (data) {
            body = JSON.stringify(data);
        }

        return fetch(url, {
            method: method,
            headers: headers,
            body: body,
        })
            .catch(response => {
                const store = ReduxStore.getStore();
                // const action = openDialog({ message: "An error occured. Fuck." } as DialogContent);
                // store.dispatch(action);
            })
            .then((response: Response) => {
                isBadRequest = response.status >= 400 && response.status < 500;
                return response.json();
            })
            .then((responseContent: any) => {
                let response: IRestResponse<T> = {
                    is_error: isBadRequest,
                    error_content: isBadRequest ? responseContent : null,
                    content: isBadRequest ? null : responseContent,
                };
                return response;
            });
    }
    private static FormatUrl(url: string) {
        if (url.startsWith("/")) {
            url = this.baseAddress + url;
        } else {
            url = this.baseAddress + "/" + url;
        }
        return url;
    }
}
