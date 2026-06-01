import { View } from "./View";
import { Product } from "../models/ProductModel";

export class ProductView extends View {
    private products: Product[] = [];
    private isLoading: boolean = false;
    private error: string | null = null;

    // The controller passes the model's current state into this view
    public updateState(products: Product[], isLoading: boolean, error: string | null): void {
        this.products = products;
        this.isLoading = isLoading;
        this.error = error;
    }

    public render(): string {
        // State 1: Loading Terminal Screen
        if (this.isLoading) {
            return `
                <div class="flex flex-col items-center justify-center my-20 font-mono text-xs tracking-widest text-neutral-500">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-lime-500 mb-4"></div>
                    QUERYING DARPA SECURE CHANNELS...
                </div>
            `;
        }

        // State 2: Error Screen
        if (this.error) {
            return `
                <div class="max-w-md mx-auto my-12 border border-red-500 bg-red-50 p-6 font-mono text-xs text-red-600">
                    <p class="font-bold uppercase mb-2">🛑 CRITICAL EXCEPTION</p>
                    <p>${this.error}</p>
                </div>
            `;
        }

        // State 3: Render Product Grid UI
        const productGridHtml = this.products.map(product => `
            <div class="bg-white border border-neutral-300 shadow-sm flex flex-col justify-between group hover:border-neutral-900 transition-colors">
                <div class="p-4 border-b border-neutral-200 bg-neutral-50 overflow-hidden relative aspect-square">
                    <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                    <span class="absolute top-2 left-2 bg-neutral-900 text-white font-mono text-[10px] uppercase tracking-wider px-2 py-0.5">
                        ${product.category}
                    </span>
                </div>
                
                <div class="p-5 flex-grow flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start gap-4 mb-2">
                            <h3 class="font-black uppercase text-sm tracking-tight text-neutral-900">${product.title}</h3>
                            <span class="font-mono text-xs font-bold text-lime-600 bg-lime-50 border border-lime-200 px-2 py-0.5 whitespace-nowrap">
                                $${product.price}
                            </span>
                        </div>
                        <p class="text-xs text-neutral-500 leading-relaxed mb-4">${product.description}</p>
                    </div>

                    <button data-id="${product.id}" class="add-to-cart-btn w-full bg-neutral-900 text-white font-mono text-[10px] uppercase tracking-widest py-2.5 hover:bg-neutral-800 transition-colors cursor-pointer">
                        Acquire Asset
                    </button>
                </div>
            </div>
        `).join("");

        return `
            <div class="space-y-6">
                <div class="border-b border-neutral-300 pb-4">
                    <h1 class="text-2xl font-black uppercase tracking-tighter">Available Tactical Hardware</h1>
                    <p class="font-mono text-xs text-neutral-400">RESTRICTED CLEARANCE LEVEL REQUIRED // OVERVIEW</p>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${productGridHtml}
                </div>
            </div>
        `;
    }
}