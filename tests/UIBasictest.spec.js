const {test,expect} = require('@playwright/test');
const { text } = require('stream/consumers');

test.only('@Web Browser Context First Playwright test', async ({browser}) =>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    //page.route('**/*.{.jpg,png,jpeg}', route => route.abort());
    const userName = page.locator('input#username');
    const singIn = page.locator("#signInBtn");
    const cardTitles = page.locator('.card-body a');
    page.on('request', request => console.log(request.url()));
    page.on('response', response => console.log(response.url(), response.status()));
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());
    //css
    await userName.fill("rahulshetty");
    await page.locator("[type='password']").fill("learning");
    await singIn.click();
    //wait until this locator shown up page
    console.log(await page.locator("[style*='block']").textContent());
    await expect(await page.locator("[style*='block']")).toContainText("Incorrect ");
    //type - fill
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await singIn.click();
    //Forma de devolver un elemento, cuando el css coincide con mas de uno, darle posicion 
    await cardTitles.first().textContent();
    await cardTitles.nth(1).textContent();
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
    

});

test('Page First Playwright test', async ({page}) =>
{
    await page.goto("https://google.com"); 
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
});

test('@Web UI control', async ({browser}) =>
    {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        const userName = page.locator('input#username');
        const singIn = page.locator("#signInBtn");
        const documentLink = page.locator("[href*='documents-request']");
        const dropdown = page.locator("select.form-control");
        await dropdown.selectOption("consult");
        await page.locator(".radiotextsty").last().click();
        await page.locator("#okayBtn").click();
        console.log(await page.locator(".radiotextsty").last().isChecked());
        await expect(await page.locator(".radiotextsty").last()).toBeChecked();
        await page.locator("#terms").click();
        await expect(await page.locator("#terms")).toBeChecked();
        await page.locator("#terms").uncheck();
        expect(await page.locator("#terms").isChecked()).toBeFalsy();
        await expect(documentLink).toHaveAttribute("class","blinkingText");
    });

    
test('Child windows hadl', async ({browser}) =>
    {
        const context = await browser.newContext();
        const page = await context.newPage();
        const userName = page.locator('input#username');
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        const documentLink = page.locator("[href*='documents-request']");
        //Nos manejamos entre diferentes ventanas en una misma sesion
        const [newPage] = await Promise.all(
        [ context.waitForEvent('page'),
          documentLink.click(),
        ])
        const text = await newPage.locator(".red").textContent();
        const arrayText = text.split("@");
        const domain = arrayText[1].split(" ")[0];
        console.log(domain);
        await userName.fill(domain);
        await page.pause();
        console.log(await page.locator(userName).textContent());
    });