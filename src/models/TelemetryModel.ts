export interface PerformanceMetric {
    timestamp: string;
    event: string;
    durationMs: number;
}

export class TelemetryModel {
    private logs: PerformanceMetric[] = [];
    private listeners: Array<() => void> = [];

    public logEvent(event: string, durationMs: number): void {
        const metric: PerformanceMetric = {
            timestamp: new Date().toLocaleTimeString(),
            event: event.toUpperCase(),
            durationMs
        };
        this.logs.unshift(metric); // Keep newest logs at the top
        this.notifyListeners();
    }

    public getLogs(): PerformanceMetric[] {
        return this.logs;
    }

    public subscribe(listener: () => void): void {
        this.listeners.push(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }
}