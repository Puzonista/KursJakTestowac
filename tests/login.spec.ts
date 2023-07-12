import { test, expect } from '@playwright/test';
import { loginData, userId } from '../test-data/login.data';

test.describe('User login to Demobank', () => {


  test.beforeEach(async ({ page }) => {

    await page.goto('/');
  })
  test('successful login with correct credentials', async ({ page }) => {
    // Arrange

    const userId = loginData.userId;
    const userPassword = loginData.password;
    const expectedUsername = 'Jan Demobankowy';

    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();
    // Assert
    await expect(page.getByTestId('user-name')).toHaveText(expectedUsername);
  });

  test('unsuccessful login with too short username', async ({ page }) => {
    // Arrange
    const incorrectUserId = 'TestK';
    const exceptedErrorMessange = 'identyfikator ma min. 8 znaków'

    // Act
    await page.getByTestId('login-input').fill(incorrectUserId);
    await page.getByTestId('password-input').click();

    // Assert
    await expect(page.getByTestId('error-login-id')).toHaveText(exceptedErrorMessange);

  });

  test('unsuccessful login with too short password', async ({ page }) => {
    // Arrange
    const userId = loginData.userId;
    const exceptedErrorMessange = 'hasło ma min. 8 znaków'
    const incorrectPassword = '12345';

    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(incorrectPassword);
    await page.getByTestId('password-input').blur();



    await expect(page.getByTestId('error-login-password')).toHaveText(exceptedErrorMessange);

  });
});