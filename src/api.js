import md5 from 'md5';
import axios from 'axios';

const BASE_URL = 'https://api.valantis.store:41000/';
const PASSWORD = 'Valantis';

const generateAuthHeader = () => {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return md5(`${PASSWORD}_${timestamp}`);
};
export const fetchProducts = async (action, params = {}) => {
    const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value != null && value !== ''));
    try {
      const response = await axios.post(BASE_URL, {
        action,
        params: filteredParams,
      }, {
        headers: { 'X-Auth': generateAuthHeader() },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('API Error:', error.response.data);
      } else {
        console.error('API Error:', error.message);
      }
      return null;
    }
  };