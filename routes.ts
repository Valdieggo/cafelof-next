/**
 * An array of routes that are accessible to everyone
 * @type {string[]}
 */
export const publicRoutes: string[] = [
    "/",
    "/login",
    "/productos",
    "/contacto",
];

/**
 * An array of routes that are used for authentication
 * @type {string[]}
 */
export const authRoutes: string[] = [
    "/login",
    "/register",
];

/**
 * Prefix for the API routes
 * Routes that start with this prefix are used for API routes
 * @type {string}
 */
export const apiPrefix: string = "/api";

/**
 * Default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/";

/**
 * Default redirect path for admin users after logging in
 * @type {string}
 */
export const DEFAULT_ADMIN_LOGIN_REDIRECT: string = "/admin";