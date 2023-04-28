const { addAttach } = require('jest-html-reporters/helper');
const Page = require('./basePage');
const {By} = require('selenium-webdriver')

const baseUrl = 'https://www.abebooks.com/'
const SCREENSHOT_FOLDER = "./screenshots/"

let searchCountNum;

//locators
const announcmentBtn = By.css('div.modal-dialog.modal-md > div.modal-content > div.modal-header > button.close');
const cookiesConsentBtn = By.css('div.cookie-consent > div.cookie-consent-buttons > button.btn.btn-sm.btn-yes');
const brandLinkHeader = By.css('#logo > span');

const searchField = By.id('header-searchbox-input');
const searchBtn = By.id('header-searchbox-button');
const searchResultHeader = By.css('#pageHeader > h1');
const searchResultCount = By.id('topbar-search-result-count-header');
const searchResultItemTitle = By.css('#srp-results > .result-item span[data-cy="listing-title"]');
const searchResultItemFormat = By.css('#srp-results > .result-item span[data-cy="listing-book-condition"]');
const searchResultsItemPrice = By.css('#srp-results > .result-item p[data-cy="listing-price"]');

const sortOptions = By.xpath('//select[@id="sortby-topbar"]/option');
const sortByPriceBtn = By.xpath('//select[@id="sortby-topbar"]/option[contains(text(),"Highest Price")]');

const filterOptions = By.css('#binding > li');

const addToBasketBtns = By.className("#srp-results > .result-item .btn-add-to-basket");
const cartModal = By.id("shopping-basket-modal");

module.exports = class HomePage extends Page {
    constructor(driver) {
        super(driver);
    }

    async openUrl() {
        await super.openUrl(baseUrl);
    }

    async closeAnnouncment() {
        await super.waitForElementVisible(announcmentBtn);
        await super.clickButton(announcmentBtn);
    }

    async agreeWithCookies() {
        await super.waitForElementVisible(cookiesConsentBtn);
        await super.clickButton(cookiesConsentBtn);
    }

    async verifyPageTitleContains(pageTitle) {
        const pageTitleElement = await super.getElementText(brandLinkHeader);
        expect(pageTitleElement).toContain(pageTitle)
    }

    async searchForText(text) {
        await super.sendText(searchField, text);
        await super.clickButton(searchBtn);
    }

    async verifySearchResultText(text) {
        const searchResultTitle = await super.getElementText(searchResultHeader);
        expect(searchResultTitle).toContain(text)
    }

    async verifyAllSearchItemsContainText(text) {
        let itemFormats = await super.getElements(searchResultItemTitle);

        for(let item of itemFormats) {
            expect(await item.getText()).toContain(text);
        }
    }

    async verifySearchResultContainsMoreItemsThan(number) {
        const searchCount = await super.getElementText(searchResultCount)
        searchCountNum = parseInt(searchCount.replace(',', ''))
        expect(searchCountNum).toBeGreaterThan(number)
    }

    async verifyProductSortOptions() {
        let sortByOptions = await super.getElements(sortOptions);
        expect(sortByOptions).toHaveLength(12)
    }

    async sortResultsByPrice() {
        await super.clickButton(sortByPriceBtn);
    }

    async verifyResultsAreSorted() {
        let searchItems = await super.getElements(searchResultsItemPrice);
        
        //Verify that the products are sorted correctly.
        let price1 = parseFloat((await searchItems[0].getText()).replace("US$ ", "").replaceAll(',', ''))
        let price2 = parseFloat((await searchItems[1].getText()).replace("US$ ", "").replaceAll(',', ''))
        expect(price1).toBeGreaterThanOrEqual(price2)
    }

    async verifyProductFilters() {
        let filterByOptions = await super.getElements(filterOptions)
        expect(filterByOptions).toHaveLength(3)
    }

    async filterResultsByText(text) {
        await super.clickButton(By.xpath('//*[@id="binding"]/li/a[contains(text(), "' + text + '")]'));
    }

    async verifyResultsFilter(text) {  
        let itemFormats = await super.getElements(searchResultItemFormat)

        for(let item of itemFormats) {
            expect(await item.getText()).toContain(text)
        }
    }

    async verifyResultsAreFiltered() {
        const searchCountFiltered = await super.getElementText(searchResultCount)
        const searchCountFilteredNum = parseInt(searchCountFiltered.replace(',', ''))

        expect(searchCountFilteredNum).toBeLessThan(searchCountNum)
    }

    async verifyAddToCartBtnExists() {
        const addToBasketBtn = await super.getElements(addToBasketBtns)[0];
        await super.waitForElementVisible(addToBasketBtn);
        const addCount = await super.getElements(addToBasketBtns);

        expect(addCount.length).toBeGreaterThan(0)
    }

    async addToCart() {
        const addToBasketBtn = await super.getElements(addToBasketBtns)[0];
        await super.waitForElementVisible(addToBasketBtn);
        await super.clickButton(addToBasketBtn);
    }

    async verifyAddToCartModalAppeared() {
        await super.waitForElementVisible(cartModal);
    }

    async continueShopping() {
        const continueShoppingBtn = await super.getElement(By.id("shopping-basket-modal-dismiss"));
        await super.waitForElementVisible(continueShoppingBtn);
        await super.clickButton(continueShoppingBtn);
    }

    async addAnotherItemToCart() {
        const addToBasketBtn = await super.getElements(addToBasketBtns)[1];
        await super.waitForElementVisible(addToBasketBtn);
        await super.clickButton(addToBasketBtn);
    }

    async goToCart() {
        const goToCartBtn = await super.getElement(By.id("shopping-basket-modal-checkout"));
        await super.waitForElementVisible(goToCartBtn);
        await super.clickButton(goToCartBtn);
    }
}