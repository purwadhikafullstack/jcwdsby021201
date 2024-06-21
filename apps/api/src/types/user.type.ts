export type CredentialBody = {
  username: string;
  password: string;
};

export type UpdateEmailBody = {
  email: string;
};

export type ActivationBody = {
    token: string;
}