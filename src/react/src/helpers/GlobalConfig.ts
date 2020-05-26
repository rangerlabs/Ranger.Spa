import { getHost } from './Helpers';

export default class GlobalConfig {
    public static get IDENTITY_AUTHORITY(): string {
        if (window.location.host.includes('localhost')) {
            return 'localhost.io:5000';
        } else {
            return `${getHost()}/auth`;
        }
    }

    public static get API_HOST(): string {
        if (window.location.host.includes('localhost')) {
            return 'localhost.io:8081';
        } else {
            return getHost();
        }
    }

    public static get SPA_HOST(): string {
        if (window.location.host.includes('localhost')) {
            return 'localhost.io:8080';
        } else {
            return getHost();
        }
    }

    public static get BASE_PATH(): string {
        if (window.location.host.includes('localhost')) {
            return '';
        } else {
            return '/api';
        }
    }
}
