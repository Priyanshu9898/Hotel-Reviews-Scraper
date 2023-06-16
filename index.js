import puppeteer from "puppeteer";
import converter from 'json-2-csv';
import fs from 'fs';

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


  await Promise.all([
    // Remove the `await` keyword before `page.click()`
    page.click(btnSelector),
    console.log("page clicked"),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);



  const reviewBox = await page.$$eval(
    "#review_list_page_container > ul > li.review_list_new_item_block",
    (elements) => {
      return elements.map((element) => element.innerHTML);
    }
  );

  console.log(reviewBox.length);


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
          return e.querySelector('div.bui-grid > div.bui-grid__column-3.c-review-block__left > div.c-review-block__row.c-review-block__guest > div > div.bui-avatar-block__text > span.bui-avatar-block__subtitle').innerText;
      }
      catch (err) {
          return "";
      }
  }

    const getReviewDate = () => {
        try{
            return e.querySelector('div.bui-grid__column-3.c-review-block__left > ul.bui-list.bui-list--text.bui-list--icon.bui_font_caption.c-review-block__row.c-review-block__stay-date > li > div > span').innerText;
        }
        catch (err) {
            return "";
        }
    }

    const getRoomType = () => {
        try{
            return e.querySelector('div.bui-grid__column-3.c-review-block__left > div.c-review-block__row.c-review-block__room-info-row.review-block__room-info--disabled > ul > li > a > div').innerText;
        }
        catch (err) {
            return "";
        }
    }

    const getStayType = () => {
        try{
            return e.querySelector('div.bui-grid__column-3.c-review-block__left > ul.bui-list.bui-list--text.bui-list--icon.bui_font_caption.review-panel-wide__traveller_type.c-review-block__row > li > div').innerText;
        }
        catch (err) {
            return "";
        }
    }

    const getReviewTitle = () => {
      try{
          return e.querySelector('div.bui-grid > div.bui-grid__column-9.c-review-block__right > div:nth-child(1) > div > div.bui-grid__column-11 > h3').innerText;
      }
      catch (err) {
          return "";
      }
  }

  const getReviewsContent = () => {
    const reviews = [];
    let index = 1;
    let reviewElement = e.querySelector(`div > div.bui-grid > div.bui-grid__column-9.c-review-block__right > div:nth-child(${index})`);
  
    while (reviewElement) {
      const reviewContent = reviewElement.innerText.replace(/\n/g, ' ').trim();
      reviews.push(reviewContent);
      index++;
      reviewElement = e.querySelector(`div > div.bui-grid > div.bui-grid__column-9.c-review-block__right > div:nth-child(${index})`);
    }
  
    const preprocessedReviews = reviews.reduce((acc, review) => {
      if (review.includes('Liked')) {
        acc.liked += ' ' + review.split('Liked')[1].replace(/\s+/g, ' ').trim();
      }
      if (review.includes('Disliked')) {
        acc.disliked += ' ' + review.split('Disliked')[1].replace(/\s+/g, ' ').trim();
      }
      return acc;
    }, { liked: '', disliked: '' });
  
    console.log(preprocessedReviews);
  
    return preprocessedReviews;
  };
  



const getReviewRating = () => {
  try{
      return e.querySelector('div > div.bui-grid__column-1.bui-u-text-right > div > div').innerText;
  }
  catch (err) {
      return "";
  }
}

    return {
      author: getAuthor(),
      authorCountry: getAuthorCountry(),
      date: getReviewDate(),
      roomType: getRoomType(),
      stayType: getStayType(),
      reviewTitle: getReviewTitle(),
      reviewContent: getReviewsContent(),
      rating: getReviewRating()
    };
  })
);

console.log(reviews);

fs.writeFile('reviews.json', JSON.stringify(reviews), (err) => {
  if (err) throw err;
  console.log('File saved');
});


  await browser.close();
};

run();
