export class CreateUserDto {
  name: string;
  email: string;
  theme?: 'light' | 'dark';
}
