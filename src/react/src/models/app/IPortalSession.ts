export default interface IPortalSession {
    id: string;
    token: string;
    accessUrl: string;
    status: string;
    object: string;
    customerId: string;
    createdAt: string;
    expiresAt: string;
}
