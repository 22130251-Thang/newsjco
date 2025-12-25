export class UpdateProfileDto {
  displayName?: string;
  bio?:  string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  phone?: string;
  address?: string;
}