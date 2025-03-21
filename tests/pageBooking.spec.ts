import { test, expect } from '@playwright/test'

test.describe("Booking page", () => {
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
        const checkInDate = new Date(today);
        checkInDate.setDate(today.getDate());

        // For a 3-night stay:
        const calendarEndDate = new Date(checkInDate);
        calendarEndDate.setDate(checkInDate.getDate() + 2);

        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + 3);

        // Format dates for assertion (YYYY-MM-DD)
        const checkInFormatted = checkInDate.toISOString().split('T')[0]
        const checkOutFormatted = checkOutDate.toISOString().split('T')[0]

        // Select check-in and check-out dates
        const checkInElement = page.locator('.rbc-date-cell').getByText(checkInDate.getDate().toString(), { exact: true })
        const checkOutElement = page.locator('.rbc-date-cell').getByText(checkOutDate.getDate().toString(), { exact: true })

        await checkInElement.waitFor()
        await checkOutElement.waitFor()

        const startBox = await checkInElement.boundingBox()
        const endBox = await checkOutElement.boundingBox()

        if (startBox && endBox){
            // Move mouse left of date element
            await page.mouse.move(startBox.x - 10, startBox.y + startBox.height / 2);
            await page.mouse.down()

            // Drag to the end date
            await page.mouse.move(endBox.x + endBox.width / 2, endBox.y + endBox.height / 2, { steps: 10 })
            await page.mouse.up() // Release mouse
        }

        await page.getByRole('button', {name: "Book"}).first().click()
        
        const successMessageElement = page.locator('.ReactModalPortal');
        const successMessage = await successMessageElement.textContent();

        const assertCheckoutDate = new Date(checkOutDate);
        assertCheckoutDate.setDate(checkOutDate.getDate() + 1);
        const assertCheckoutFormatted = assertCheckoutDate.toISOString().split('T')[0];

        if (successMessage) {
            expect(successMessage).toContain(`Booking Successful!Congratulations! Your booking has been confirmed for:${checkInFormatted} - ${assertCheckoutFormatted}Close`)
        } else {
            throw new Error('Failed to retrieve success message text content.')
        }
    })
    test('Complete contact form', async ({page}) => {
        await page.getByTestId('ContactName').fill('Walter White');
        await page.getByTestId('ContactEmail').fill('walt@bluegroup.com');
        await page.getByTestId('ContactPhone').fill('212345678912');
        await page.getByTestId('ContactSubject').fill('I am the danger');
        await page.getByTestId('ContactDescription').fill('I require complete discretion and absolute privacy during my stay. No disturbances, no questions');
        await page.getByRole('button', { name: 'Submit' }).click();

        expect(await page.locator('div.row.contact h2').textContent()).toContain('Thanks for getting in touch');
    });

test.describe('Admin panel page', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('https://automationintesting.online/')
        const hackButton = page.getByText('Let me hack!')
        
        if (await hackButton.isVisible()){
            hackButton.click()
        }

        await page.getByRole('link', { name: 'Admin panel', exact: true }).click();
        await page.getByTestId('username').fill('admin');
        await page.getByTestId('password').fill('password');
        await page.getByTestId('submit').click();
    })
    test('Delete a booking', async ({page}) => {
        await page.getByTestId('roomlisting').locator('div').filter({ hasText: '101' }).click();
        await page.locator('.bookingDelete').first().click();

        // Can't seem to find the booking row to delete the specific booking by name - might be a page issue?
        // const bookingRow = page.locator('div.booking-2 .row')
        //     .filter({ has: page.locator('div.col-sm-2 p', { hasText: 'Jesse' }) })
        //     .filter({ has: page.locator('div.col-sm-2 p', { hasText: 'Pinkman' }) });

        //     console.log(await bookingRow.count()); // Should return 1 if found correctly
        //     await bookingRow.highlight();
        //     const deleteButton = bookingRow.locator('.bookingDelete');    
        //     console.log(await deleteButton.count()); // Should be 1
                
        //     await deleteButton.click();
    });
});
});