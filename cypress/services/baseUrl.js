export function getBaseUrl(env) {
    switch (env) {
        case 'prod':
            return process.env.BASE_PROD_URL || 'http://localhost:3000';
        case 'test':
            return 'http://localhost:3000';
        case 'homol':
        default:
            return process.env.BASE_HOMOL_URL || 'http://localhost:3000';
    }
}
