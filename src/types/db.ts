// --- ENUMS ---
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "EDITOR" | "SEO_MANAGER" | "ANALYST" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED" | "PENDING_VERIFICATION";
export type ReportStatus = "PENDING" | "IN_REVIEW" | "RESOLVED" | "DISMISSED";
export type ReportCategory = "ABUSE" | "SPAM" | "NSFW" | "COPYRIGHT" | "BROKEN_LINK" | "HARASSMENT" | "OTHER";
export type ReportTargetType = "USER" | "COMMENT" | "ANIME" | "EPISODE" | "EPISODE_SOURCE" | "OTHER";
export type ProviderType = 'NETWORK' | 'DIRECT' | 'HOUSE';
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ENDED';
export type BudgetType = 'UNLIMITED' | 'CAPPED';


// --- MODELS ---

export type NotificationType = "COMMENT_REPLY" | "COMMENT_LIKE" | "PROFILE_VISIT" | "NEW_EPISODE" | "SYSTEM";

export type Notification = {
    id: string;
    recipientId: string;
    senderId?: string | null;
    senderName?: string | null;
    senderAvatar?: string | null;
    type: NotificationType;
    title: string;
    content: string;
    link?: string | null;
    isRead: boolean;
    createdAt: Date;
}

export type User = {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string | null;
    role: UserRole;
    status: UserStatus;
    lastLoginAt: Date | null;
    createdAt: Date;
}

export type Report = {
    id: string;
    reporterId: string | null;
    targetType: ReportTargetType;
    targetId: string;
    category: ReportCategory;
    reasonText: string;
    status: ReportStatus;
    createdAt: Date;
    updatedAt: Date;
    handledByUserId: string | null;
    resolutionAction: string | null;
    resolutionNote: string | null;
    resolvedAt: Date | null;
};

export type Comment = {
    id: string;
    userId: string;
    content: string;
    isHidden: boolean;
    createdAt: Date;
}

export type UserBan = {
    id: string;
    userId: string;
    bannedByUserId: string;
    reasonCategory: ReportCategory;
    reasonText: string;
    endsAt: Date | null; // null for permanent
    createdAt: Date;
}

export type ModerationAction = {
    id: string;
    moderatorId: string;
    targetType: ReportTargetType;
    targetId: string;
    actionType: string;
    reason: string;
    createdAt: Date;
}

export type AdProvider = {
    id: string;
    name: string;
    type: ProviderType;
    isActive: boolean;
    config: any; // JSON
    createdAt: Date;
    updatedAt: Date;
};

export type AdPlacement = {
    id: string;
    name: string;
    description: string | null;
    slotKey: string;
    deviceTarget: 'DESKTOP' | 'MOBILE' | 'BOTH';
    maxAds: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type AdRule = {
    id: string;
    // ... we can fill this out if needed
};

export type AdCampaign = {
    id: string;
    name: string;
    providerId: string;
    status: CampaignStatus;
    priority: number;
    startDate: Date | null;
    endDate: Date | null;
    budgetType: BudgetType;
    budgetTotal: number | null;
    budgetUsed: number;
    frequencyCapPerUserPerDay: number | null;
    isHouse: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type NavLink = {
  id: number;
  text: string;
  url: string;
  icon: string | null;
  order: number;
  location: 'HEADER' | 'FOOTER_SOCIAL';
};

export type SiteConfig = {
    id: number;
    siteName: string;
    tagline: string | null;
    logoUrl: string | null;
    faviconUrl: string | null;
    primaryColor: string;
    backgroundColor: string;
    accentColor: string;
    announcementEnabled: boolean;
    announcementMessage: string | null;
};

export type ServiceStatus = 'Operational' | 'Degraded' | 'Down';

export type SystemService = {
    id: string;
    name: string;
    status: ServiceStatus;
    url?: string;
    lastChecked: Date;
};

export type JobStatus = 'Running' | 'Paused' | 'Idle' | 'Failed';

export type BackgroundJob = {
    id: string;
    name: string;
    status: JobStatus;
    schedule: string;
    lastRun: Date | null;
    nextRun: Date | null;
};

export type FeatureFlag = {
    key: string;
    description: string;
    enabled: boolean;
};

export type SystemConfig = {
    id: string;
    maintenanceMode: {
        enabled: boolean;
        message: string;
    };
    featureFlags: FeatureFlag[];
    services: SystemService[];
    jobs: BackgroundJob[];
    updatedAt: Date;
    updatedBy: string | null;
};
