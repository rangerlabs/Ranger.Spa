export default interface IPasswordResetModel {
    domain: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}
