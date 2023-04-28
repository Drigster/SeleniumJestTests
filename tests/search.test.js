const {Builder, By} = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')

let HomePage = require('../pageobjects/homePage')

const TIMEOUT = 10000

describe('Search products', () => {

    let driver

    beforeAll(async () => {

        //TODO add method to delete all old screenshots

        driver = await new Builder()
        .forBrowser('firefox')
        // If you dont want to open browser, uncomment following row
        .setFirefoxOptions(new firefox.Options().addArguments('--headless'))
        .build()
        driver.manage().setTimeouts({implicit: TIMEOUT, pageLoad: TIMEOUT, script: TIMEOUT})
        driver.manage().window().maximize()

        HomePage = new HomePage(driver)

        // HomePage.emptyScreenshotFolder();

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
    })

    test('Test Sort by price', async () => {
        await HomePage.verifyProductSortOptions();
        await HomePage.sortResultsByPrice();
        await HomePage.verifyResultsAreSorted();
    })

    test('Test Filter by format', async () => {
        await HomePage.verifyProductFilters();
        await HomePage.filterResultsByText('Hardcover');
        await HomePage.verifyResultsFilter('Hardcover');
        await HomePage.verifyResultsAreFiltered();
    })
})