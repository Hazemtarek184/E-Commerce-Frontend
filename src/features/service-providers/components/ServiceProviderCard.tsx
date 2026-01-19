import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  IconButton,
  Chip,
  Stack,
  alpha,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedIcon from "@mui/icons-material/Verified";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import type { IServiceProvider } from "../../../interfaces";

interface ServiceProviderCardProps {
  provider: IServiceProvider;
  onEdit: (provider: IServiceProvider) => void;
  onDelete: (providerId: string) => void;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  provider,
  onEdit,
  onDelete,
}) => {
  const hasImages = provider.imagesUrl && provider.imagesUrl.length > 0;

  return (
    <Card
      sx={{
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
          "& .action-buttons": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Image Section */}
      {hasImages && (
        <Box
          sx={{
            position: "relative",
            height: 160,
            overflow: "hidden",
          }}
        >
          <img
            src={provider.imagesUrl![0].url}
            alt={provider.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {provider.isVerified && (
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
              label="Verified"
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                bgcolor: "white",
                color: "success.main",
                fontWeight: 500,
                "& .MuiChip-icon": { color: "success.main" },
              }}
            />
          )}
          {/* Action buttons on image */}
          <Box
            className="action-buttons"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              gap: 0.5,
              opacity: 0,
              transition: "opacity 0.2s",
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(provider);
              }}
              sx={{
                bgcolor: "white",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(provider._id || "");
              }}
              sx={{
                bgcolor: "white",
                "&:hover": { bgcolor: "error.main", color: "white" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}

      <CardContent sx={{ p: 2.5 }}>
        {/* Header without image */}
        {!hasImages && (
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "primary.main",
                fontSize: "1rem",
              }}
            >
              {getInitials(provider.name || "")}
            </Avatar>
            <Box
              className="action-buttons"
              sx={{
                display: "flex",
                gap: 0.5,
                opacity: 0,
                transition: "opacity 0.2s",
              }}
            >
              <IconButton
                size="small"
                onClick={() => onEdit(provider)}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "primary.main", color: "white" },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(provider._id || "")}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "error.main", color: "white" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Name and Rating */}
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Typography variant="subtitle1" fontWeight="600" noWrap sx={{ flex: 1 }}>
            {provider.name || "Unnamed Provider"}
          </Typography>
          {provider.isVerified && !hasImages && (
            <VerifiedIcon sx={{ fontSize: 18, color: "success.main" }} />
          )}
        </Box>

        {provider.rating !== undefined && (
          <Box display="flex" alignItems="center" gap={0.5} mb={1.5}>
            <StarIcon sx={{ fontSize: 16, color: "warning.main" }} />
            <Typography variant="body2" fontWeight="500">
              {provider.rating.toFixed(1)}
            </Typography>
            {provider.completedJobs !== undefined && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                ({provider.completedJobs} jobs)
              </Typography>
            )}
          </Box>
        )}

        {/* Bio */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
          }}
        >
          {provider.bio || "No description available"}
        </Typography>

        {/* Details */}
        <Stack spacing={1.5}>
          {/* Working Days */}
          {provider.workingDays && provider.workingDays.length > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
              <ScheduleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Box display="flex" gap={0.5} flexWrap="wrap">
                {provider.workingDays.slice(0, 4).map((day: string) => (
                  <Chip
                    key={day}
                    label={day.slice(0, 3)}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                      bgcolor: alpha("#6366f1", 0.1),
                      color: "primary.main",
                    }}
                  />
                ))}
                {provider.workingDays.length > 4 && (
                  <Chip
                    label={`+${provider.workingDays.length - 4}`}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                    }}
                  />
                )}
              </Box>
            </Box>
          )}

          {/* Contact */}
          {provider.phoneContacts && provider.phoneContacts.length > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
              {provider.phoneContacts[0].hasWhatsApp ? (
                <WhatsAppIcon sx={{ fontSize: 16, color: "#25d366" }} />
              ) : (
                <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              )}
              <Typography variant="body2" color="text.secondary">
                {provider.phoneContacts[0].phoneNumber}
              </Typography>
            </Box>
          )}

          {/* Location */}
          {provider.locationLinks && provider.locationLinks.length > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {provider.locationLinks[0]}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
