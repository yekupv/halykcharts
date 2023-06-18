const playwright = require("playwright");

const url = "https://halykbank.kz/exchange-rates"; // Replace with the URL containing the HTML snippet
const date = new Date(Date.now());
const timeZoneOptions = { timeZone: "Asia/Almaty" };

const targetInnerHTML = "Для юридических лиц"; // Replace with the inner HTML content of the <a> tag you want to access

async function run() {
	const browser = await playwright.chromium.launch();
	const page = await browser.newPage();

	await page.goto(url);

	// Wait for the Vue.js component to render and the <a> tag to become available
	await page.waitForTimeout(3000); // Adjust the delay as needed

	// Find the parent <ul> element
	const ul = await page.$(
		".text-gray-700.flex.items-center.-mx-4.whitespace-nowrap"
	);

	if (ul) {
		// Find the desired <a> tag within the parent <ul> element
		const link = await ul.$(`a:has-text("${targetInnerHTML}")`);

		if (link) {
			await page.evaluate((element) => {
				element.click();
			}, link);

			const classes = await page.evaluate((element) => {
				return element.getAttribute("class");
			}, link);

			console.log("Current classes:", classes);

			await page.screenshot({
				path: `./screenshots/${date
					.toLocaleString("en-US", timeZoneOptions)
					.replace(/:/g, "_")}.png`,
				fullPage: true,
			});
		} else {
			console.log(
				`No <a> tag found with inner HTML: "${targetInnerHTML}"`
			);
		}
	} else {
		console.log("Parent <ul> element not found");
	}

	await browser.close();

	const archive = {
		url,
		date,
		image: {},
	};
}

run();
