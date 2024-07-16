import {
  LoginBody,
  OAuthBody,
  OnlyEmailBody,
  VerificationBody,
} from '@/types/auth.type';
import { sendEmail } from '@/utils/emailSender';
import {
  generateJWTTokenWithExpiry,
  generateJWTTokenWithoutExpiry,
  verifyJWTToken,
} from '@/utils/jwt';
import { responseWithData, responseWithoutData } from '@/utils/response';
import { AuthValidation } from '@/validators/auth.validation';
import { Validation } from '@/validators/validation';
import { clientRoutes } from '@/utils/routes';
import { UserRepository } from '@/repositories/user.repository';
import { comparePassword, hashPassword } from '@/utils/hash';

export class AuthService {
  static async register(body: OnlyEmailBody) {
    const { email } = Validation.validate(AuthValidation.ONLY_EMAIL, body);
    const checkMail = await UserRepository.findUserByEmail(email);

    if (checkMail && checkMail.isVerified) {
      return responseWithoutData(400, false, 'Email Already Exists');
    } else if (checkMail && !checkMail.isVerified) {
      await UserRepository.deleteUserByEmail(email);
    }

    const token = generateJWTTokenWithExpiry({ email }, '1h');
    await UserRepository.createUser({ email, jwtToken: token });
    await sendEmail(email, 'Account Verification', 'register', {
      email,
      url: `${clientRoutes.verify}/${token}`,
    });

    return responseWithoutData(
      201,
      true,
      'Success Create Account, Please Check Your Email!',
    );
  }

  static async verify(body: VerificationBody) {
    const { token, password } = Validation.validate(
      AuthValidation.VERIFICATION,
      body,
    );

    const decoded = verifyJWTToken(token);
    const checkMail = await UserRepository.findUserByEmail(decoded.email);

    if (!checkMail) {
      return responseWithoutData(400, false, 'Email Not Found');
    } else if (checkMail.email !== decoded.email) {
      return responseWithoutData(400, false, 'Invalid Token');
    } else if (checkMail.jwtToken !== token) {
      return responseWithoutData(400, false, 'Invalid Token');
    }

    const hashedPassword = await hashPassword(password);
    await UserRepository.updateUserByEmail(decoded.email, {
      password: hashedPassword,
      jwtToken: null,
      isVerified: true,
      provider: 'credentials',
    });

    return responseWithoutData(200, true, 'Success Verify Account');
  }

  static async login(body: LoginBody) {
    const { email, password } = Validation.validate(AuthValidation.LOGIN, body);

    const checkMail = await UserRepository.findUserByEmail(email);
    if (!checkMail) {
      return responseWithoutData(400, false, 'Invalid Credentials');
    } else if (!checkMail.isVerified) {
      return responseWithoutData(400, false, 'Email Not Verified');
    } else if (!checkMail.password) {
      return responseWithoutData(400, false, 'Invalid Credentials');
    }

    const checkPassword = await comparePassword(password, checkMail.password);
    if (!checkPassword) {
      return responseWithoutData(400, false, 'Invalid Credentials');
    }

    const token = generateJWTTokenWithoutExpiry({
      id: checkMail.id,
      role: checkMail.role,
      username: checkMail.username,
    });

    return responseWithData(200, 'Success Login', {
      username: checkMail.username,
      email: checkMail.email,
      isVerified: checkMail.isVerified,
      role: checkMail.role,
      image: checkMail.image,
      token,
    });
  }

  static async oauth(body: OAuthBody) {
    const { email, image, provider } = Validation.validate(
      AuthValidation.OAUTH,
      body,
    );

    const checkMail = await UserRepository.findUserByEmail(email);
    if (!checkMail) {
      const newUser = await UserRepository.createUser({
        email,
        isVerified: true,
        provider,
        image,
      });

      const token = generateJWTTokenWithoutExpiry({
        id: newUser.id,
        role: newUser.role,
      });

      return responseWithData(200, 'Success Create Account', {
        username: newUser.username,
        email: newUser.email,
        isVerified: newUser.isVerified,
        role: newUser.role,
        image: newUser.image,
        token,
      });
    }

    const token = generateJWTTokenWithoutExpiry({
      id: checkMail.id,
      role: checkMail.role,
      username: checkMail.username,
    });

    return responseWithData(200, 'Success Login', {
      username: checkMail.username,
      email: checkMail.email,
      isVerified: checkMail.isVerified,
      role: checkMail.role,
      image: checkMail.image,
      token,
    });
  }

  static async forgotPassword(body: OnlyEmailBody) {
    const { email } = Validation.validate(AuthValidation.ONLY_EMAIL, body);

    const checkMail = await UserRepository.findUserByEmail(email);
    if (!checkMail) {
      return responseWithoutData(400, false, 'Email Not Found');
    } else if (checkMail.provider !== 'credentials') {
      return responseWithoutData(
        400,
        false,
        "Can't Reset Password, You are login with social media",
      );
    }

    const token = generateJWTTokenWithExpiry({ email }, '1h');
    await UserRepository.updateUserByEmail(email, { jwtToken: token });
    await sendEmail(email, 'Forgot Password', 'forgot-password', {
      email,
      url: `${clientRoutes.resetPassword}/${token}`,
    });

    return responseWithoutData(
      200,
      true,
      'Check Your Email For Reset Password',
    );
  }

  static async resetPassword(body: VerificationBody) {
    const { token, password } = Validation.validate(
      AuthValidation.VERIFICATION,
      body,
    );

    const decoded = verifyJWTToken(token);
    const checkMail = await UserRepository.findUserByEmail(decoded.email);
    if (!checkMail) {
      return responseWithoutData(400, false, 'Email Not Found');
    } else if (checkMail.email !== decoded.email) {
      return responseWithoutData(400, false, 'Invalid Token');
    } else if (checkMail.jwtToken !== token) {
      return responseWithoutData(400, false, 'Invalid Token');
    }

    const hashedPassword = await hashPassword(password);
    await UserRepository.updateUserByEmail(decoded.email, {
      password: hashedPassword,
      jwtToken: null,
    });

    return responseWithoutData(200, true, 'Success Reset Password');
  }
}
