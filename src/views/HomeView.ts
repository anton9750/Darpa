import { View } from "./View";

export class HomeView extends View {
    public render(): string {
        const puzzlePieces = Array.from({ length: 16 })
            .map((_, i) => `<div class="cube data-piece" data-index="${i}"></div>`)
            .join("");

        return `
            <section class="text-center max-w-2xl mx-auto my-6">
                <h1 class="text-3xl font-black uppercase tracking-tighter mb-2">System Asset Frame Encryption</h1>
                <p class="font-mono text-xs text-neutral-500 mb-6">Interactive grid structural displacement engine.</p>
                <div class="flex justify-center gap-4 mb-8">
                    <button id="scatter-btn" class="border border-neutral-900 font-mono text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-neutral-900 hover:text-white transition-all cursor-pointer">Scatter Matrix</button>
                    <button id="snap-btn" class="bg-lime-500 border border-lime-500 font-mono text-[10px] uppercase tracking-wider px-4 py-2 text-neutral-950 font-bold transition-all cursor-pointer">Assemble Sync</button>
                </div>
            </section>

            <div class="jigsaw-container">
                ${puzzlePieces}
            </div>
        `;
    }
}