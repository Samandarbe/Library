import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (
  ConfigService: ConfigService,
): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoUri(ConfigService),
    ...getMongoOptions(),
  };
};

const getMongoUri = (ConfigService: ConfigService) =>
  ConfigService.get('DB_URL');

const getMongoOptions = () => ({
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
});
