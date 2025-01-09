import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customInvoice', async: false })
export class CustomInvoiceValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // Check if total amount matches sum of items
    return (
      value.amount ===
      value.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
      )
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invoice total amount must match the sum of all items (price * quantity)';
  }
}
