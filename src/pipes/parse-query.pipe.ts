import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import qs from 'qs';

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Parse deep query như filter[title]
    if (metadata.type === 'query') {
      return qs.parse(value);
    }
    return value;
  }
}
