import Role from '@models/role';
import { ERole, IRole } from '@components/role/role.types';
import { failedResponse, successResponse, customRequest, customResponse } from '@utils/http';

const fakeRole = {
    name: 21312
};

export const createTestRole = async (req: customRequest, res: customResponse<any>) => {
    try {
        const test = await Role.create(fakeRole)

        res.json(successResponse(test));
    } catch (err) {
        res.json(failedResponse(err, 'Error'));
    }
}