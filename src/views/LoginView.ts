import { View } from "./View";

export class LoginView extends View {
    public render(): string {
        return `
            <div class="max-w-md mx-auto my-12 bg-white border border-neutral-300 p-8 shadow-sm">
                <h2 class="text-xl font-black uppercase tracking-tight mb-6">🔒 System Authentication</h2>
                
                <form id="login-form" class="space-y-4">
                    <div>
                        <label class="block font-mono text-xs uppercase text-neutral-500 mb-1">Operator ID</label>
                        <input type="text" id="username" required class="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-900 bg-neutral-50" />
                    </div>
                    <div>
                        <label class="block font-mono text-xs uppercase text-neutral-500 mb-1">Access Key</label>
                        <input type="password" id="password" required class="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-900 bg-neutral-50" />
                    </div>
                    <button type="submit" class="w-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider py-3 hover:bg-neutral-800 transition-colors cursor-pointer">
                        Initialize Session
                    </button>
                </form>
                <div id="login-error" class="text-red-500 font-mono text-xs mt-4 hidden"></div>
            </div>
        `;
    }
}