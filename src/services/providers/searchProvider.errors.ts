type SearchProviderErrorType = 'network' | 'http' | 'schema' | 'unknown';

export class SearchProviderError extends Error {
	public type: SearchProviderErrorType;
	public status?: number;

	constructor(type: SearchProviderErrorType, message: string, status?: number) {
		super(message);
		this.name = 'SearchProviderError';
		this.type = type;
		this.status = status;
	}
}

export class SearchProviderHttpError extends SearchProviderError {
	constructor(status: number, message: string) {
		super('http', message, status);
	}
}

export class SearchProviderNetworkError extends SearchProviderError {
	constructor(message: string) {
		super('network', message);
	}
}

export class SearchProviderSchemaError extends SearchProviderError {
	constructor(status: number, message: string) {
		super('schema', message, status);
	}
}
