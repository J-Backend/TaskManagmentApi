class BaseController {
    constructor(model) {
        this.model = model;
        this.entityName = this.model.modelName;
        this.key = this.entityName === "User" ? "email" : "title";

        this.getAll = this.getAll.bind(this)
        this.create = this.create.bind(this)
        this.update = this.update.bind(this)
        this.delete = this.delete.bind(this)
    }

    async getAll(req, res) {

        let entities = {};
        try {
     
            this.entityName === "User"
                ? (entities = await this.model.find().select("-password").lean())
                : (entities = await this.model.find().lean());

            console.log("entitiesResponse ", entities)
            if (!entities?.length) {
                return res
                    .status(400)
                    .json({ message: `Not ${this.entityName} entities found` });
            }

            if(this.entityName === "Task") entities = this.dateToString(entities)

            res.json(entities);
        } catch (error) {
            console.log("Error in getAll query: ", error);
        }
    }

    async create(req, res) {
        try {
            const newEntity = req.body;
            console.log("data: ", newEntity)


            if (!this.isValidate(newEntity)) {
                return res.status(400).json({ message: `Invalid data received` });
            }

            const duplicate = await this.model.findOne(this.setKey()).lean().exec();

            console.log("Duplicate ", duplicate)

            if (duplicate) {
                //409 conflict
                return res
                    .status(409)
                    .json({ message: `Duplicate ${this.entityName}` });
            }

            console.log("NewEntity prev ", newEntity)

            await this.packNewData(newEntity);

            console.log("NewEntity post ", newEntity)
            const newRecord = await this.model.create(newEntity);

            newRecord
                ? res.status(201).json({ message: `New ${this.entityName}: ${newRecord[this.key]} was created` })
                : res.status(400).json({ message: "Invalid data received" });
        } catch (error) {
            console.log("Error in create query: ", error);
        }
    }

    async update(req, res) {
        try {
            const dataEntity = req.body;
            if (!this.isValidate(dataEntity)) {
                return res.status(400).json({ message: `Invalid data received` });
            }

            const recordEntity = await this.model.findById(dataEntity.id).exec();

            if (!recordEntity) {
                return res
                    .status(400)
                    .json({ message: `Not ${this.entityName} found` });
            }

            const duplicate = await this.model.findOne(this.setKey()).lean().exec();

            if (duplicate && duplicate?._id.toString() === dataEntity.id) {
                return res
                    .status(409)
                    .json({ message: `Duplicate ${this.entityName}` });
            }

            this.updateData(recordEntity, dataEntity);

            await recordEntity.save();

            res.json({ message: `The ${this.key}: ${recordEntity[this.key]} with ID: ${recordEntity._id} was was updated` });
        } catch (error) {
            console.log("Error in update query: ", error);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res
                    .status(400)
                    .json({ message: `${this.entityName} ID required` });
            }

            if (this.entityName === "User") {
                await this.checkDependencies(id, res);
            }

            const recordEntity = await this.model.findById(id).exec();

            if (!recordEntity) {
                return res
                    .status(400)
                    .json({ message: `${this.entityName} not found` });
            }

            await recordEntity.deleteOne();

            const reply = `The ${this.key}: ${recordEntity[this.key]} with ID: ${recordEntity._id} was deleted`
            console.log(reply);
            res.json(reply);

        } catch (error) {
            console.log("Error in delete query: ", error);
        }
    }

    isValidate(data) {
        throw new Error("isValidData method not implemented");
    }

    updateData(entity, newData) {
        throw new Error("updateData method not implemented");
    }

    dateToString(){}

    async packNewData(data) { }

    async checkDependencies(id, res) { }

    setKey() {
        let key = {}
        this.entityName === "User" ? key['email'] = 'email' : key['title'] = 'title'
        console.log("key: ", key)
        return key
    }

}

module.exports = BaseController;
