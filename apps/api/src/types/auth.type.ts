export type OnlyEmailBody = {
  email: string;
};

export type VerificationBody = {
  password: string;
  token: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type OAuthBody = {
  email: string;
  image?: string;
  provider: string;
};
