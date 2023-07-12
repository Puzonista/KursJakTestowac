import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';

test.describe('Pulpit tests', () => {

    test.beforeEach(async ({ page }) => {
        const userId = loginData.userId;
        const userPassword = loginData.password;

        await page.goto('/');
        await page.getByTestId('login-input').fill(userId);
        await page.getByTestId('password-input').fill(userPassword);
        await page.getByTestId('login-button').click();

    })
    test('quick payment with correct data', async ({ page }) => {

        // Arrange
        const reciverId = '2';
        const transferAmount = '150';
        const transferTitle = 'Pizza';
        const expectedTransferReciver = 'Chuck Demobankowy'

        // Act 
        await page.locator('#widget_1_transfer_receiver').selectOption(reciverId);
        await page.locator('#widget_1_transfer_amount').fill(transferAmount);
        await page.locator('#widget_1_transfer_title').fill(transferTitle);
        await page.getByRole('button', { name: 'wykonaj' }).click();
        //await page.locator('#execute_btn').click();
        await page.getByTestId('close-button').click();
        //await page.getByRole('link', { name: 'Przelew wykonany! Chuck Demobankowy - 150,00PLN - Zwrot środków' }).click();

        // Assert
        await expect(page.locator('#show_messages')).toHaveText(`Przelew wykonany! ${expectedTransferReciver} - ${transferAmount}PLN - ${transferTitle}`);
    });

    test('successful mobile top-up', async ({ page }) => {

        // Arrange
        const topUpReciver = '500 xxx xxx';
        const topUpAmount = '40';
        const expectedMessange = `Doładowanie wykonane! ${topUpAmount},00PLN na numer ${topUpReciver}`;


        // Act
        await page.locator('#widget_1_topup_receiver').selectOption(topUpReciver);
        await page.locator('#widget_1_topup_amount').fill(topUpAmount);
        await page.locator('#widget_1_topup_agreement').click();
        await page.getByRole('button', { name: 'doładuj telefon' }).click();
        await page.getByTestId('close-button').click();

        // Assert
        await expect(page.locator('#show_messages')).toHaveText(expectedMessange);
    });

    test('correct balance after successful mobile top-up', async ({ page }) => {

        // Arrange
        const topUpReciver = '500 xxx xxx';
        const topUpAmount = '40';
        const expectedMessange = `Doładowanie wykonane! ${topUpAmount},00PLN na numer ${topUpReciver}`;
        const initilaBalance = await page.locator('#money_value').innerText();
        const expectedBalance = Number(initilaBalance) - Number(topUpAmount)


        // Act
        await page.locator('#widget_1_topup_receiver').selectOption(topUpReciver);
        await page.locator('#widget_1_topup_amount').fill(topUpAmount);
        await page.locator('#widget_1_topup_agreement').click();
        await page.getByRole('button', { name: 'doładuj telefon' }).click();
        await page.getByTestId('close-button').click();

        // Assert
        await expect(page.locator('#money_value')).toHaveText(`${expectedBalance}`);
    });
});