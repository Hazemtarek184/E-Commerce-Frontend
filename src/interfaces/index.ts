// Main Category
export interface IMainCategory {
    _id?: string;
    englishName: string;
    arabicName: string;
    subCategories?: string[]; // ObjectId as string
    subCategoryCount?: number; // Alternative: count field from API
}

// Sub Category
export interface ISubCategory {
    _id?: string;
    englishName: string;
    arabicName: string;
    serviceProvider?: string[]; // ObjectId as string
    serviceProviderCount?: number; // Alternative: count field from API
}

export interface IImageUrl {
    url: string;
    public_id: string;
    _id: string;
}

// Service Provider
export interface IServiceProvider {
    _id?: string;
    name: string;
    bio: string;
    imagesUrl?: IImageUrl[];
    workingDays: string[];
    workingHour?: string;
    closingHour?: string;
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