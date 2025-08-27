import config from "../config";

export function getMedplumAuthHeader(): string {
    if (!config.medplumClientId || !config.medplumClientSecret) {
        throw new Error("Medplum credentials not configured");
    }
    
    const credentials = `${config.medplumClientId}:${config.medplumClientSecret}`;
    const encoded = Buffer.from(credentials).toString('base64');
    return `Basic ${encoded}`;
}

export function isMedplumServer(url: string): boolean {
    return url.includes(config.medplumServerUrl);
}
