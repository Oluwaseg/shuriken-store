import moment from 'moment';

export const formatDate = (date) => {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a'); // Format the date as 'November 26th 2024, 3:30 PM'
};
