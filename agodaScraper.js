import puppeteer from "puppeteer";
import fs from 'fs';

const convertToCSV = (reviews, hotelName, hotelAddress, hotelRating) => {
    const headers = [
      "hotelName",
      "hotelAddress",
      "hotelRating",
      "Review Author",
      "authorCountry",
      "stayTime",
      "roomType",
      "stayType",
      "date",
      "rating",
      "reviewTitle",
      "reviewContent",
      "response",
    ];
  
    const rows = reviews.map((review, index) => [
        index === 0 ? hotelName : "",
        index === 0 ?  `"${hotelAddress.replace(/"/g, '""')}"` : "",
        index === 0 ? hotelRating : "",
        ...Object.values(review),
      ]);
  
    const csv = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
  
    return csv;
  };
  
  



const run = async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: false,
    });

    const page = await browser.newPage();

    await page.goto('https://www.agoda.com/en-in/lords-plaza-surat/hotel/surat-in.html?finalPriceView=1&isShowMobileAppPrice=false&cid=1844104&numberOfBedrooms=&familyMode=false&adults=2&children=0&rooms=1&maxRooms=0&checkIn=2023-06-22&isCalendarCallout=false&childAges=&numberOfGuest=0&missingChildAges=false&travellerType=1&showReviewSubmissionEntry=false&currencyCode=INR&isFreeOccSearch=false&isCityHaveAsq=false&tspTypes=7,2&los=1&searchrequestid=ada149a8-3719-45b8-a69f-429b34aa3526');

    // const html = await page.content();
    // console.log(html);
    
    const hotelName = await page.$eval("div.HeaderCerebrum > div > p.HeaderCerebrum__Name", (element) => {
        return element ? element.innerText : null;
      });
    console.log("Hotel Name: ", hotelName);

    const hotelRating = await page.$eval(" div > p.sc-kEjbxe.sc-iqHYGH.DGKby.fKlkAa", (element) => {
        return element ? element.innerText : null;
      });
    console.log("Hotel Rating: ", hotelRating);



    const totalReviews = await page.$eval("div > span.text > p", (element) => {
        return element ? element.innerText : null;
      });
    console.log("Total Reviews: ", totalReviews);

    // div.HeaderCerebrum > div.HeaderCerebrum__Location > span.Spanstyled__SpanStyled-sc-16tp9kb-0.gwICfd.kite-js-Span.HeaderCerebrum__Address


    const hotelAddress = await page.$eval("div.HeaderCerebrum > div.HeaderCerebrum__Location > span.Spanstyled__SpanStyled-sc-16tp9kb-0.gwICfd.kite-js-Span.HeaderCerebrum__Address", (element) => {
        return element ? element.innerText : null;
      });
    console.log("Hotel Address:", hotelAddress);

    
    const hotelDescription = await page.$eval("div.HeaderCerebrum > div.Box-sc-kv6pi1-0.cYZaSy > div > p", (element) => {
        return element ? element.innerText : null;
      });
    console.log("About:", hotelDescription);


    const reviewBox = await page.$$eval(
        "div#reviewSectionComments > div.Review-comment",
        (elements) => {
          return elements.map((element) => element.innerHTML);
        }
      );
    
      console.log(reviewBox.length);



      const reviews = await page.$$eval('div#reviewSectionComments > div.Review-comment', (elements) =>
      elements.map((e) => {
        const getAuthor = () => {
          try {
            return e.querySelector('div.Review-comment-left > div > div > strong').innerText;
          } catch (err) {
            return "";
          }
        };
    
    
        const getAuthorCountry = () => {
          try{
              return e.querySelector('div.Review-comment-left > div > div:nth-child(2) > span:nth-child(4)').innerText;
          }
          catch (err) {
              return "";
          }
      }

      const getTime = () => {
        try{
            return e.querySelector('div.Review-comment-left > div > div:nth-child(5) > span').innerText;
        }
        catch (err) {
            return "";
        }
    }
    
        const getReviewDate = () => {
            try{
                return e.querySelector('div.Review-comment-right > div.Review-comment-bubble > div.Review-statusBar > div > div > span').innerText.slice(8).trim();
            }
            catch (err) {
                return "";
            }
        }
    
        const getRoomType = () => {
            try{
                return e.querySelector('div.Review-comment-left > div > div:nth-child(4) > span').innerText;
            }
            catch (err) {
                return "";
            }
        }
    
        const getStayType = () => {
            try{
                return e.querySelector('div.Review-comment-left > div > div:nth-child(3) > span').innerText;
            }
            catch (err) {
                return "";
            }
        }
    
        const getReviewTitle = () => {
          try{
              return e.querySelector('div.Review-comment-right > div.Review-comment-bubble > div.Review-comment-body > h3').innerText;
          }
          catch (err) {
              return "";
          }
      }
      

       
      const getReviewsContent = () => {
        try{
            return e.querySelector('div.Review-comment-right > div.Review-comment-bubble > div.Review-comment-body > p').innerText;
        }
        catch (err) {
            return "";
        }
      };
      
      const getResponse = () => {
        try {
          const responseElement = e.querySelector('div.Review-comment-right > div.Review-response');
          return responseElement ? responseElement.innerText.replace(/\n+/g, ' ').trim() : "";
        } catch (err) {
          return "";
        }
      };
    
    
    const getReviewRating = () => {
      try{
          return e.querySelector('div.Review-comment-left > div > div.Review-comment-leftHeader > div.Review-comment-leftScore').innerText;
      }
      catch (err) {
          return "";
      }
    }
    
        return {
          author: getAuthor(),
          authorCountry: getAuthorCountry(),
          stayTime: getTime(),
          roomType: getRoomType(),
          stayType: getStayType(),
          date: getReviewDate(),
          rating: getReviewRating(),
          reviewTitle: getReviewTitle(),
          reviewContent: getReviewsContent(),
          response: getResponse(),
        };
      })
    );
    
    console.log(reviews);

    const csvData = await convertToCSV(reviews, hotelName, hotelAddress, hotelRating);
    fs.writeFileSync(`./output/${hotelName}_Agoda.csv`, csvData);

    await browser.close();
};


run();