import { Response } from 'express';
import { failedResponse } from '@utils/http';
import { getCurrentDateTime } from '@utils/collection';

const handleError = (error: any, res: Response): void => {
    const { currentDateTime } = getCurrentDateTime();

    console.log({ [currentDateTime]: error });

    res.json(failedResponse('Something went wrong', 'Error'));
};

export default handleError;