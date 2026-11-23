import { expect, test } from '@playwright/test';

test('index page renders the editor and the default diagram', async ({ page }) => {
	await page.goto('/mermaid-gpt/');
	await expect(page.getByText('Resulting Graph')).toBeVisible();
	await expect(page.locator('#editor .monaco-editor')).toBeVisible();
	await expect(page.locator('#graph svg')).toBeVisible();
	await expect(page.locator('#graph svg')).toContainText('NAMED-DRIVER');
});
