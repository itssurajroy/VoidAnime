import type { Report, User } from '@/types/db';

export type ReportWithReporter = Report & {
    reporter: Pick<User, 'id' | 'name' | 'avatarUrl'> | null;
};
