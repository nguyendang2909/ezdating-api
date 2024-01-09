import { IsString, Length } from 'class-validator';

export class FindAllStatesByCountryIso2Query {
  @IsString()
  @Length(2)
  countryIso2: string;
}
