// pages/common/mediaManager.ts
import { expect, Locator, Page } from '@playwright/test';

/**
 * MediaManager — Reusable handler for the WordPress media library dialog.
 *
 * Composition pattern (same as ChatManager):
 *   const mediaManager = new MediaManager(page);
 *
 * Usage in any page object:
 *   // 1. Page object clicks its own trigger button
 *   await this.uploadImageButton.click();
 *   // 2. MediaManager handles everything inside the media library
 *   await this.mediaManager.uploadFromURL(imageUrl);
 *
 * Handles the full dialog flow:
 *   Insert Media heading → Upload Files → Add from URL → fill URL
 *   → Add media → Attachment Details → Select
 */
export class MediaManager {
    readonly page: Page;

    private readonly insertMediaHeading: Locator;
    private readonly uploadFilesButton: Locator;
    private readonly addFromURLButton: Locator;
    private readonly urlInput: Locator;
    private readonly addMediaButton: Locator;
    private readonly attachmentDetailsHeading: Locator;
    private readonly selectButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.insertMediaHeading = page.getByRole('heading', { name: 'Insert Media' });
        this.uploadFilesButton = page.getByRole('button', { name: 'Upload Files' });
        this.addFromURLButton = page.getByRole('button', { name: 'Add from URL' });
        this.urlInput = page.getByRole('textbox', { name: 'https://' });
        this.addMediaButton = page.getByRole('button', { name: 'Add media' });
        this.attachmentDetailsHeading = page.getByRole('heading', { name: 'Attachment Details' });
        this.selectButton = page.getByRole('button', { name: 'Select' });
    }

    /**
     * Complete the media library upload flow from a URL.
     *
     * Call this AFTER your page object has already clicked the trigger button
     * that opens the media library (e.g. "Upload Image").
     *
     * @param imageUrl - The direct URL of the image to upload
     */
    async uploadFromURL(imageUrl: string): Promise<void> {
        // Confirm the media library dialog opened
        await expect(this.insertMediaHeading).toBeVisible({ timeout: 10000 });

        // Switch to the Upload Files tab
        await this.uploadFilesButton.click();
        await this.page.waitForLoadState('domcontentloaded');

        // Switch to the Add from URL sub-tab
        await this.addFromURLButton.click();
        await this.page.waitForLoadState('domcontentloaded');

        // Fill in the image URL
        await this.urlInput.click();
        await this.urlInput.fill(imageUrl);

        // Submit the URL — media library fetches and previews the image
        await this.addMediaButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        // Confirm the image was loaded successfully
        await expect(this.attachmentDetailsHeading).toBeVisible({ timeout: 10000 });
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        // Insert the image into the page
        await this.selectButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }
}
