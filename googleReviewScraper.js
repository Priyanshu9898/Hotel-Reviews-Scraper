import puppeteer from "puppeteer";
import fs from "fs";

const convertToCSV = (reviews, hotelName, hotelAddress, hotelRating) => {
    const headers = [
      'Hotel Name',
      'Hotel Address',
      'Hotel Rating',
      'Review Author',
      'Stay Type',
      'Rating',
      'Review',
      'Response',
    ];
  
    const hotelInfo = [
      `"${hotelName.replace(/"/g, '""')}"`,
      `"${hotelAddress.replace(/"/g, '""')}"`,
      `"${hotelRating.replace(/"/g, '""')}"`,
    ];
  
    const csvRows = reviews.map((review, index) => {
      const reviewData = [
        review.author,
        review.stayType,
        review.rating,
        review.reviewContent,
        review.response,
      ].map((value) => `"${value.replace(/"/g, '""')}"`).join(',');
  
      if (index === 0) {
        return `${hotelInfo.join(',')},${reviewData}`;
      } else {
        return ['', '', '', ...reviewData.split(',')].join(',');
      }
    });
  
    return `${headers.join(',')}\n${csvRows.join('\n')}`;
  };
  


const run = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
    });

    const page = await browser.newPage();

    await page.goto('https://www.google.com/travel/search?q=lords%20plaza%20surat&g2lb=2502548%2C2503771%2C2503781%2C4258168%2C4270442%2C4284970%2C4291517%2C4306835%2C4597339%2C4757164%2C4814050%2C4850738%2C4864715%2C4874190%2C4886480%2C4893075%2C4924070%2C4965990%2C4985712%2C4990494%2C72248281%2C72271797%2C72272556%2C72279293%2C72280386%2C72281254%2C72286089&hl=en-IN&gl=in&ssta=1&ts=CAESABpJCikSJzIlMHgzYmUwNGVmODA0Mzc4NWRiOjB4NDc1M2RhNmE1OTU3ZDU5YhIcEhQKBwjnDxAGGBASBwjnDxAGGBEYATIECAAQACoHCgU6A0lOUg&qs=CAEyJENoY0ltNnZmeXFYTjlxbEhHZ3N2Wnk4eGRuSXhkak0xYWhBQjgCQgsJm9VXWWraU0cYAUILCZvVV1lq2lNHGAE&ap=ugEIb3ZlcnZpZXc&ictx=1');


    // Update the selector for the button
    const btnSelector = "#reviews > span";
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


    const hotelName = await page.$eval("c-wiz > div > h1", (element) => {
        return element ? element.innerText : null;
      });
    console.log("Hotel Name: ", hotelName);

    const hotelRating = await page.$eval("div > div > div.zhMoVd.nNUNpc > div.FBsWCd", (element) => {
        return element ? element.innerText : null;
      });
    console.log("Hotel Rating: ", hotelRating);



    const totalReviews = await page.$eval("div > div.B2PODc > span.ta47le.sdhtLe > span > span.jdzyld.XLC8M", (element) => {
        return element ? element.innerText.trim().slice(1, -1) : null;
      });
    console.log("Total Reviews: ", totalReviews);



    const hotelAddress = await page.$eval("section > div.OGAsq > div:nth-child(1) > div > div.K4nuhf > span:nth-child(1)", (element) => {
        return element ? element.innerText : null;
      });
    console.log("Hotel Address:", hotelAddress);

    const reviewBox = await page.$$eval(
        "#reviews > c-wiz > c-wiz > div > div > div > div > div.v85cbc > c-wiz > div:nth-child(1) > div > div > div.Svr5cf.bKhjM",
        (elements) => {
          return elements.map((element) => element.innerHTML);
        }
      );
    
      console.log(reviewBox.length);
        
        const reviewSelector = "#reviews > c-wiz > c-wiz > div > div > div > div > div.v85cbc > c-wiz > div:nth-child(1) > div > div > div.Svr5cf.bKhjM";

      const reviews = await page.$$eval(reviewSelector, (elements) =>
      elements.map((e) => {
        const getAuthor = () => {
          try {

            
            return e.querySelector('div.aAs4ib > div.jUkSGf.WwUTAf > span > a').innerText;;
            
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
                return e.querySelector('div.ThUm5b').innerText;
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
            return e.querySelector('div.STQFb > div.K7oBsc > div > span').innerText;
        }
        catch (err) {
            return "";
        }
      };
      
      const getResponse = () => {
        try {
          const responseElement = e.querySelector('div.lU7Ape > div');
          return responseElement ? responseElement.innerText.replace(/\n+/g, ' ').trim() : "";
        } catch (err) {
          return "";
        }
      };
    
    
    const getReviewRating = () => {
      try{
          return e.querySelector('div.aAs4ib > div.GDWaad').innerText.split("/")[0];
      }
      catch (err) {
          return "";
      }
    }
    
        return {
          author: getAuthor(),
        //   authorCountry: getAuthorCountry(),
        //   stayTime: getTime(),
        //   roomType: getRoomType(),
          stayType: getStayType(),
        //   date: getReviewDate(),
          rating: getReviewRating(),
        //   reviewTitle: getReviewTitle(),
          reviewContent: getReviewsContent(),
          response: getResponse(),
        };
      })
    );
    
    console.log(reviews);

    const csvData = await convertToCSV(reviews, hotelName, hotelAddress, hotelRating);
    fs.writeFileSync(`./output/${hotelName}_GoogleReviews.csv`, csvData);


    await browser.close();
}

run();
