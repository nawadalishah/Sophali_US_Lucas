
class DataAccess {
    private dbmodel: any;
    constructor(dbmodel: any) {
        this.dbmodel = dbmodel;
    }

    async create(data: any) {
        const newData = await this.dbmodel(data);
        const result = await newData.save();
        return result;
    }

    async findAll({ filter }: any = {}) {
        const result = await this.dbmodel.find(filter);
        return result;
    }

    async findOne({ filter }: any) {
        const result = await this.dbmodel.findOne(filter);
        return result;
    }

    async updateOne({ filter, data }: any) {
        const result = await this.dbmodel.updateOne(filter, data);
        return result;
    }

    async updateMany({ filter, data }: any) {
        const result = await this.dbmodel.updateMany(filter, data);
        return result;
    }

    async deleteOne({ filter }: any) {
        const result = await this.dbmodel.deleteOne(filter);
        return result;
    }

    async deleteMany({ filter }: any) {
        const result = await this.dbmodel.deleteMany(filter);
        return result;
    }
}

export default DataAccess;



