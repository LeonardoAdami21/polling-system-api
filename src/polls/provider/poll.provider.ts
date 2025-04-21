import { PrismaClient } from '@prisma/client';
import { DATA_SOURCE } from '../../config/data.source';
import { IProvider } from '../../interface/IProvider';

export const POLL__REPOSITORY = 'POLL__REPOSITORY';

export const pollsProvider: IProvider<PrismaClient['poll']>[] = [
  {
    provide: POLL__REPOSITORY,
    useFactory: (prisma: PrismaClient) => prisma.poll,
    inject: [DATA_SOURCE],
  },
];
