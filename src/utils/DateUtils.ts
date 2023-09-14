import {DateOptions} from '../types/interfaces'
export const formatDate = (dateString:Date) => {
    const date = new Date(dateString);
    const options:DateOptions = {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    return date.toLocaleString('en-US', options);
}