// Main Category
export interface IMainCategory {
    _id?: string;
    englishName: string;
    arabicName: string;
    subCategories?: string[]; // ObjectId as string
}

// Sub Category
export interface ISubCategory {
    _id?: string;
    englishName: string;
    arabicName: string;
    serviceProvider?: string[]; // ObjectId as string
}

// Service Provider
export interface IServiceProvider {
    _id?: string;
    name: string;
    bio: string;
    imagesUrl?: string[];
    workingDays: string[];
    workingHours?: string[];
    closingHours?: string[];
    phoneContacts: IPhoneContact[];
    locationLinks: string[];
    offers?: IOffer[];
    rating?: number;
    completedJobs?: number;
    responseTime?: string;
    isVerified?: boolean;
}

export interface IOffer {
    name: string;
    description: string;
    imageUrl: string[];
}

export interface IPhoneContact {
    phoneNumber: string;
    hasWhatsApp: boolean;
    canCall?: boolean;
}

// Generic API Response
export interface IApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
} 