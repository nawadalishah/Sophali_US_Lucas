const axios = require('axios');
const cheerio = require('cheerio');

async function testScraping() {
    try {
        console.log("Testing food data scraping...");
        
        // Add headers to mimic a real browser request
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        };

        console.log("Making request to Pumpkin Kart...");
        const response = await axios.get(
            "https://www.pumpkinkart.com/restaurants/lazeez-shawarma-1225-kennedy-rd-unit-b1-423",
            { headers }
        );

        console.log("Response received, parsing HTML...");
        const $ = cheerio.load(response.data);
        
        // Extract restaurant information
        const restaurantName = $('#cartStoreName').text().trim() || 'Lazeez Shawarma';
        const restaurantAddress = $('#cartStoreLocation').text().trim().replace('📍', '').trim();
        const restaurantImage = $('#storeImage').attr('src') || '';

        console.log("Restaurant Info:");
        console.log("Name:", restaurantName);
        console.log("Address:", restaurantAddress);
        console.log("Image:", restaurantImage);

        const categories = [];
        let totalItems = 0;

        // Find all menu sections
        $('.row.m-0').each((index, element) => {
            const $section = $(element);
            const categoryName = $section.find('h6.p-3.m-0.bg-light.w-100').text().trim();
            
            if (categoryName) {
                console.log(`\nFound category: ${categoryName}`);
                
                const items = [];
                
                // Extract food items from this category
                $section.find('.gold-members').each((itemIndex, itemElement) => {
                    const $item = $(itemElement);
                    
                    // Skip if this is not a food item (check for ADD button)
                    if ($item.find('a[onclick*="checkStore"]').length === 0) {
                        return;
                    }

                    const itemName = $item.find('.media-body h6.mb-1').text().trim();
                    if (!itemName) return;

                    // Extract food type (Veg/NonVeg)
                    let foodType = 'Veg';
                    if ($item.find('.text-danger.non_veg').length > 0) {
                        foodType = 'NonVeg';
                    }

                    // Extract price information
                    const priceElement = $item.find('.text-gray strong');
                    const price = priceElement.text().trim();
                    
                    const strikeElement = $item.find('.text-gray strike');
                    const originalPrice = strikeElement.text().trim();

                    // Extract highlight information
                    const highlightElement = $item.find('.badge.badge-dark');
                    const highlightName = highlightElement.text().trim();

                    // Extract offer information
                    const offerElement = $item.find('.badge.badge-success');
                    const offerAmount = offerElement.text().trim();

                    const foodItem = {
                        name: itemName,
                        price: price,
                        originalPrice: originalPrice || null,
                        foodType: foodType,
                        highlightName: highlightName || null,
                        offerAmount: offerAmount || null,
                        category: categoryName
                    };

                    items.push(foodItem);
                    totalItems++;
                    
                    console.log(`  - ${itemName} (${foodType}): ${price}${originalPrice ? ` (was ${originalPrice})` : ''}`);
                });

                if (items.length > 0) {
                    categories.push({
                        name: categoryName,
                        itemCount: items.length,
                        items: items
                    });
                }
            }
        });

        console.log(`\nTotal items found: ${totalItems}`);
        console.log(`Total categories: ${categories.length}`);
        
        const result = {
            restaurantName,
            restaurantAddress,
            restaurantImage,
            categories,
            totalItems
        };

        console.log("\nFinal result:");
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error("Error scraping data:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        }
    }
}

// Test the API method as well
async function testAPIScraping() {
    try {
        console.log("\n\nTesting API-based scraping...");
        
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
        };

        const response = await axios.post(
            "https://www.pumpkinkart.com/ajax_item_filter.php",
            {
                iCompanyId: '423',
                CheckNonVegFoodType: 'No'
            },
            { headers }
        );

        console.log("API Response:", JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error("Error in API scraping:", error.message);
    }
}

// Run both tests
testScraping().then(() => {
    return testAPIScraping();
}).catch(console.error); 