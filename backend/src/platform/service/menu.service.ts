import { GEMINI } from "../../utils/gemini";
import { categoryDA, foodDA } from "../data-access";
import { v4 as uuidv4 } from 'uuid';

const gemini = new GEMINI(process.env.GEMINI_API_KEY || "dfsdfsd");

class MenuService {

    async analyzeImage(file: Express.Multer.File) {
        // You can access file.buffer, file.path, etc.
        // Process the image as needed
        const instruction = `
            Extract infos about the food.
            Respond with a JSON object.

            {
                "name": string(name of food),
                "description": string(explaination about the food),
                "price": number(e.g: 5),
                "calories": string (e.g: 500-600),
                "star": number(e.g: 4.5)
                "prepareTime": string (e.g: 10 mins)
            }
            Only return the object. No explanation before or after.
            
      `;
        const contents: any = [{
            role: "user",
            imageFile: file
        }];
        const response = await gemini.generateText({ contents, instruction });
        const candidate = response.candidates?.[0];
        const part = candidate?.content?.parts?.[0];
        const result = gemini.geminiFormatResult(part?.text || "null");
        return result;
    }

    async getFoods(foodTruckId?: string) {
        const data = await foodDA.findAll({ foodTruckId });
        return data;
    }
    async getAllFoods() {
        const data = await foodDA.findAll();
        return data;
    }

    async create(food: any) {
        const id = uuidv4();
        const data = await foodDA.create({ id, ...food });
        return data;
    }

    async remove(id: string) {

        await foodDA.deleteOne({ id });
        return { success: true };
    }

    async addCategory(name: string, foodTruckId: string) {
        const id = uuidv4();
        const data = await categoryDA.create({ id, name, foodTruckId });
        return data;
    }
}

export default MenuService;