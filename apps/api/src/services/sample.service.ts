import { SampleRepository } from '@/repositories/sample.repository';
import { SampleBody } from '@/types/sample.type';
import { responseWithData, responseWithoutData } from '@/utils/response';
import { SampleValidation } from '@/validators/sample.validation';
import { Validation } from '@/validators/validation';

export class SampleService {
  static async getSample() {
    const response = await SampleRepository.getSample();
    return responseWithData(200, 'Success Get Sample Data', response);
  }

  static async getSampleById(id: string) {
    const newId = Validation.validate(SampleValidation.SAMPLE_ID, id);
    const response = await SampleRepository.getSampleById(Number(newId));

    if (!response) return responseWithoutData(404, false, 'Data Not Found');
    return responseWithData(200, 'Success Get Sample Data', response);
  }

  static async createSample(body: SampleBody) {
    const newBody = Validation.validate(SampleValidation.CREATE, body);

    const checkCode = await SampleRepository.getSampleByCode(newBody.code);
    if (checkCode) {
      return responseWithoutData(400, false, 'Code Already Exists');
    }

    const response = await SampleRepository.createSample(newBody);
    return responseWithData(201, 'Success Create Sample Data', response);
  }
}
