export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    category: string;
}

export class ProductModel {
    private products: Product[] = [];
    private isLoading: boolean = false;
    private error: string | null = null;
    private listeners: Array<() => void> = [];

    // Fetch live items from a free, open API
    public async fetchProducts(): Promise<void> {
        this.isLoading = true;
        this.error = null;
        this.notifyListeners();

        try {
            // Fetching tech items to match the DARPA system theme
            const response = await fetch("https://dummyjson.com/products/category/smartphones");
            if (!response.ok) throw new Error("Network breach: Failed to fetch assets.");
            
            const data = await response.json();
            this.products = data.products;
        } catch (err: any) {
            this.error = err.message || "Unknown system failure.";
        } finally {
            this.isLoading = false;
            this.notifyListeners();
        }
    }

    public getProducts(): Product[] {
        return this.products;
    }

    public getLoadingStatus(): boolean {
        return this.isLoading;
    }

    public getError(): string | null {
        return this.error;
    }

    // Connects to the controller so the UI refreshes when data changes
    public subscribe(listener: () => void): void {
        this.listeners.push(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }
}