export function getBaseUrl(env) {
    switch (env) {
        case 'prod':
            return process.env.BASE_PROD_URL;
        case 'test':
            return process.env.BASE_TEST_URL;
        case 'homol':
        default:
            return process.env.BASE_HOMOL_URL;
    }
}
