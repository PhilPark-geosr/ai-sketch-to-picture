import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import moment from 'moment';

export interface Stock {
  basDt: string;
  srtnCd: string;
  isinCd: string;
  itmsNm: string;
  mrktCtg: string;
  clpr: string;
  vs: string;
  fltRt: string;
  mkp: string;
  hipr: string;
  lopr: string;
  trqu: string;
  trPrc: string;
  lstgStCnt: string;
  mrktTotAmt: string;
}
export const useFetchStocks = (target: string) => {
  const TODAY = moment().subtract(8, 'days').format('YYYYMMDD').toString();
  console.warn('TODAY', TODAY);
  const APIURL =
    'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo';
  const APIKEY = import.meta.env.VITE_DATA_API_KEY;
  const query = useQuery<Stock[], Error>({
    queryKey: ['stock', target],
    queryFn: async () => {
      try {
        const response = await axios.get(APIURL, {
          params: {
            resultType: 'json',
            beginBasDt: TODAY,
            itmsNm: target,
            serviceKey: APIKEY, // Alpha Vantage API 키 입,력
          },
        });
        if (response.status === 200) {
          const {
            data: {
              response: {
                body: {
                  items: { item: result },
                },
              },
            },
          } = response;
          return result;
        } else {
          return [];
        }
      } catch (error) {
        console.warn('erorr', error);
        throw new Error('error');
      }
    },
    staleTime: 1000 * 10,
    enabled: true,
  });
  return query;
};
