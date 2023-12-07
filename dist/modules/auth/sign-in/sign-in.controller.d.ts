import { SignInFacebookService } from './sign-in-facebook.service';
import { SignInGoogleService } from './sign-in-google.service';
import { SignInPhoneNumberService } from './sign-in-phone-number.service';
import { SignInPhoneNumberWithPasswordService } from './sign-in-phone-number-with-password.service';
export declare class SignInController {
    private readonly signInPhoneNumberService;
    private readonly signInFacebookService;
    private readonly signInGoogleService;
    private readonly signInPhoneNumberWithPasswordService;
    constructor(signInPhoneNumberService: SignInPhoneNumberService, signInFacebookService: SignInFacebookService, signInGoogleService: SignInGoogleService, signInPhoneNumberWithPasswordService: SignInPhoneNumberWithPasswordService);
    private signInWithPhoneNumber;
    private signInWithGoogle;
    private signInWithFacebook;
    private signInWithPhoneNumberAndPassword;
}
