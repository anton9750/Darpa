import { Product } from "./ProductModel";

export interface CartItem {
    product: Product;
    quantity: number;
}

export class CartModel {
    private items: CartItem[] = [];
    private listeners: Array<() => void> = [];

    constructor() {
        this.loadFromStorage();
    }

    public getItems(): CartItem[] {
        return this.items;
    }

    public addToCart(product: Product): void {
        const existing = this.items.find(item => item.product.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ product, quantity: 1 });
        }
        this.saveToStorage();
    }

    public clearCart(): void {
        this.items = [];
        this.saveToStorage();
    }

    public getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    public subscribe(listener: () => void): void {
        this.listeners.push(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }

    private saveToStorage(): void {
        localStorage.setItem("darpa_cart_session", JSON.stringify(this.items));
        this.notifyListeners();
    }

    private loadFromStorage(): void {
        const data = localStorage.getItem("darpa_cart_session");
        if (data) {
            try {
                this.items = JSON.parse(data);
            } catch {
                this.items = [];
            }
        }
    }
}