import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DiaryStatus } from '../entity/diaryStatus';

@ValidatorConstraint({ name: 'diaryStatusValidator', async: false })
export class DiaryStatusValidator implements ValidatorConstraintInterface {
  validate(status: any, args: ValidationArguments) {
    return Object.values(DiaryStatus).includes(status);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid diary status';
  }
}
