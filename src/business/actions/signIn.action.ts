import axios from 'axios';
import {Enums} from '../../constants';

const url = `${Enums.BASE_URL}api/token/create`;

export const deneme = async () => {
  await axios.post(url, {
    username: 'super',
    password: 'Y3KKwe7jGMD',
  });
};
