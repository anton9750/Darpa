import { View } from "./View";

export class AboutView extends View {
    public render(): string {
        return `
            <section class="content-section about-hero">
                <h1>About the System</h1>
                <p>This portfolio piece showcases modular state design patterns without relying on monolithic frontend frameworks.</p>
            </section>
        `;
    }
}