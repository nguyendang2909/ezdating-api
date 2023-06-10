import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { SignInData } from '../auth.type';
import { SignInWithPhoneNumberDto } from '../dto/sign-in-with-phone-number.dto';
import { SignInWithPhoneNumberAndPasswordDto } from '../dto/sign-in-with-phone-number-and-password.dto';
import { FirebaseService } from '../firebase.service';
import { SignInController } from './sign-in.controller';
import { SignInService } from './sign-in.service';

describe('SignInController', () => {
  let controller: SignInController;
  let service: SignInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignInController],
      providers: [
        {
          provide: SignInService,
          useValue: createMock(),
        },
        {
          provide: FirebaseService,
          useValue: createMock(),
        },
      ],
    }).compile();

    controller = module.get<SignInController>(SignInController);
    service = module.get<SignInService>(SignInService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#signInByPhoneNumber', () => {
    it('Should sign in by phone number successfully', async () => {
      const signInByPhoneNumberDto = createMock<SignInWithPhoneNumberDto>({
        token: 'abxyz',
      });
      const mockSignInData = createMock<SignInData>({
        accessToken: 'abcxyz',
      });

      jest
        .spyOn(service, 'signInWithPhoneNumber')
        .mockResolvedValue(mockSignInData);

      const result = controller['signInWithPhoneNumber'](
        signInByPhoneNumberDto,
      );

      await expect(result).resolves.toEqual({
        type: 'sigInWithPhoneNumber',
        data: mockSignInData,
      });
      expect(service.signInWithPhoneNumber).toHaveBeenCalledWith(
        signInByPhoneNumberDto,
      );
    });
  });

  describe('#signInWithPhoneNumberAndPassword', () => {
    it('Should sign in by phone number with password successfully', async () => {
      const signInWithPhoneNumberAndPasswordDto =
        createMock<SignInWithPhoneNumberAndPasswordDto>({
          phoneNumber: '+84989898',
          password: 'abcxyzs',
        });
      const mockSignInData = createMock<SignInData>({
        accessToken: 'abcxyz',
      });

      jest
        .spyOn(service, 'signInWithPhoneNumberAndPassword')
        .mockResolvedValue(mockSignInData);

      const result = controller['signInWithPhoneNumberAndPassword'](
        signInWithPhoneNumberAndPasswordDto,
      );

      await expect(result).resolves.toEqual({
        type: 'signInWithPhoneNumberAndPassword',
        data: mockSignInData,
      });
      expect(service.signInWithPhoneNumberAndPassword).toHaveBeenCalledWith(
        signInWithPhoneNumberAndPasswordDto,
      );
    });
  });
});
