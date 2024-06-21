export type UpdateProfileBody = {
  username?: string;
  email?: string;
  password?: string;
  image?: string;
  isVerify?: string;
};

export type PhotoBody = {
  token: string;
  data: any;
};

export type UpdateProfile = {
  token: string;
  data: UpdateProfileBody;
};
