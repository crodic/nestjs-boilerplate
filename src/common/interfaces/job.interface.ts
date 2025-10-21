export interface IEmailJob {
  email: string;
}

export interface IVerifyEmailJob extends IEmailJob {
  token: string;
}

export type IForgotPasswordEmailJob = IVerifyEmailJob;
