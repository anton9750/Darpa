import { Router } from "../router/Router";
import { PageModel } from "../models/PageModel";
import { ProductModel } from "../models/ProductModel";
import { CartModel } from "../models/CartModel";
import { NotificationModel } from "../models/NotificationModel";
import { TelemetryModel } from "../models/TelemetryModel";
import { HomeView } from "../views/HomeView";
import { AboutView } from "../views/AboutView";
import { LoginView } from "../views/LoginView";
import { ProductView } from "../views/ProductView";
import { CartView } from "../views/CartView";
import { NotFoundView } from "../views/NotFoundView";
import { CheckoutView } from "../views/CheckoutView";
import { TelemetryView } from "../views/TelemetryView";
import { NotificationView } from "../views/NotificationView";
import { AudioEngine } from "../services/AudioEngine";

export class NavigationController {
    private appContainer: HTMLElement;
    private toastAnchor: HTMLElement;
    private productModel: ProductModel;
    private cartModel: CartModel;
    private notifyModel: NotificationModel;
    private telemetryModel: TelemetryModel;
    private notifyView: NotificationView;
    private audio: AudioEngine;

    // Runtime state parameter for dynamic searching/filtering tracking mechanisms
    private searchQuery: string = "";

    constructor(private router: Router, private model: PageModel) {
        const start = performance.now();
        this.appContainer = document.getElementById("app") || document.body;
        this.toastAnchor = document.getElementById("toast-injector") || document.body;

        this.productModel = new ProductModel();
        this.cartModel = new CartModel();
        this.notifyModel = new NotificationModel();
        this.telemetryModel = new TelemetryModel();
        this.notifyView = new NotificationView();
        this.audio = new AudioEngine();

        this.setupRoutes();
        this.setupInterceptors();
        this.setupStateSubscriptions();

        this.updateActiveNavLinks(window.location.pathname);
        this.updateNavbarAuthUI(this.model.getState().isLoggedIn);
        this.attachGlobalUIHandlers();

        this.telemetryModel.logEvent("Framework Assembly Completed", performance.now() - start);
    }

    private setupRoutes(): void {
        const homeView = new HomeView();
        const aboutView = new AboutView();
        const loginView = new LoginView();
        const productView = new ProductView();
        const checkoutView = new CheckoutView();
        const telemetryView = new TelemetryView();
        const notFoundView = new NotFoundView();

        this.router.register("/", () => {
            const t = performance.now();
            this.model.updatePath("/");
            this.appContainer.innerHTML = homeView.render();
            this.attachHomeListeners();
            this.telemetryModel.logEvent("Home Route Painted", performance.now() - t);
        });

        // PROTECTED ROUTE GUARD: Intercepts route requests and halts unauthenticated navigation loops
        this.router.register("/shop", () => {
            const t = performance.now();
            if (!this.model.getState().isLoggedIn) {
                this.audio.playError();
                this.notifyModel.trigger("ROUTE ACCESS DENIED: SECURE CREDS REQUIRED", "ALERT");
                this.router.navigate("/login");
                return;
            }
            this.model.updatePath("/shop");
            this.renderFilteredShop(productView);
            this.productModel.fetchProducts();
            this.telemetryModel.logEvent("Shop Route Allocated & Loaded", performance.now() - t);
        });

        this.router.register("/cart", () => {
            const t = performance.now();
            this.model.updatePath("/cart");
            const cartView = new CartView();
            cartView.updateState(this.cartModel.getItems(), this.cartModel.getTotalPrice());
            this.appContainer.innerHTML = cartView.render();
            this.attachCartListeners();
            this.telemetryModel.logEvent("Cart Inventory Rendered", performance.now() - t);
        });

        this.router.register("/checkout", () => {
            const t = performance.now();
            this.model.updatePath("/checkout");
            checkoutView.setTotal(this.cartModel.getTotalPrice());
            this.appContainer.innerHTML = checkoutView.render();
            this.attachCheckoutListeners();
            this.telemetryModel.logEvent("Checkout Encryption Window Opened", performance.now() - t);
        });

        this.router.register("/about", () => {
            this.model.updatePath("/about");
            this.appContainer.innerHTML = aboutView.render();
            
            // Embed telemetry dashboard subsystem inside the view frame dynamically
            const telemetryContainer = document.createElement("div");
            telemetryContainer.className = "mt-12";
            telemetryView.updateState(this.telemetryModel.getLogs());
            telemetryContainer.innerHTML = telemetryView.render();
            this.appContainer.appendChild(telemetryContainer);
        });

        this.router.register("/login", () => {
            this.model.updatePath("/login");
            this.appContainer.innerHTML = loginView.render();
            this.attachLoginListeners();
        });

        this.router.registerNotFound(() => {
            this.audio.playError();
            this.model.updatePath("/404");
            this.appContainer.innerHTML = notFoundView.render();
            this.telemetryModel.logEvent("404 Route Intercept Exception Caught", 0);
        });
    }

