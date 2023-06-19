import puppeteer from "puppeteer";
import fs from "fs";

const convertToCSV = (reviews, hotelName, hotelAddress, hotelRating) => {
    const headers = [
      'Hotel Name',
      'Hotel Address',
      'Hotel Rating',
      'Author',
      'Date',
      'TripType',
      'Rating',
      'Review Title',
      'Review Content',
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
        review.DateOfStay,
        review.tripType,
        review.rating,
        review.reviewTitle,
        review.reviewContent,
        review.response,
      ].map((value) =>  isNaN(value) === true ? `"${value.replace(/"/g, '""')}"` : value).join(',');
  
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

    await page.goto('https://www.tripadvisor.com/Hotel_Review-g297612-d1490155-Reviews-Lords_Plaza_Surat-Surat_Surat_District_Gujarat.html');


    const hotelName = await page.$eval("#HEADING", (element) => {
        return element ? element.innerText : null;
      });
    console.log("Hotel Name: ", hotelName);



    const hotelRating = await page.$eval("#ABOUT_TAB > div.ui_columns.MXlSZ > div:nth-child(1) > div.grdwI.P > span", (element) => {
        return element ? element.innerText : null;
      });
    console.log("Hotel Rating: ", hotelRating);


    const totalReviews = await page.$eval("#component_37 > div > div:nth-child(1) > div.UJWmn.f.k > div.nWTom > div:nth-child(1) > a:nth-child(1) > div > span", (element) => {
        return element ? element.innerText : null;
      });
    console.log("Total Reviews: ", totalReviews);



    const hotelAddress = await page.$eval("#component_37 > div > div:nth-child(1) > div.UJWmn.f.k > div.nWTom > div.gZwVG.H3.f.u.ERCyA > span.oAPmj._S > span", (element) => {
        return element ? element.innerText : null;
      });
    console.log("Hotel Address:", hotelAddress);

    const reviewBox = await page.$$eval(
        "div.YibKl.MC.R2.Gi.z.Z.BB.pBbQr",
        (elements) => {
          return elements.map((element) => element.innerHTML);
        }
      );
    
      console.log(reviewBox.length);


      const reviews = await page.$$eval('div.YibKl.MC.R2.Gi.z.Z.BB.pBbQr', (elements) =>
      elements.map((e) => {

        const getAuthor = () => {
          try {
            return e.querySelector('div.sCZGP > div > div.cRVSd > span > a').innerText;
          } catch (err) {
            return "";
          }
        };
    
    
        const getAuthorCountry = () => {
          try{

              return e.querySelector('div > div.MziKN > span.RdTWF > span').innerText;
          }
          catch (err) {
              return "";
          }
      }

      const getTime = () => {
        try{
            return e.querySelector('span.teHYY._R.Me.S4.H3').innerText.slice(14).trim();
        }
        catch (err) {
            return "";
        }
        // return e.querySelector('div.WAllg._T > div.vTVDc > span.teHYY._R.Me.S4.H3');
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
    
        const getTripType = () => {
            try{
                return e.querySelector('span.TDKzw._R.Me').innerText.slice(11).trim();
            }
            catch (err) {
                return "";
            }
        }
    
        const getReviewTitle = () => {
          try{
              return e.querySelector('div.WAllg._T > div.KgQgP.MC._S.b.S6.H5._a > a > span > span').innerText;
          }
          catch (err) {
              return "";
          }
      }
      

       
      const getReviewsContent = () => {
        try{
            return e.querySelector('div.WAllg._T > div.vTVDc > div._T.FKffI > div.fIrGe._T > span').innerText.replace(/\n+/g, ' ').trim();
        }
        catch (err) {
            return "";
        }
      };
      
      const getResponse = () => {
        try {
          const responseElement = e.querySelector('div._T.FKffI > div.fIrGe._T > span.MInAm._a');
          return responseElement ? responseElement.innerText.replace(/\n+/g, ' ').trim() : "";
        } catch (err) {
          return "";
        }
      };
    
    
    const getReviewRating = () => {
      try{
        
        return e.querySelector('span.ui_bubble_rating').className.slice(24);


      }
      catch (err) {
          return "";
      }
    }
    
        return {
          author: getAuthor(),
          DateOfStay: getTime(),
        //   roomType: getRoomType(),
          tripType: getTripType(),
        //   date: getReviewDate(),
          rating: getReviewRating(),
          reviewTitle: getReviewTitle(),
          reviewContent: getReviewsContent(),
          response: getResponse(),
        };
      })
    );
    
    
    reviews.map((review) => {
      review.rating = parseInt(review.rating) / 10;
      
    });
    
    console.log(reviews);
  


    const csvData = await convertToCSV(reviews, hotelName, hotelAddress, hotelRating);
    fs.writeFileSync(`./output/${hotelName}_tripadvisor.csv`, csvData);

    await browser.close();

};

run();
