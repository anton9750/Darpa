import { View } from "./View";

export class NotFoundView extends View {
    public render(): string {
        return `
            <div class="flex flex-col items-center justify-center my-20 text-center animate-pulse">
                <h1 class="text-6xl font-black tracking-tighter text-neutral-900">404</h1>
                <div class="bg-red-500 text-white font-mono text-[10px] uppercase tracking-widest px-3 py-1 my-4">
                    CRITICAL: DESTINATION PATH BREACH
                </div>
                <p class="text-xs font-mono text-neutral-400 max-w-sm leading-relaxed mb-6">
                    The system parameters requested do not map to an authenticated subsystem address.
                </p>
                <a href="/" class="border-b-2 border-neutral-900 hover:border-lime-500 font-mono text-xs uppercase tracking-wider font-bold transition-colors">
                    Return to Safe Core Terminal
                </a>
            </div>
        `;
    }
}