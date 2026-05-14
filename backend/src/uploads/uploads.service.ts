import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  buildUrl(filename: string) {
    const base = (process.env.PUBLIC_UPLOAD_URL || 'http://localhost:3000/uploads').replace(/\/$/, '');
    return `${base}/${filename}`;
  }
}
