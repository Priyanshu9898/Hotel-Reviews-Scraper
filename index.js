import puppeteer from "puppeteer";

const run = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.booking.com/hotel/in/gateway-on-athwa-lines.en-gb.html?aid=304142&label=gen173nr-1FCAEoggI46AdIM1gEaGyIAQGYAQm4ARfIAQzYAQHoAQH4AQyIAgGoAgO4Apq0r6QGwAIB0gIkNzdiMjI5YTUtYTY5OC00M2JhLTlmMmQtMDU0YWJmZmM3MTVm2AIG4AIB&sid=29a3aa253eb123d1816a355712f0f54b&dest_id=-2112243;dest_type=city;dist=0;group_adults=2;group_children=0;hapos=1;hpos=1;no_rooms=1;req_adults=2;req_children=0;room1=A%2CA;sb_price_type=total;sr_order=popularity;srepoch=1686886971;srpvid=ff151a1c91f10133;type=total;ucfs=1&#hotelTmpl"
  );

  const hotelName = await page.$eval(".d2fee87262", (element) => {
    return element ? element.innerText : null;
  });
  console.log("Hotel Name: ", hotelName);

  // Update the selector for the button
  const btnSelector = "div > button > div.daaa8ff09f  > span > span";
  const btn = await page.$eval(btnSelector, (element) => {
    return element ? element.innerText : null;
  });

  console.log(btn);

  //   const reviewBtn = await page.evaluate(() => Array.from(document.querySelectorAll('div > button > div.daaa8ff09f  > span > span'), (e) => e.innerHTML));
  //   console.log(reviewBtn);

  await Promise.all([
    // Remove the `await` keyword before `page.click()`
    page.click(btnSelector),
    console.log("page clicked"),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  //   const dd = await page.$eval(
  //     "div.b1e6dd8416.aacd9d0b0a.b48795b3df > div.b5cd09854e.f0d4d6a2f5.e46e88563a",
  //     (element) => {
  //       return element ? element.innerText : null;
  //     }
  //   );
  //   console.log("dd Name: ", dd);

  // Get an array of ElementHandles for the review boxes
  //   const reviewBoxes = await page.$$('div > div.c-guest-with-score__guest > div > div.bui-avatar-block__text > span.bui-avatar-block__title')
  //   console.log(reviewBoxes);

  const reviewBox = await page.$$eval(
    "#review_list_page_container > ul > li.review_list_new_item_block",
    (elements) => {
      return elements.map((element) => element.innerHTML);
    }
  );

  console.log(reviewBox.length);


// const reviews = await page.$$eval('#review_list_page_container > ul > li.review_list_new_item_block', (elements) =>
//   elements.map((e) => ({
    
//     author: e.querySelector('div.bui-grid__column-3.c-review-block__left > div.c-review-block__row.c-review-block__guest > div > div.bui-avatar-block__text > span.bui-avatar-block__title').innerText,

//     authorCountry: e.querySelector('div.bui-grid__column-3.c-review-block__left > div.c-review-block__row.c-review-block__guest > div > div.bui-avatar-block__text > span.bui-avatar-block__subtitle').innerText,

    
//   }))
// );

const reviews = await page.$$eval('#review_list_page_container > ul > li.review_list_new_item_block', (elements) =>
  elements.map((e) => {
    const getAuthor = () => {
      try {
        return e.querySelector('div.bui-grid__column-3.c-review-block__left > div.c-review-block__row.c-review-block__guest > div > div.bui-avatar-block__text > span.bui-avatar-block__title').innerText;
      } catch (err) {
        return "";
      }
    };

    const getAuthorCountry = () => {
        try{
            return e.querySelector('div.bui-grid__column-3.c-review-block__left > div.c-review-block__row.c-review-block__guest > div > div.bui-avatar-block__text > span.bui-avatar-block__subtitle').innerText;
        }
        catch (err) {
            return "";
        }
    }

    return {
      author: getAuthor(),
      authorCountry: getAuthorCountry(),
    };
  })
);

console.log(reviews);

  // const reviewBtn1 = await page.evaluate(() => Array.from(document.querySelectorAll('#review_list_page_container > ul > li.review_list_new_item_block'), (e) => e.innerHTML));

  // console.log(reviewBtn1.length);

  // Initialize an array to store the extracted reviews
  //   const reviews = [];

  // for await (const reviews of reviewBox){
  //     const data = {};

  //     const author = "";
  //     try{

  //         author = await page.evaluate(
  //             (el) => el.querySelector("div > div.bui-grid > div.bui-grid__column-3.c-review-block__left > div.c-review-block__row.c-review-block__guest > div > div.bui-avatar-block__text > span.bui-avatar-block__title").textContent,
  //             reviews
  //         );

  //     }
  //     catch(err){}
  //     console.log(author);

  //     // console.log(data);

  // }

//   for (let i = 0; i < reviewBox.length; i++) {
    // author = await page.evaluate(
    //   (el) =>
    //     el.querySelector(
    //       `#review_list_page_container > ul > li:nth-child(${i}) > div > div.bui-grid > div.bui-grid__column-3.c-review-block__left > div.c-review-block__row.c-review-block__guest > div > div.bui-avatar-block__text > span.bui-avatar-block__title`
    //     ).textContent,

    // );

//     const authorName = await page.$eval(`div > div.bui-grid > div.bui-grid__column-3.c-review-block__left > div.c-review-block__row.c-review-block__guest > div > div.bui-avatar-block__text > span.bui-avatar-block__title`, (element) => {
//         return element ? element.innerText : null;
//       });

//     console.log(authorName);
//   }



  //   await browser.close();
};

run();
