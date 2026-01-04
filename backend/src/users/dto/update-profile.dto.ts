export class UpdateProfileDto {
  displayName?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  phone?: string;
  address?: string;
}
