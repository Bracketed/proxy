declare global {
	namespace NodeJS {
		interface ProcessEnv {
			EXPRESS_PORT: string;
			PROXY_TOKEN: string;
		}
	}
}

export {};
