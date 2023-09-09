const {Logger} = require('../config');
class CrudRepository
{
    constructor(model)
    {
        this.model= model;
    }

    async create(data)
    {
        // try
        // {
        //     const response = await this.model.create(data);
        //     return response;
        // }
        // catch(error)
        // {
        //     Logger.error('Something went wrong in the crud repo : create');
        //     throw error;
        // }
        // before it was not commented 
        
        // after commenting , added this : ->> if this throws an error its sent to services
        const response = await this.model.create(data);
        return response;
    }

    async destroy(data)
    {
        try
        {
            const response = await this.model.destroy({
                where:{
                    id:data
                }
            });
            return response;
        }
        catch(error)
        {
            Logger.error('Something went wrong in the crud repo : destroy');
            throw error;
        }
    }

    async get(data)
    {
        try
        {
            const response = await this.model.findByPk(data);
            return response;
        }
        catch(error)
        {
            Logger.error('Something went wrong in the crud repo : get');
            throw error;
        }
    }

    async getAll()
    {
        try
        {
            const response = await this.model.findAll();
            return response;
        }
        catch(error)
        {
            Logger.error('Something went wrong in the crud repo : getAll');
            throw error;
        }
    }

    async update(id,data)// data is object {col:value,col:value,....}
    {
        try
        {
            const response = await this.model.update(data,{
                where:{
                    id:id
                }
            })
            return response;
        }
        catch(error)
        {
            Logger.error('Something went wrong in the crud repo : update');
            throw error;
        }
    }
}

module.exports = CrudRepository;