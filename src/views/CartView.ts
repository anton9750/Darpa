import { View } from "./View";
import { CartItem } from "../models/CartModel";

export class CartView extends View {
    private items: CartItem[] = [];
    private total: number = 0;

    public updateState(items: CartItem[], total: number): void {
        this.items = items;
        this.total = total;
    }

    public render(): string {
        if (this.items.length === 0) {
            return `
                <div class="max-w-md mx-auto my-20 text-center border border-dashed border-neutral-300 p-12">
                    <p class="font-mono text-xs text-neutral-400 uppercase tracking-widest">Manifest Terminal Clear // Empty Cart</p>
                    <a href="/shop" class="inline-block mt-4 bg-neutral-900 text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2.5">Return to Hardware Deck</a>
                </div>
            `;
        }

        const itemsList = this.items.map(item => `
            <div class="flex justify-between items-center border-b border-neutral-200 py-4 font-mono text-xs">
                <div>
                    <p class="font-bold text-sm text-neutral-900 uppercase">${item.product.title}</p>
                    <p class="text-neutral-400 text-[10px]">UNIT ALLOCATION PRICE: $${item.product.price}</p>
                </div>
                <div class="text-right">
                    <p class="text-neutral-900 font-bold">QTY: ${item.quantity}</p>
                    <p class="text-lime-600 font-bold">$${item.product.price * item.quantity}</p>
                </div>
            </div>
        `).join("");

        return `
            <div class="max-w-2xl mx-auto bg-white border border-neutral-300 p-8 shadow-sm">
                <h2 class="text-xl font-black uppercase tracking-tight mb-6">📋 Operations Manifest</h2>
                <div class="divide-y divide-neutral-200">
                    ${itemsList}
                </div>
                <div class="mt-6 flex justify-between items-center border-t-2 border-neutral-900 pt-4">
                    <span class="font-mono text-xs uppercase font-black tracking-wider">Total Aggregation Value</span>
                    <span class="text-xl font-black text-neutral-900 font-mono">$${this.total}</span>
                </div>
                <button id="checkout-btn" class="w-full mt-6 bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider py-3.5 hover:bg-neutral-800 transition-colors cursor-pointer">
                    Authorize Dispatch Order
                </button>
            </div>
        `;
    }
}