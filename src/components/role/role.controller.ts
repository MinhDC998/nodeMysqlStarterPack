import Role from '../../database/models/role';
import { ERole, IRole } from './role.types';
import { failedResponse, successResponse, customRequest, customResponse } from '../../utils/http';

const fakeRole = {
    name: ERole.ADMIN
};

export const createTestRole = async (req: customRequest, res: customResponse<any>) => {
    try {
        const test = await Role.create(fakeRole)

        res.json(successResponse(test));
    } catch (err) {
        res.json(failedResponse(err, 'Error'));
    }
}