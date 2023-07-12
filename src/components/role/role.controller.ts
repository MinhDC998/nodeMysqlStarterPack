// import Role from '@models/role';
// import { IRole, ICreateRoleRequest, IListRoleRequest } from '@components/role/role.types';
// import { failedResponse, successResponse, customRequest, customResponse } from '@utils/http';
// import { NextFunction } from 'express';
// import { sequelize } from '@models/.';

// export const create = async (req: customRequest<never, ICreateRoleRequest>, res: customResponse<IRole>, next: NextFunction) => {
//     const transaction = await sequelize.transaction();

//     try {
//         const data = req.body;
//         const result = await Role.create(data, { transaction });

//         transaction.commit();

//         res.json(successResponse(result));
//     } catch (err) {
//         transaction.rollback();

//         res.json(failedResponse('Error', 'Error'));
//     }
// }

// export const list = async (req: customRequest<never, never, IListRoleRequest>, res: customResponse<any>, next: NextFunction) => {
//     try {
//         const { offset, limit } = req.query;
//         const result = await Role.findAndCountAll({ offset: +offset, limit: +limit });

//         res.json(successResponse(result));
//     } catch (err) {
//         res.json(failedResponse('Error', 'Error'));
//     }
// }

// export const detail = async (req: customRequest<{ id: string }>, res: customResponse<any>, next: NextFunction) => {
//     try {
//         const result = await Role.findByPk(req.params.id);

//         if (!result) {
//             res.json(failedResponse('Not Found', 'NotFound'));
//             return;
//         }

//         res.json(successResponse(result));
//     } catch (err) {
//         res.json(failedResponse('Error', 'Error'));
//     }
// }

// export const update = async (req: customRequest<{ id: string }, IRole>, res: customResponse<any>, next: NextFunction) => {
//     try {
//         sequelize.transaction(async (transaction: any) => {
//             const { id } = req.params;
//             const inputUpdate = req.body;

//             await Role.update(inputUpdate, { where: { id }, transaction });

//             res.json(successResponse(await Role.findByPk(id)));
//         });
//     } catch(err) {
//         res.json(failedResponse('Error', 'Error'));
//     }
// }

// export const remove = async (req: customRequest<{ id: string }>, res: customResponse<any>, next: NextFunction) => {
//     try {
//         sequelize.transaction(async (transaction: any) => {
//             const { id } = req.params;

//             await Role.destroy({ where: { id }, transaction });

//             res.json(successResponse(true));
//         });
//     } catch (err) {
//         res.json(failedResponse('Error', 'Error'));
//     }
// }
