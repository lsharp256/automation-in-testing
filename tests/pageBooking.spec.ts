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

test('Create successful booking', async({page, context}) =>{
    await context.clearCookies()
    await page.getByRole('button', {name: "Book this room"}).first().click()
    await page.getByPlaceholder('Firstname').fill('Jesse')
    await page.getByPlaceholder('Lastname').fill('Pinkman')
    await page.getByPlaceholder('Email').first().fill('desertlabs@pinkman.net')
    await page.getByPlaceholder('Phone').first().fill('212345678911')

    // Get today's date and add days for check-in and check-out
    const today = new Date();
    const checkInDate = new Date(today)
    checkInDate.setDate(today.getDate() + 1) // Check-in: today + 2 days
    const checkOutDate = new Date(today)
    checkOutDate.setDate(today.getDate() + 4)

    // Format dates for assertion (YYYY-MM-DD)
    const checkInFormatted = checkInDate.toISOString().split('T')[0]
    const checkOutFormatted = checkOutDate.toISOString().split('T')[0]

    // Select check-in and check-out dates
    const checkInElement = page.locator('.rbc-button-link').getByText(checkInDate.getDate().toString(), { exact: true })
    const checkOutElement = page.locator('.rbc-button-link').getByText(checkOutDate.getDate().toString(), { exact: true })

    await checkInElement.waitFor()
    await checkOutElement.waitFor()

    const startBox = await checkInElement.boundingBox()
    const endBox = await checkOutElement.boundingBox()

    if (startBox && endBox){
        await page.mouse.move(startBox.x + startBox.width / 2, startBox.y + startBox.height / 2)
        await page.mouse.down() // Hold mouse down

        // Drag to the end date
        await page.mouse.move(endBox.x + endBox.width / 2, endBox.y + endBox.height / 2, { steps: 10 })
        await page.mouse.up() // Release mouse
    }

    await page.getByRole('button', {name: "Book"}).first().click()
    
    const successMessage = await page.locator('.ReactModalPortal').textContent()

    // expect(successMessage).toContain('Booking Successful!')
    // not getting the correct message - needs a fix
    expect(successMessage).toContain(`Booking Successful!Congratulations! Your booking has been confirmed for:${checkInFormatted} - ${checkOutFormatted}Close`)
})