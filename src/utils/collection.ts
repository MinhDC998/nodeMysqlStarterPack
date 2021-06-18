import { format } from 'date-fns';

export const defaultOffset = 0;
export const defaultLimit = 20;

export const getCurrentDateTime = (dateFormat = 'yyyy-MM-dd', timeFormat = 'hh:mm:ss'): { currentDate: string, currentTime: string, currentDateTime: string } => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'hh:mm:ss');
    const currentDateTime = `${ currentDate } ${ currentTime }`;
    
    return { currentDate, currentTime, currentDateTime }
}