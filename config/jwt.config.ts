// import { ConfigService } from 'nestjs-config';
import 'dotenv/config';

export default {
  secret: process.env.JWT_SECRET || 'secret',
  expires: process.env.JWT_EXPIRES || '30m'
};
