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

    public static get PUSHER_API_KEY(): string {
        if (window.location.host.includes('localhost')) {
            return 'aed7ba7c7247aca9680e';
        } else if (window.location.host.includes('rangerlabs-staging')) {
            return '85f307728343fb4f9257';
        } else {
            return '0446e961be4e192bd342';
        }
    }

    public static get GOOGLE_MAPS_API_KEY(): string {
        if (window.location.host.includes('localhost')) {
            return 'AIzaSyCFnqUWfag20Li24AXGUEQigqK8y-Fhakk';
        } else if (window.location.host.includes('rangerlabs-staging')) {
            return 'AIzaSyBs_XgfpRN4B8Af7UjoJhSvj5BtR71Zv6U';
        } else {
            return 'AIzaSyBs_XgfpRN4B8Af7UjoJhSvj5BtR71Zv6U';
        }
    }

    public static get ENVIRONMENT(): string {
        if (window.location.host.includes('localhost')) {
            return 'development';
        } else if (window.location.host.includes('rangerlabs-staging')) {
            return 'staging';
        } else {
            return 'production';
        }
    }

    public static get CHARGE_BEE_SITE(): string {
        if (window.location.host.includes('localhost')) {
            return 'rangerlabs-test';
        } else if (window.location.host.includes('rangerlabs-staging')) {
            return 'rangerlabs-test';
        } else {
            return 'rangerlabs';
        }
    }
}
