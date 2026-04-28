export function ciStep(scope: string, message: string): void {
    const ts = new Date().toISOString();
    console.log(`[${ts}] [${scope}] ${message}`);
}

