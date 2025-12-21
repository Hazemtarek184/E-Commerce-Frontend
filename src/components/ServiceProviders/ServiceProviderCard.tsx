import React from 'react';
import { Card, CardContent, Box, Badge, Avatar, Typography, Tooltip, IconButton, Fade, Chip, Stack, alpha } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { IServiceProvider } from '../../interfaces';

interface ServiceProviderCardProps {
    provider: IServiceProvider;
    index: number;
    onEdit: (provider: IServiceProvider) => void;
    onDelete: (providerId: string) => void;
    getInitials: (name: string) => string;
    getRatingColor: (rating: number) => string;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
    provider,
    index,
    onEdit,
    onDelete,
    getInitials,
    getRatingColor
}) => (
    <Fade in={true} timeout={300 + index * 100}>
        <Card
            elevation={2}
            sx={{
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    '& .provider-actions': {
                        opacity: 1,
                        transform: 'translateY(0)',
                    }
                }
            }}
        >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Provider Header */}
                <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            provider.isVerified ? (
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        backgroundColor: '#4caf50',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid white'
                                    }}
                                >
                                    <Typography sx={{ fontSize: 10, color: 'white' }}>✓</Typography>
                                </Box>
                            ) : null
                        }
                    >
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: 'primary.main',
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {getInitials(provider.name || '')}
                        </Avatar>
                    </Badge>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="h6" fontWeight="700" noWrap>
                                {provider.name || 'Unnamed Provider'}
                            </Typography>
                            {provider.isVerified && (
                                <Tooltip title="Verified Provider">
                                    <Box sx={{ color: '#4caf50', display: 'flex' }}>
                                        <StarIcon fontSize="small" />
                                    </Box>
                                </Tooltip>
                            )}
                        </Box>
                        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <StarIcon sx={{ fontSize: 16, color: getRatingColor(provider.rating || 0) }} />
                                <Typography variant="body2" fontWeight="600" color={getRatingColor(provider.rating || 0)}>
                                    {provider.rating?.toFixed(1) || 'N/A'}
                                </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                {provider.completedJobs || 0} jobs completed
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Bio */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 3,
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {provider.bio || 'No bio provided'}
                </Typography>

                {/* Provider Details */}
                <Stack spacing={2} sx={{ flex: 1 }}>
                    {/* Response Time */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <AccessTimeIcon fontSize="small" sx={{ color: '#2196f3' }} />
                        <Typography variant="body2" fontWeight="500">
                            Responds {provider.responseTime || 'N/A'}
                        </Typography>
                    </Box>

                    {/* Working Days */}
                    {provider.workingDays && provider.workingDays.length > 0 && (
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <ScheduleIcon fontSize="small" color="action" />
                                <Typography variant="body2" fontWeight="500">
                                    Available Days
                                </Typography>
                            </Box>
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                                {provider.workingDays.slice(0, 3).map((day: string) => (
                                    <Chip
                                        key={day}
                                        label={day.slice(0, 3)}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem', height: 20 }}
                                    />
                                ))}
                                {provider.workingDays.length > 3 && (
                                    <Chip
                                        label={`+${provider.workingDays.length - 3}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem', height: 20 }}
                                    />
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* Phone Contacts */}
                    {provider.phoneContacts && provider.phoneContacts.length > 0 && (
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <PhoneIcon fontSize="small" color="action" />
                                <Typography variant="body2" fontWeight="500">
                                    Contact
                                </Typography>
                            </Box>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {provider.phoneContacts.slice(0, 2).map((contact: any, idx: number) => (
                                    <Chip
                                        key={idx}
                                        label={contact.phoneNumber}
                                        size="small"
                                        icon={contact.hasWhatsApp ? <WhatsAppIcon sx={{ fontSize: 14 }} /> : <PhoneIcon sx={{ fontSize: 14 }} />}
                                        sx={{
                                            fontSize: '0.7rem',
                                            backgroundColor: contact.hasWhatsApp ? alpha('#25d366', 0.1) : alpha('#2196f3', 0.1),
                                            color: contact.hasWhatsApp ? '#25d366' : '#2196f3',
                                            '& .MuiChip-icon': {
                                                color: 'inherit'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Locations */}
                    {provider.locationLinks && provider.locationLinks.length > 0 && (
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <LocationOnIcon fontSize="small" color="action" />
                                <Typography variant="body2" fontWeight="500">
                                    Service Areas
                                </Typography>
                            </Box>
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                                {provider.locationLinks.map((location: string, idx: number) => (
                                    <Chip
                                        key={idx}
                                        label={location}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem', height: 20 }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Stack>

                {/* Floating Action Buttons */}
                <Box
                    className="provider-actions"
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                        opacity: 0,
                        transform: 'translateY(-10px)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Tooltip title="Edit Provider">
                        <IconButton
                            size="small"
                            sx={{
                                backgroundColor: 'white',
                                boxShadow: 2,
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white'
                                }
                            }}
                            onClick={() => onEdit(provider)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Provider">
                        <IconButton
                            size="small"
                            sx={{
                                backgroundColor: 'white',
                                boxShadow: 2,
                                '&:hover': {
                                    backgroundColor: 'error.light',
                                    color: 'white'
                                }
                            }}
                            onClick={() => onDelete(provider._id || '')}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    </Fade>
);

export default ServiceProviderCard; 