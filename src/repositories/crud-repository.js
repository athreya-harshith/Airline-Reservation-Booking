const { StatusCodes } = require('http-status-codes');
const {Logger} = require('../config');
const AppError = require('../utils/errors/app-error');
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
        console.log(data);
        const response = await this.model.create(data);
        return response;
    }

    async destroy(data)
    {
        const response = await this.model.destroy({
            where:{
                id:data
            }
        });
        if(!response)
            {
                throw new AppError('The Resource not found to delete',StatusCodes.NOT_FOUND);
            }
        return response;
    }

    async get(data)
    {
        const response = await this.model.findByPk(data);
        if(!response)
        {
            // handling this error in crud-repository is better in general it will handle automatically
            throw new AppError('Requested Resource Not Found to fetch',StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async getAll()
    {
        const response = await this.model.findAll();
        return response;
    }

    async update(id,data)// data is object {col:value,col:value,....}
    {
        // console.log('running update method',id,'\n',data);
        const response = await this.model.update(data,{
            where:{
                id:id
            }
        });
        if(!(response[0]))// because it gives the data as an array 
            throw new AppError('Requested Resource not found to update',StatusCodes.NOT_FOUND);
        return response;
        
    }
}

module.exports = CrudRepository;