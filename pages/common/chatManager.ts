// pages/common/chatManager.ts
import { expect, Locator, Page } from '@playwright/test';

/**
 * ChatManager - Reusable page object for handling chat widget across all pages
 * 
 * Usage:
 * const chatManager = new ChatManager(page);
 * await chatManager.closeChat();
 */
export class ChatManager {
    readonly page: Page;
    readonly openChatButton: Locator;
    readonly closeChatButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.openChatButton = page.getByRole('button', { name: 'Open chat' });
        this.closeChatButton = page.getByRole('button', { name: 'Close chat' });
    }

    /**
     * Close chat if visible (optional - skip if not present)
     * If "Chat with Dokan" button is visible: Click open → wait 1s → click close
     * If chat widget doesn't exist: Continue to next steps
     */
    async closeChat() {
        // Check if "Chat with Dokan" button exists
        const chatWithDokanButton = this.page.getByRole('button', { name: 'Chat with Dokan' });
        const chatExists = await chatWithDokanButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (chatExists) {
            // Click "Open chat" button
            await this.openChatButton.click();

            // Wait 1 second
            await this.page.waitForTimeout(1000);

            // Click close button
            await this.closeChatButton.click();
        }
    }
}