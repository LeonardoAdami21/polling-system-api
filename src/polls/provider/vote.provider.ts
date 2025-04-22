import { PrismaClient } from '@prisma/client';
import { DATA_SOURCE } from '../../config/data.source';
import { IProvider } from '../../interface/IProvider';

export const VOTE__REPOSITORY = 'VOTE__REPOSITORY';

export const votesProvider: IProvider<PrismaClient['vote']>[] = [
  {
    provide: VOTE__REPOSITORY,
    useFactory: (prisma: PrismaClient) => prisma.vote,
    inject: [DATA_SOURCE],
  },
];
