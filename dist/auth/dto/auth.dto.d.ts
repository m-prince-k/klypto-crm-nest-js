export declare class SignupDto {
    email: string;
    password: string;
    fullName: string;
    organizationName: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthTokensResponseDto {
    accessToken: string;
    refreshToken: string;
    roles?: string[];
    role?: string;
}
export declare class LogoutResponseDto {
    message: string;
}
export declare class UserOrganizationResponseDto {
    id: string;
    name: string;
}
export declare class ProfileResponseDto {
    id: string;
    email: string;
    fullName: string;
    organization: UserOrganizationResponseDto;
    roles: string[];
    isActive: boolean;
    createdAt: string;
}
