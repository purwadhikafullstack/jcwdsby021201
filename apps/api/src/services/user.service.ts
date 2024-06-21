import { UserRepository } from '@/repositories/user.repository';
import {
  ActivationBody,
  CredentialBody,
  UpdateEmailBody,
} from '@/types/user.type';
import { sendEmail } from '@/utils/emailSender';
import { hashPassword } from '@/utils/hash';
import { generateJWTTokenWithExpiry, generateJWTTokenWithoutExpiry, verifyJWTToken } from '@/utils/jwt';
import { responseWithData, responseWithoutData } from '@/utils/response';
import { clientRoutes } from '@/utils/routes';
import { UserValidation } from '@/validators/user.validation';
import { Validation } from '@/validators/validation';

export class UserService {
  static async getDataProfile(id: number) {
    const response = await UserRepository.getUserById(id);

    return responseWithData(200, 'Get user profile successfully', {
      username: response?.username,
      email: response?.email,
      password: response?.password,
      image: response?.image,
    });
  }

  static async changeUserProfileCredential(id: number, body: CredentialBody) {
    const newBody = Validation.validate(UserValidation.CREDENTIAL, body);
    if (newBody.password) {
      newBody.password = await hashPassword(newBody.password);
    }
    const response = await UserRepository.changeUserProfileCredential(
      id,
      newBody,
    );

    return responseWithData(201, 'Update profile successfully', {
      username: response?.username,
      password: response?.password,
    });
  }

  static async checkEmailAvailability(body: UpdateEmailBody) {
    const newEmail = Validation.validate(UserValidation.EMAIL, body.email);
    const existingUser = await UserRepository.findUserByEmail(newEmail);

    if (existingUser !== null) {
      return responseWithoutData(409, false, 'Email is already taken');
    }

    return responseWithoutData(200, true, 'Email is available');
  }

  static async changeEmailUser(id: number, body: UpdateEmailBody) {
    const newEmail = Validation.validate(UserValidation.EMAIL, body.email);
    if (!id || !newEmail) {
      return responseWithoutData(400, false, 'ID and email are required');
    }

    // Cek email sudah dipake atau belum
    const existingUser = await UserRepository.findUserByEmail(newEmail);
    if (existingUser && existingUser.id !== id) {
      return responseWithoutData(400, false, 'Email is already taken');
    }
    const token = generateJWTTokenWithoutExpiry({ email: newEmail });

    const response = await UserRepository.changeEmailUser(
      id,
      {
        email: newEmail,
      },
      token,
    );

    if (!response) {
      return responseWithoutData(500, false, 'Failed to update email');
    }

    await sendEmail(newEmail, 'Verification Email', 'activation-account', {
      email: newEmail,
      url: `${clientRoutes.activationEmail}/${token}`,
    });

    return responseWithData(201, 'Update profile successfully', {
      email: response?.email,
    });
  }

  static async changeProfilPicture(id: number, file: Express.Multer.File) {
    if (!id || !file) {
      responseWithoutData(400, false, 'Token and file are required');
    }

    const response = await UserRepository.changeProfilPicture(id, file);

    return responseWithData(200, 'Profile picture updated successfully', {
      image: response?.image,
    });
  }

  static async activationAccount(body: ActivationBody) {
    const { token } = body;
    const decoded = verifyJWTToken(token);
    const checkMail = await UserRepository.findUserByEmail(decoded.email);

    if (!checkMail) {
      return responseWithoutData(400, false, 'Email Not Found');
    } else if (checkMail.email !== decoded.email) {
      return responseWithoutData(400, false, 'Invalid Token');
    } else if (checkMail.jwtToken !== token) {
      return responseWithoutData(400, false, 'Invalid Token');
    }

    await UserRepository.activationAccount(decoded.email, {
      jwtToken: null,
      isVerified: true,
    });
    return responseWithoutData(200, true, 'Success Activation Account');
  }
}
