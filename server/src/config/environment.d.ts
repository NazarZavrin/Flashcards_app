declare global {
    namespace NodeJS {
        interface ProcessEnv {
            FRONT_END_URL?: string;
            ALLOW_UNDEFINED_ORIGIN: "true" | "false";
            JWT_ACCESS_SECRET: string;
            JWT_REFRESH_SECRET: string;
            SALT_ROUNDS: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_NAME: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }