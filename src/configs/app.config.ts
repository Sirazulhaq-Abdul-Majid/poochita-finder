export const appConfig = {
  originConfig: (origin: any, callback: any) => {
    if (
      !origin ||
      process.env.CORS_VALIDATION === 'false' ||
      process.env.CORS_ORIGINS_WHITELIST?.split(',').includes(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },

  isProductionEnv: process.env.NODE_ENV === 'production',
  isDevelopmentEnv: process.env.NODE_ENV === 'development',
  countryIdHeaderName: process.env.COUNTRY_ID_HEADER_NAME,
};
