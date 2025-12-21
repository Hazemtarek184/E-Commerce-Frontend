import React from 'react';
import { Box } from '@mui/material';
import type { IServiceProvider } from '../../interfaces';
import ServiceProviderCard from './ServiceProviderCard';

interface ServiceProviderListProps {
    providers: IServiceProvider[];
    onEdit: (provider: IServiceProvider) => void;
    onDelete: (providerId: string) => void;
    getInitials: (name: string) => string;
    getRatingColor: (rating: number) => string;
}

const ServiceProviderList: React.FC<ServiceProviderListProps> = ({
    providers,
    onEdit,
    onDelete,
    getInitials,
    getRatingColor
}) => (
    <Box
        display="grid"
        gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)'
        }}
        gap={3}
    >
        {providers.map((provider, index) => (
            <ServiceProviderCard
                key={provider._id}
                provider={provider}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                getInitials={getInitials}
                getRatingColor={getRatingColor}
            />
        ))}
    </Box>
);

export default ServiceProviderList; 