import { Box, Fade } from "@mui/material";
import { ServiceProviderCard } from "./ServiceProviderCard";
import type { IServiceProvider } from "../../../interfaces";

interface ServiceProviderListProps {
  providers: IServiceProvider[];
  onEdit: (provider: IServiceProvider) => void;
  onDelete: (providerId: string) => void;
}

export const ServiceProviderList: React.FC<ServiceProviderListProps> = ({
  providers,
  onEdit,
  onDelete,
}) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
      }}
      gap={3}
    >
      {providers.map((provider, index) => (
        <Fade in={true} timeout={300 + index * 100} key={provider._id}>
          <Box>
            <ServiceProviderCard
              provider={provider}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Box>
        </Fade>
      ))}
    </Box>
  );
};
