import { test, expect } from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('https://automationintesting.online/')
    
    const hackButton = page.getByText('Let me hack!')
    
    if (await hackButton.isVisible()){
        hackButton.click()
    }
});

test('no email shows correct error message', async ({page}) => {
    await page.getByRole('button', {name: "Book this room"}).first().click()
    await page.getByPlaceholder('Firstname').fill('Walter')
    await page.getByPlaceholder('Lastname').fill('White')
    await page.getByPlaceholder('Phone').first().fill('112345678901')

    const today = new Date();
    const startDay = today.getDate(); // Today's date
    const endDay = today.getDate() + 2; 

    const startDate = page.locator('.rbc-button-link').getByText(startDay.toString(), { exact: true });
    const endDate = page.locator('.rbc-button-link').getByText(endDay.toString(), { exact: true });

    // Ensure elements exist before interacting
    await startDate.waitFor();
    await endDate.waitFor();

     // Drag to select date range
     const startBox = await startDate.boundingBox();
     const endBox = await endDate.boundingBox();

    if (startBox && endBox){
        await page.mouse.move(startBox.x + startBox.width / 2, startBox.y + startBox.height / 2);
        await page.mouse.down(); // Hold mouse down

        // Drag to the end date
        await page.mouse.move(endBox.x + endBox.width / 2, endBox.y + endBox.height / 2, { steps: 10 });
        await page.mouse.up(); // Release mouse
    }

    await page.getByRole('button', {name: "Book"}).first().click()

    const warningMessage = await page.locator('.alert-danger').textContent()
    expect(warningMessage).toContain('must not be empty')
})