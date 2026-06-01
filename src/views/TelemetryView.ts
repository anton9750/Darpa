import { View } from "./View";
import { PerformanceMetric } from "../models/TelemetryModel";

export class TelemetryView extends View {
    private logs: PerformanceMetric[] = [];

    public updateState(logs: PerformanceMetric[]): void {
        this.logs = logs;
    }

    public render(): string {
        const logLines = this.logs.map(log => `
            <div class="flex justify-between items-center border-b border-neutral-800 py-1.5 font-mono text-[10px] tracking-tight">
                <span class="text-neutral-500">[${log.timestamp}]</span>
                <span class="text-lime-400 font-bold flex-grow pl-4">${log.event}</span>
                <span class="text-neutral-300 bg-neutral-800 px-1.5">${log.durationMs.toFixed(1)}ms</span>
            </div>
        `).join("");

        return `
            <div class="bg-neutral-950 border border-neutral-800 p-6 text-neutral-200 font-mono shadow-xl max-w-4xl mx-auto">
                <div class="border-b border-neutral-800 pb-3 mb-4 flex justify-between items-center">
                    <div>
                        <h2 class="text-sm font-black text-white uppercase tracking-widest">// SECURE TELEMETRY LINK</h2>
                        <p class="text-[9px] text-neutral-500">REAL-TIME EXECUTION METRICS // PROFILER ACTIVE</p>
                    </div>
                    <span class="h-2 w-2 rounded-full bg-lime-500 animate-ping"></span>
                </div>
                <div class="h-64 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
                    ${logLines || '<div class="text-neutral-600 text-xs text-center py-10">AWAITING SYSTEM INTERACTION...</div>'}
                </div>
            </div>
        `;
    }
}