import { PipeTransform, Pipe, ArgumentMetadata } from '@nestjs/common';

@Pipe()
export class TransformToPipe<T> implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) :T {
    return value as T;
  }
}
