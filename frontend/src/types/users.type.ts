export interface User {
    username: string,
    useremail: string,
    password: string
    displayName: string
    role: string
    avatar: string
    bio: string
    theme?: 'light' | 'dark'
    createdAt: string
    updatedAt: string
}
export interface LoginRequest {
    username: string,
    password: string
}
export interface RegisterRequest {
    username: string,
    useremail: string,
    password: string,
    displayName: string
}
export interface LoginSuccessResponse {
    access_token: string,
}