    private setupStateSubscriptions(): void {
        this.model.subscribe((state) => {
            this.updateActiveNavLinks(state.currentPath);
            this.updateNavbarAuthUI(state.isLoggedIn);
        });

        this.productModel.subscribe(() => {
            if (this.model.getState().currentPath === "/shop") {
                const productView = new ProductView();
                this.renderFilteredShop(productView);
            }
        });

        this.cartModel.subscribe(() => {
            this.updateCartCounterUI(this.cartModel.getItems().length);
        });

        this.telemetryModel.subscribe(() => {
            if (this.model.getState().currentPath === "/about") {
                this.router.handleRoute("/about");
            }
        });

        // FIXED: Invokes class-scoped notifyView cleanly, eliminating contextual reference issues
        this.notifyModel.subscribe(() => {
            this.notifyView.updateState(this.notifyModel.getNotifications());
            if (this.toastAnchor) {
                this.toastAnchor.innerHTML = this.notifyView.render();
            }
        });
    }

    private renderFilteredShop(view: ProductView): void {
        const filteredList = this.productModel.getProducts().filter(product => 
            product.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        view.updateState(filteredList, this.productModel.getLoadingStatus(), this.productModel.getError());
        
        const searchBarHtml = `
            <div class="mb-6 max-w-md">
                <label class="block font-mono text-[10px] uppercase text-neutral-400 mb-1.5">// STREAMED ASSET REAL-TIME FILTER</label>
                <input type="text" id="shop-search" value="${this.searchQuery}" placeholder="Type system search descriptors..." class="w-full border border-neutral-300 px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-neutral-900 bg-white" />
            </div>
        `;

        this.appContainer.innerHTML = searchBarHtml + view.render();
        this.attachShopListeners();

        const searchInput = document.getElementById("shop-search") as HTMLInputElement;
        if (searchInput) {
            searchInput.focus();
            searchInput.setSelectionRange(this.searchQuery.length, this.searchQuery.length);
            
            searchInput.addEventListener("input", (e) => {
                const startFilter = performance.now();
                this.searchQuery = (e.target as HTMLInputElement).value;
                this.renderFilteredShop(view);
                this.telemetryModel.logEvent(`Inventory Filter Applied: "${this.searchQuery}"`, performance.now() - startFilter);
            });
        }
    }

    private attachHomeListeners(): void {
        const pieces = document.querySelectorAll(".data-piece") as NodeListOf<HTMLElement>;

        document.getElementById("scatter-btn")?.addEventListener("click", () => {
            const t = performance.now();
            this.audio.playClick();
            pieces.forEach(p => {
                p.style.transform = `translate(${Math.floor(Math.random() * 160) - 80}px, ${Math.floor(Math.random() * 160) - 80}px) rotate(${Math.floor(Math.random() * 180) - 90}deg)`;
                p.style.opacity = "0.5";
            });
            this.notifyModel.trigger("MATRIX DISPLACEMENT PARAMETERS SET", "WARNING");
            this.telemetryModel.logEvent("Puzzle Grid Scattered", performance.now() - t);
        });

        document.getElementById("snap-btn")?.addEventListener("click", () => {
            const t = performance.now();
            this.audio.playClick();
            pieces.forEach(p => { p.style.transform = "translate(0px, 0px) rotate(0deg)"; p.style.opacity = "1"; });
            this.notifyModel.trigger("GRID VECTOR EQUILIBRIUM RESTORED", "SUCCESS");
            this.telemetryModel.logEvent("Puzzle Grid Re-assembled", performance.now() - t);
        });
    }

    private attachShopListeners(): void {
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                this.audio.playClick();
                const target = e.target as HTMLButtonElement;
                const id = parseInt(target.getAttribute("data-id") || "0");
                const item = this.productModel.getProducts().find(p => p.id === id);
                if (item) {
                    this.cartModel.addToCart(item);
                    this.notifyModel.trigger(`ALLOCATED: ${item.title.toUpperCase()}`);
                    this.telemetryModel.logEvent(`Item Appended to State ID: ${id}`, 2);
                }
            });
        });
    }

    private attachCartListeners(): void {
        document.getElementById("checkout-btn")?.addEventListener("click", () => {
            this.audio.playClick();
            this.router.navigate("/checkout");
        });
    }

    private attachCheckoutListeners(): void {
        document.getElementById("gateway-form")?.addEventListener("submit", (e) => {
            e.preventDefault();
            this.audio.playClick();

            const overlay = document.getElementById("payment-processing");
            const statusText = document.getElementById("gateway-status");
            const percentText = document.getElementById("gateway-percent");
            const progressBar = document.getElementById("gateway-progress");
            const submitBtn = document.querySelector("#gateway-form button") as HTMLButtonElement;

            if (!overlay || !statusText || !percentText || !progressBar || !submitBtn) return;

            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.4";
            overlay.classList.remove("hidden");

            let currentProgress = 0;
            const steps = [
                { limit: 30, text: "ROUTING LEDGER BLOCK PACKETS..." },
                { limit: 65, text: "DECRYPTING NODE HANDSHAKE CHANNELS..." },
                { limit: 90, text: "SETTLING VALUATION BALANCE TO TRANSACTION POOL..." },
                { limit: 100, text: "CLEARANCE SETTLED SUCCESSFUL." }
            ];

            const interval = setInterval(() => {
                currentProgress += Math.floor(Math.random() * 8) + 2;
                if (currentProgress > 100) currentProgress = 100;

                progressBar.style.width = `${currentProgress}%`;
                percentText.innerText = `${currentProgress}%`;

                const currentStep = steps.find(s => currentProgress <= s.limit) || steps[steps.length - 1];
                statusText.innerText = currentStep.text;

                if (currentProgress === 100) {
                    clearInterval(interval);
                    this.audio.playClick();
                    this.notifyModel.trigger("ORDER AUTHORIZED AND COMPLETED", "SUCCESS");
                    this.telemetryModel.logEvent("Checkout Ledger Payment Processed Successfully", 1800);
                    this.cartModel.clearCart();
                    setTimeout(() => this.router.navigate("/"), 1200);
                }
            }, 150);
        });
    }

    private attachLoginListeners(): void {
        document.getElementById("login-form")?.addEventListener("submit", (e) => {
            e.preventDefault();
            const u = (document.getElementById("username") as HTMLInputElement).value;
            const p = (document.getElementById("password") as HTMLInputElement).value;
            if (u === "admin" && p === "darpa2026") {
                this.audio.playClick();
                this.model.setLoginStatus(true);
                this.notifyModel.trigger("AUTHORIZATION MATRIX VERIFIED", "SUCCESS");
                this.router.navigate("/shop");
            } else {
                this.audio.playError();
                this.notifyModel.trigger("PASSPHRASE FAILURE", "ALERT");
            }
        });
    }

    private setupInterceptors(): void {
        document.addEventListener("click", (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");
            if (anchor && anchor.getAttribute("href")?.startsWith("/")) {
                e.preventDefault();
                this.audio.playClick();
                this.router.navigate(anchor.getAttribute("href")!);
            }
        });
    }

    private updateActiveNavLinks(path: string): void {
        document.querySelectorAll("nav a").forEach(link => {
            if (link.getAttribute("href") === path) {
                link.classList.add("text-lime-500", "font-black");
            } else {
                link.classList.remove("text-lime-500", "font-black");
            }
        });
    }

    private updateNavbarAuthUI(isLoggedIn: boolean): void {
        const authLink = document.getElementById("nav-auth-link");
        if (authLink) {
            if (isLoggedIn) {
                authLink.setAttribute("href", "/");
                authLink.innerText = "Logout";
                authLink.onclick = (e) => { e.preventDefault(); this.audio.playClick(); this.model.setLoginStatus(false); this.router.navigate("/"); };
            } else {
                authLink.setAttribute("href", "/login");
                authLink.innerText = "Login";
                authLink.onclick = null;
            }
        }
    }

    private updateCartCounterUI(count: number): void {
        const counter = document.getElementById("cart-counter");
        if (counter) counter.innerText = count.toString();
    }

    private attachGlobalUIHandlers(): void {
        document.getElementById("mute-toggle")?.addEventListener("click", (e) => {
            const btn = e.target as HTMLButtonElement;
            const muted = this.audio.toggleMute();
            btn.innerText = muted ? "🔇 AUDIO_OFF" : "🔊 AUDIO_ON";
            btn.classList.toggle("text-red-400", muted);
        });
    }
}