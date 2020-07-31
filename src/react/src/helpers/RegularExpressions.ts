export default class RegularExpressions {
    public static NAME = "^[a-zA-Z]{1,48}[\\_\\-\\,\\.\\']{0,1}$";
    public static PASSWORD_SPECIAL_CHARACTER = '[\\-\\`\\~\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\_\\+\\=\\{\\}\\[\\]\\\\|\\;\\:\\\'\\"\\,\\<\\.\\>\\/\\?]';
    public static PASSWORD_NUMBER = '[0-9]';
    public static PASSWORD_LOWERCASE_LETTER = '[a-z]';
    public static PASSWORD_UPPERCASE_LETTER = '[A-Z]';
    public static ORGANIZATION_NAME = "^[a-zA-Z0-9]{1}[a-zA-Z0-9_\\-\\s\\']{1,46}[a-zA-Z0-9]{1}$";
    public static ORGANIZATION_DOMAIN = '^[a-zA-Z0-9]{1}[a-zA-Z0-9\\-]{1,26}[a-zA-Z0-9]{1}$';
    public static PROJECT_NAME = "^[a-zA-Z0-9]+[a-zA-Z0-9\\_\\-\\'\\,\\.\\s]{1,126}[a-z0-9]{1}$";
    public static GEOFENCE_INTEGRATION_NAME = '^[a-z0-9]+[a-z0-9\\-]{1,126}[a-z0-9]{1}$';
}
