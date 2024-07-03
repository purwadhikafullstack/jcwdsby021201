import { RAJAONGKIR_API_KEY } from '@/config';
import { CheckoutBody } from '@/types/checkout.type';
import { responseWithData, responseWithoutData } from '@/utils/response';
import { CheckoutValidation } from '@/validators/checkout.validation';
import { Validation } from '@/validators/validation';
import axios from 'axios';
import { any } from 'zod';

export class CheckoutService {
  static async countShippingCost(body: CheckoutBody) {
    const newBody = Validation.validate(
      CheckoutValidation.COUNT_SHIPPING_BODY,
      body,
    );

    const { courier, destination, origin, weight } = newBody;

    if (!courier || !destination || !origin || !weight) {
      return responseWithoutData(400, false, 'Missing required parameters');
    }
    try {
      const response = await axios.post(
        'https://api.rajaongkir.com/starter/cost',
        {
          origin,
          destination,
          weight,
          courier,
        },
        {
          headers: {
            key: RAJAONGKIR_API_KEY,
          },
        },
      );

      const results: any[] = response.data.rajaongkir.results;

     
      const transformedResults = results.map((result: any) => {
        return result.costs.map((cost: any) => ({
          code: result.code,
          name: result.name,
          service: cost.service,
          description: cost.description,
          value: cost.cost[0].value,
          etd: cost.cost[0].etd,
          note: cost.cost[0].note,
        }));
      })[0]; 

      return responseWithData(
        200,
        'Success Get Shipping Cost',
        transformedResults,
      );
    } catch (error) {
      throw error;
    }
  }
}
