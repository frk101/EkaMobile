let ApiUrl = '';
let SatKod = '';
let pazarlamaciAdi = '';
let allOrders = false;

const changeApiUrl = (token: string) => {
  ApiUrl = token;
};
const changeSatKod = (token: string) => {
  SatKod = token;
};
const changePazarlamaci = (token: string) => {
  pazarlamaciAdi = token;
};
const changeAllOrders = (order: boolean) => {
  allOrders = order;
};

export {
  ApiUrl,
  SatKod,
  allOrders,
  changeAllOrders,
  changeApiUrl,
  changePazarlamaci,
  changeSatKod,
  pazarlamaciAdi,
};
