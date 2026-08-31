export type UserPublic = {
  id: number;
  username: string;
  image_file: string | null;
  image_path: string;
};

export type UserPrivate = UserPublic & {
  email: string;
};

export type UserUpdateData = {
  username?: string;
  email?: string;
};
