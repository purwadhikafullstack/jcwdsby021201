export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  username: string | null;
  email: string;
  isVerified: boolean;
  role: string;
  image: string | null;
  token: string;
};

export type OAuthBody = {
  email: string;
  image: string | null;
  provider: string;
};
