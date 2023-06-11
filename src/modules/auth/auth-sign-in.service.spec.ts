import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import { AuthUsersService } from '../users/auth-users.util';
import { User } from '../users/entities/user.entity';
import { ERole, EUserStatus } from '../users/users.constant';
import { AuthSignInService } from './auth-sign-in.service';
import { SignInByPhoneNumberDto } from './dto/register-auth.dto';
import { EncryptionsService } from './encryptions.service';
import { FirebaseService } from './firebase.service';

describe('AuthService', () => {
  let service: AuthSignInService;
  let authUsersService: AuthUsersService;
  let encryptionsService: EncryptionsService;
  let firebaseService: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthSignInService,
        {
          provide: AuthUsersService,
          useValue: createMock(),
        },
        {
          provide: EncryptionsService,
          useValue: createMock(),
        },
        {
          provide: FirebaseService,
          useValue: createMock(),
        },
      ],
    }).compile();

    service = module.get<AuthSignInService>(AuthSignInService);
    authUsersService = module.get<AuthUsersService>(AuthUsersService);
    encryptionsService = module.get<EncryptionsService>(EncryptionsService);
    firebaseService = module.get<FirebaseService>(FirebaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#signInByPhoneNumber', () => {
    it('Should sign in by phone number successfully when found user', async () => {
      const signInByPhoneNumberDto: SignInByPhoneNumberDto = {
        token: 'abcd',
      };
      const mockDecodedToken: DecodedIdToken = {
        aud: 'abc',
        auth_time: 1,
        exp: 1,
        firebase: {
          identities: { test: 1 },
          sign_in_provider: 'abc',
        },
        iat: 1,
        iss: '1',
        sub: '1',
        uid: '1',
        phone_number: '+84971016191',
      };
      const mockFindOneUserData = createMock<User>({
        id: '12345',
        role: ERole.member,
      });
      const mockJwt = 'abcd';

      jest
        .spyOn(firebaseService, 'decodeToken')
        .mockResolvedValue(mockDecodedToken);
      jest
        .spyOn(authUsersService, 'findOne')
        .mockResolvedValue(mockFindOneUserData);
      jest.spyOn(encryptionsService, 'signJwt').mockReturnValue(mockJwt);

      const result = service.signInByPhoneNumber(signInByPhoneNumberDto);

      await expect(result).resolves.toEqual({ accessToken: mockJwt });
      expect(firebaseService.decodeToken).toHaveBeenCalledWith(
        signInByPhoneNumberDto.token,
      );
      expect(authUsersService.findOne).toHaveBeenLastCalledWith(
        { phoneNumber: mockDecodedToken.phone_number },
        {
          selects: ['status', 'role'],
        },
      );
      expect(encryptionsService.signJwt).toHaveBeenLastCalledWith({
        sub: mockFindOneUserData.id,
        id: mockFindOneUserData.id,
        role: mockFindOneUserData.role,
      });
    });

    it('Should sign in by phone number successfully when not found user', async () => {
      const signInByPhoneNumberDto: SignInByPhoneNumberDto = {
        token: 'abcd',
      };
      const mockDecodedToken: DecodedIdToken = {
        aud: 'abc',
        auth_time: 1,
        exp: 1,
        firebase: {
          identities: { test: 1 },
          sign_in_provider: 'abc',
        },
        iat: 1,
        iss: '1',
        sub: '1',
        uid: '1',
        phone_number: '+84971016191',
      };
      const mockCreateUserData = createMock<User>({
        id: '12345',
        role: ERole.member,
      });
      const mockJwt = 'abcd';

      jest
        .spyOn(firebaseService, 'decodeToken')
        .mockResolvedValue(mockDecodedToken);
      jest.spyOn(authUsersService, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(authUsersService, 'create')
        .mockResolvedValue(mockCreateUserData);
      jest.spyOn(encryptionsService, 'signJwt').mockReturnValue(mockJwt);

      const result = service.signInByPhoneNumber(signInByPhoneNumberDto);

      await expect(result).resolves.toEqual({ accessToken: mockJwt });
      expect(firebaseService.decodeToken).toHaveBeenCalledWith(
        signInByPhoneNumberDto.token,
      );
      expect(authUsersService.findOne).toHaveBeenLastCalledWith(
        { phoneNumber: mockDecodedToken.phone_number },
        {
          selects: ['status', 'role'],
        },
      );
      expect(authUsersService.create).toHaveBeenLastCalledWith({
        phoneNumber: mockDecodedToken.phone_number,
      });
      expect(encryptionsService.signJwt).toHaveBeenLastCalledWith({
        sub: mockCreateUserData.id,
        id: mockCreateUserData.id,
        role: mockCreateUserData.role,
      });
    });

    it('Should throw an error if token from firebase does not contain phone_number', async () => {
      const signInByPhoneNumberDto: SignInByPhoneNumberDto = {
        token: 'abcd',
      };
      const mockDecodedToken: DecodedIdToken = {
        aud: 'abc',
        auth_time: 1,
        exp: 1,
        firebase: {
          identities: { test: 1 },
          sign_in_provider: 'abc',
        },
        iat: 1,
        iss: '1',
        sub: '1',
        uid: '1',
      };

      jest
        .spyOn(firebaseService, 'decodeToken')
        .mockResolvedValue(mockDecodedToken);

      const result = service.signInByPhoneNumber(signInByPhoneNumberDto);

      await expect(result).rejects.toThrow('Token is invalid!');
      expect(firebaseService.decodeToken).toHaveBeenCalledWith(
        signInByPhoneNumberDto.token,
      );
    });

    it('Should throw an error when user has been banned', async () => {
      const signInByPhoneNumberDto: SignInByPhoneNumberDto = {
        token: 'abcd',
      };
      const mockDecodedToken: DecodedIdToken = {
        aud: 'abc',
        auth_time: 1,
        exp: 1,
        firebase: {
          identities: { test: 1 },
          sign_in_provider: 'abc',
        },
        iat: 1,
        iss: '1',
        sub: '1',
        uid: '1',
        phone_number: '+84971016191',
      };
      const mockFindOneUserData = createMock<User>({
        id: '12345',
        role: ERole.member,
        status: EUserStatus.banned,
      });

      jest
        .spyOn(firebaseService, 'decodeToken')
        .mockResolvedValue(mockDecodedToken);
      jest
        .spyOn(authUsersService, 'findOne')
        .mockResolvedValue(mockFindOneUserData);

      const result = service.signInByPhoneNumber(signInByPhoneNumberDto);

      await expect(result).rejects.toThrow('You have been banned!');
      expect(firebaseService.decodeToken).toHaveBeenCalledWith(
        signInByPhoneNumberDto.token,
      );
      expect(authUsersService.findOne).toHaveBeenLastCalledWith(
        { phoneNumber: mockDecodedToken.phone_number },
        {
          selects: ['status', 'role'],
        },
      );
    });

    it('Should throw an error when user have not role', async () => {
      const signInByPhoneNumberDto: SignInByPhoneNumberDto = {
        token: 'abcd',
      };
      const mockDecodedToken: DecodedIdToken = {
        aud: 'abc',
        auth_time: 1,
        exp: 1,
        firebase: {
          identities: { test: 1 },
          sign_in_provider: 'abc',
        },
        iat: 1,
        iss: '1',
        sub: '1',
        uid: '1',
        phone_number: '+84971016191',
      };
      const mockFindOneUserData = {
        id: '12345',
      };

      jest
        .spyOn(firebaseService, 'decodeToken')
        .mockResolvedValue(mockDecodedToken);
      jest
        .spyOn(authUsersService, 'findOne')
        .mockResolvedValue(mockFindOneUserData);

      const result = service.signInByPhoneNumber(signInByPhoneNumberDto);

      await expect(result).rejects.toThrow('User is not correct!');
      expect(firebaseService.decodeToken).toHaveBeenCalledWith(
        signInByPhoneNumberDto.token,
      );
      expect(authUsersService.findOne).toHaveBeenLastCalledWith(
        { phoneNumber: mockDecodedToken.phone_number },
        {
          selects: ['status', 'role'],
        },
      );
    });
  });
});
