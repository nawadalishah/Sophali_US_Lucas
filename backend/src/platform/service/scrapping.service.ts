import axios from "axios";
import * as cheerio from "cheerio";

interface FoodItem {
    id: string;
    name: string;
    description: string;
    price: string;
    originalPrice?: string;
    foodType: 'Veg' | 'NonVeg';
    highlightName?: string;
    highlightColor?: string;
    offerAmount?: string;
    offerLimit?: string;
    image?: string;
    category: string;
}

interface FoodCategory {
    name: string;
    itemCount: number;
    items: FoodItem[];
}

interface ScrapingResult {
    restaurantName: string;
    restaurantAddress: string;
    restaurantImage: string;
    categories: FoodCategory[];
    totalItems: number;
}

const ScrappingFoodsOfRestaurantService = async (url: string = "https://www.pumpkinkart.com/restaurants/east-coast-donair-314-parliament-street-579"): Promise<ScrapingResult | null> => {
    try {
        // Add headers to mimic a real browser request
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        };

        const response = await axios.get(
            url,
            { headers }
        );

        const $ = cheerio.load(response.data);
        // console.log("html_data", $);
        
        // Extract restaurant information
        const restaurantName = $('#cartStoreName').text().trim() || 'Lazeez Shawarma';
        const restaurantAddress = $('#cartStoreLocation').text().trim().replace('📍', '').trim();
        const restaurantImage = $('#storeImage').attr('src') || '';

        const categories: FoodCategory[] = [];
        let totalItems = 0;

        // Find all menu sections
        $('.row.m-0').each((index, element) => {
            const $section = $(element);
            const categoryName = $section.find('h6.p-3.m-0.bg-light.w-100').text().trim();
            
            if (categoryName) {
                const itemCountMatch = categoryName.match(/(\d+)\s*ITEMS/);
                const itemCount = itemCountMatch ? parseInt(itemCountMatch[1]) : 0;
                
                const items: FoodItem[] = [];
                
                // Extract food items from this category
                $section.find('.gold-members').each((itemIndex, itemElement) => {
                    const $item = $(itemElement);
                    
                    // Skip if this is not a food item (check for ADD button)
                    if ($item.find('a[onclick*="checkStore"]').length === 0) {
                        return;
                    }

                    const itemName = $item.find('.media-body h6.mb-1').text().trim();
                    if (!itemName) return;
                    const description = $item.find('.media-body p.text-muted.mb-0').text().trim();

                    // Extract food type (Veg/NonVeg)
                    let foodType: 'Veg' | 'NonVeg' = 'Veg';
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
                    const highlightColor = highlightElement.attr('style')?.match(/background-color:([^;]+)/)?.[1] || '';

                    // Extract offer information
                    const offerElement = $item.find('.badge.badge-success');
                    const offerAmount = offerElement.text().trim();
                    
                    const offerLimitElement = $item.find('.badge:not(.badge-success):not(.badge-dark)');
                    const offerLimit = offerLimitElement.text().trim();

                    // Extract image
                    const imageElement = $item.find('img');
                    const image = imageElement.attr('data-src') || imageElement.attr('src') || '';

                    // Generate unique ID
                    const itemId = `item_${index}_${itemIndex}`;

                    const foodItem: FoodItem = {
                        id: itemId,
                        name: itemName,
                        description,
                        price: price,
                        originalPrice: originalPrice || undefined,
                        foodType: foodType,
                        highlightName: highlightName || undefined,
                        highlightColor: highlightColor || undefined,
                        offerAmount: offerAmount || undefined,
                        offerLimit: offerLimit || undefined,
                        image: image || undefined,
                        category: categoryName
                    };

                    items.push(foodItem);
                    totalItems++;
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

        const result: ScrapingResult = {
            restaurantName,
            restaurantAddress,
            restaurantImage,
            categories,
            totalItems
        };

        // console.log("Scraped data:", JSON.stringify(result, null, 2));
        return result;

    } catch (error) {
        console.error("Error scraping data:", error);
        return null;
    }
};

const ScrappingRestaurantsService = async (url: string = "https://www.pumpkinkart.com/trending?iCategoryId=6") => {
  
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Wind        ows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        };

        const response = await axios.get(
            url,
            { headers }
        );

        // The response.data is HTML. We'll extract restaurant data from it.
        const html = response.data;

        // Use cheerio to parse the HTML
        // If using TypeScript, import as: import * as cheerio from 'cheerio';
        // Here, require is used for compatibility
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const cheerio = require('cheerio');
        const $ = cheerio.load(html);

        // Each restaurant is in a div with class 'col-lg-3 mb-3'
        const restaurants: {
            name: string;
            prepareTime: string | undefined;
            address: string;
            cuisine: string;
            image: string;
            rating: string;
            priceForTwo: string;
            offer: string;
            status: string;
            link: string;
        }[] = [];

        $('.col-lg-3.mb-3').each((i: number, el: cheerio.Element) => {
            const $el = $(el);

            // Get restaurant name
            let name = $el.find('h6.mb-1 a').first().text().trim();
            if (!name) {
                name = $el.find('h6.mb-1').first().text().trim();
            }
            // Extract prepare time from the .text-gray.mb-1.time element
            let prepareTime: string | undefined = undefined;
            const timeText = $el.find('p.text-gray.mb-1.time').first().text().trim();
            // Example: "Prep ~20 mins $500 FOR TWO"
            const prepMatch = timeText.match(/Prep\s*~?\s*([\d]+)\s*min/i);
            if (prepMatch) {
                prepareTime = prepMatch[1] + ' mins';
            } else {
                // Try to extract from span with feather-clock icon
                const prepSpan = $el.find('i.feather-clock').parent();
                if (prepSpan.length) {
                    const prepText = prepSpan.text();
                    const match = prepText.match(/Prep\s*~?\s*([\d]+)\s*min/i);
                    if (match) {
                        prepareTime = match[1] + ' mins';
                    }
                }
            }
            // Get address (usually in .text-gray.mb-1.small)
            let address = $el.find('p.text-gray.mb-1.small').first().text().trim();

            // Get cuisine (first .text-gray.mb-1 that is not .small or .time)
            let cuisine = '';
            $el.find('p.text-gray.mb-1').each((j: number, p: cheerio.Element) => {
                const $p = $(p);
                if (!$p.hasClass('small') && !$p.hasClass('time')) {
                    const txt = $p.text().trim();
                    if (txt && txt !== address) {
                        cuisine = txt;
                    }
                }
            });

            // Get image
            let image = $el.find('img.item-img').first().attr('src') || '';
            if (!image) {
                image = $el.find('img').first().attr('src') || '';
            }

            // Get rating (in .badge-success)
            let rating = $el.find('.badge-success').first().text().trim();

            // Get price for two (in .float-right.text-black-50)
            let priceForTwo = '';
            $el.find('.float-right.text-black-50').each((j: number, p: cheerio.Element) => {
                const txt = $(p).text().trim();
                if (txt.includes('FOR TWO')) priceForTwo = txt;
            });

            // Get offer message (in .list-card-badge.text-g-color or .badge-dark)
            let offer = $el.find('.list-card-badge.text-g-color').first().text().trim();
            if (!offer) {
                offer = $el.find('.badge-dark').first().text().trim();
            }

            // Get status (Closed/Open, in .after or .class="after")
            let status = '';
            $el.find('.after').each((j: number, p: cheerio.Element) => {
                const txt = $(p).text().trim();
                if (txt) status = txt;
            });

            // Get link (from <a href=...>)
            let link = $el.find('a').first().attr('href') || '';

            restaurants.push({
                name,
                prepareTime,
                address,
                cuisine,
                image,
                rating,
                priceForTwo,
                offer,
                status,
                link
            });
        });

        console.log("Extracted restaurants:", restaurants);
        return restaurants;
  
}

export { ScrappingRestaurantsService, ScrappingFoodsOfRestaurantService };