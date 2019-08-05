import { ApplicationState } from "./stores/index";
import ConfigureStore from "./ConfigureStore";
import { AnyAction, Store } from "redux";
import { History } from "history";

export default class ReduxStore {
    private static Store: Store<ApplicationState, AnyAction> = null;

    static Configure(history: History, initialState: ApplicationState) {
        this.Store = ConfigureStore(history, initialState);
    }

    static getStore() {
        return this.Store;
    }

    static getState(): ApplicationState {
        return this.Store.getState();
    }
}
