import { calculateDistance } from "../../utils/calculateDistance";
import { GEMINI } from "../../utils/gemini";
import { menuService, foodTruckService, orderService } from "../service";

const gemini = new GEMINI(process.env.GEMINI_API_KEY || "dfsdfsd");


let allFoodTrucks: any = [];
let allFoods: any = [];

class ChattingService {
    functionDeclarations: Object = [
        {
            name: "find_foodtrucks",
            description: "Finds food trucks within a specified radius (in kilometers) from the user's location. The default radius is 200 km.",
            parameters: {
                type: "object",
                properties: {
                    radius: {
                        type: "number", description: "The radius of the range the user wants to find. Default is 200(km) and unit is km."
                    }
                },
                required: ["radius"]
            }
        },
        {
            name: "place_order",
            description: "Places a food order for the user if user want to place order",
            parameters: {
                type: "object",
                properties: {
                    foodTruckId: { type: "string", description: "ID of the food truck" },
                    foods: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string", description: "ID of the food" },
                                name: { type: "string", description: "Name of the food" },
                                amount: { type: "number", description: "Amount of the food" },
                                price: { type: "number", description: "Price of the food" },
                                star: { type: "number", description: "Star of the food" },
                                description: { type: "string", description: "Description of the food" },
                                calories: { type: "string", description: "Calories of the food" },
                                prepareTime: { type: "string", description: "prepareTime of the food" }
                            },
                            required: ["id", "name", "amount", "price", "star", "description", "calories", "prepareTime"]
                        }
                    }
                },
                required: ["foodTruckId", "foods"]
            }
        },
        {
            name: "foods_information",
            description: "Provide information about foods or foods of food trucks that user searched by chatting.",
            parameters: {
                type: "object",
                properties: {
                    foodTruckId: { type: "string", description: "ID of the food truck" },
                    foods: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string", description: "ID of the food" },
                                name: { type: "string", description: "Name of the food" },
                                price: { type: "number", description: "Price of the food" },
                                star: { type: "number", description: "Star of the food" },
                                description: { type: "string", description: "Description of the food" },
                                calories: { type: "string", description: "Calories of the food" },
                                prepareTime: { type: "string", description: "prepareTime of the food" }
                            },
                            required: ["id", "name", "price", "star", "description", "calories"]
                        }
                    }
                },
                required: ["foodTruckId", "foods"]
            }
        }
    ];
    async applyForUserQuestion(req: any, res: any) {
        try {
            const { message, userData, chattingHistory } = req.body;
            console.log("req.body", req.body.userData, req.body.message);

            if (!allFoodTrucks.length) {
                allFoodTrucks = await this.getAllFoodTrucks();
            }
            if (!allFoods.length) {
                allFoods = await this.getAllFoods();
            }
            console.log("allfoodtrucks", allFoodTrucks[0])
            // Define Gemini function declarations for tool calling
            const tools = [{ functionDeclarations: this.functionDeclarations }];

            const instruction = `
            You are an assistant to help users find the best food truck and food, and place orders if requested.

            If the user asks about the distance to food trucks, calculate the distance from the user's location to each food truck using their latitude and longitude. 
            Use the Haversine formula or a similar method to compute the distance in kilometers or meters.
            Return the distance for each food truck in your response.

            Use the available function calls if the user wants to place an order or needs food information.

            Here is user address: ${JSON.stringify(userData.location)}
            All foodTrucks data: ${JSON.stringify(allFoodTrucks)}
            All foods data: ${JSON.stringify(allFoods)}
            `;


            const convertedChatHistory = this.convertChatHistoryType(chattingHistory);
            const contents: any = [
                ...convertedChatHistory,
                {
                    role: "user",
                    text: message
                }
            ];

            // Call Gemini with function calling support
            const response = await gemini.generateText({ contents, instruction, tools });
            // Check if Gemini wants to call a function (per Gemini API docs)
            const candidate = response.candidates?.[0];
            const part = candidate?.content?.parts?.[0];
            const functionCall = part?.functionCall;
            console.log("response", candidate, part, functionCall);
            if (functionCall) {
                const { name, args } = functionCall;
                if (name === "place_order") {
                    const orderResult = await this.handleOrderPlacementFromFunctionCall(args, userData);
                    res.status(200).json(orderResult);
                    return;
                }
                if (name === "foods_information") {
                    const orderResult = await this.foods_information(args, userData, part);
                    res.status(200).json(orderResult);
                    return;
                }
                if (name === "find_foodtrucks") {
                    const distances = await this.distances_to_foodtrucks(args, userData);
                    res.status(200).json(distances);
                    return;
                }
            }

            // Fallback: handle as normal chat (suggestion, etc.)
            let formatedResponse: any = {};
            if (part?.text) {
                formatedResponse.message = part.text;
                // If the model returned a text part, try to parse it as before
                // formatedResponse = gemini.geminiFormatResult(part.text);
            }
            console.log("formatedresponse", formatedResponse);
            // const foods = formatedResponse.foodIds?.map((id: string) => {
            //     return allFoods.find((food: any) => food.id === id);
            // }) || [];
            res.status(200).json({ ...formatedResponse, isOrder: false });
        } catch (error: any) {
            console.log("send message error", error);
            res.status(500).json(error.message);
        }
    }

    convertChatHistoryType(chatHistory: any) {
        return chatHistory.map((chatContent: any) => ({
            role: chatContent.isUser ? "user" : "model",
            text: chatContent.text
        })
        )
    }


    async getAllFoodTrucks() {
        const data = await foodTruckService.getFoodTrucks();
        return data;
    }

    async getAllFoods() {
        const data = await menuService.getAllFoods();  
        return data;
    }

    async handleOrderPlacementFromFunctionCall(args: any, userData: any) {
        // args will be the parsed arguments from Gemini's function call
        // You can now use your existing order logic here
        const orderData = {
            orderOwner: userData.id,
            foodTruck: args.foodTruckId,
            isOrder: true,
            orderFoods: args.foods
        };
        // const createdOrder = await orderService.createOrder(orderData);
        return {
            message: "Order placed successfully!",
            ...orderData
        };
    }
    async foods_information(args: any, userData: any, part: any) {
        // args will be the parsed arguments from Gemini's function call
        // You can now use your existing order logic here
        const data = {
            orderOwner: userData.id,
            foodTruck: args.foodTruckId,
            isOrder: false,
            foodInforms: args.foods
        };
        return {
            message: "Food Information",
            ...data
        };
    }

    async distances_to_foodtrucks(args: any, userData: any) {
        const userLocation = userData.location;
        const radius = args.radius;
        console.log("radius", radius);
        if(!allFoodTrucks.length) {
            allFoodTrucks = await this.getAllFoodTrucks();
        }
        const foodTrucks: any[] = [];
        const data = await Promise.all(
            allFoodTrucks.map(async (foodTruck: any) => {
                const distanceInfo: any = await calculateDistance(
                    userLocation,
                    foodTruck.location
                );
                const distance = distanceInfo?.distance.split(" ")[0]
                if(distance && Number(distance) <= radius) {
                    foodTrucks.push( {
                        ...foodTruck, 
                        distance: distanceInfo?.distance, // e.g., "2.3 km"
                        duration: distanceInfo?.duration  // e.g., "5 min"
                    })
                }
                return foodTruck
            })
        ); 
        console.log("data", data);
        return {
            message:"Foodtrucks you want.",
            isOrder: false,
            foodTrucks: foodTrucks
        }
    }
}

export default ChattingService;