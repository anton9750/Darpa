import { View } from "./View";

export class CheckoutView extends View {
    private totalAmount: number = 0;

    public setTotal(total: number): void {
        this.totalAmount = total;
    }

    public render(): string {
        return `
            <div class="max-w-md mx-auto bg-white border border-neutral-300 p-8 shadow-sm">
                <h2 class="text-xl font-black uppercase tracking-tight mb-2">💳 Encryption Node Checkout</h2>
                <p class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-6">Pipeline Value Allocation: $${this.totalAmount}</p>
                
                <form id="gateway-form" class="space-y-4">
                    <div>
                        <label class="block font-mono text-xs uppercase text-neutral-500 mb-1">Node Target Hash (Card Number)</label>
                        <input type="text" placeholder="xxxx xxxx xxxx xxxx" required class="w-full border border-neutral-300 px-3 py-2 text-sm font-mono focus:outline-none focus:border-neutral-900 bg-neutral-50" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-mono text-xs uppercase text-neutral-500 mb-1">Expiration</label>
                            <input type="text" placeholder="MM/YY" required class="w-full border border-neutral-300 px-3 py-2 text-sm font-mono focus:outline-none focus:border-neutral-900 bg-neutral-50" />
                        </div>
                        <div>
                            <label class="block font-mono text-xs uppercase text-neutral-500 mb-1">Security Signature</label>
                            <input type="password" placeholder="***" required class="w-full border border-neutral-300 px-3 py-2 text-sm font-mono focus:outline-none focus:border-neutral-900 bg-neutral-50" />
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider py-3.5 hover:bg-neutral-800 transition-colors cursor-pointer">
                        Execute Ledger Settlement
                    </button>
                </form>

                <!-- Processing Layer Mock Status Overlay -->
                <div id="payment-processing" class="mt-6 border border-neutral-300 bg-neutral-50 p-4 font-mono text-xs hidden">
                    <div class="flex justify-between font-bold mb-2">
                        <span id="gateway-status">PACKET ROUTING IN PROGRESS...</span>
                        <span id="gateway-percent">0%</span>
                    </div>
                    <div class="w-full bg-neutral-200 h-1.5 overflow-hidden">
                        <div id="gateway-progress" class="bg-lime-500 h-full w-0 transition-all duration-300"></div>
                    </div>
                </div>
            </div>
        `;
    }
}