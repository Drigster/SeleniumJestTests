const {Builder, By} = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')

let HomePage = require('../pageobjects/homePage')

const TIMEOUT = 10000

describe('Search products from menu', () => {

    let driver

    beforeAll(async () => {

        //TODO add method to delete all old screenshots

        driver = await new Builder()
        .forBrowser('firefox')
        // If you dont want to open browser, uncomment following row
        // .setFirefoxOptions(new firefox.Options().addArguments('--headless'))
        .build()
        driver.manage().setTimeouts({implicit: TIMEOUT, pageLoad: TIMEOUT, script: TIMEOUT})
        driver.manage().window().maximize()

        HomePage = new HomePage(driver)

        //HomePage.emptyScreenshotFolder();

        await HomePage.openUrl()
    })

    afterEach(function() {
        HomePage.takeScreenShotIfTestFailed(expect.getState())
    })

    afterAll(async () => {
        await driver.quit()
    })

    // test('Test Close Announcment', async () => {
    //     await HomePage.closeAnnouncment()
    // })

    // test('Test Close Cookies', async () => {
    //     await HomePage.agreeWithCookies()
    // })

    test('Test Open Web Page', async () => {
        await HomePage.verifyPageTitleContains('AbeBooks.com')
    })

    test('Test Search by Keyword', async () => {
        await HomePage.searchForText('Harry Potter')
        await HomePage.verifySearchResultText('Harry Potter')
        await HomePage.verifyAllSearchItemsContainText('Harry Potter')
        await HomePage.verifySearchResultContainsMoreItemsThan(1)
        await HomePage.verifyAddToCartBtnExists()
    })

    test('Test Add To Cart', async () => {
        await HomePage.addToCart();
        await HomePage.verifyAddToCartModalAppeared();
    })

    test('Test Go Back', async () => {
        await HomePage.continueShopping();
    })
    
    test('Test Add Another Item To Cart', async () => {
        await HomePage.addAnotherItemToCart();
        await HomePage.verifyAddToCartModalAppeared();
    })
})