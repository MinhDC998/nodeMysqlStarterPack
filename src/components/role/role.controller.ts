import Role from '@models/role';
import { ERole, IRole } from '@components/role/role.types';
import { failedResponse, successResponse, customRequest, customResponse } from '@utils/http';
import { NextFunction } from 'express';
import { sequelize } from '@models/.'


const fakeRole = {
    name: 'name'
};

export const createTestRole = async (req: customRequest, res: customResponse<any>, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const result = await Role.create(fakeRole, { transaction });

        res.json(successResponse(result));
    } catch (err) {
        res.json(failedResponse(err, 'Error'));
    }
}