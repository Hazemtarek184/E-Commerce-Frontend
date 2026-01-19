import { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Categories from './components/Categories';
import SubCategories from './components/SubCategories';
import { ServiceProvidersPage } from './features/service-providers/pages/ServiceProvidersPage';

const drawerWidth = 260;

const navItems = [
  { label: 'Categories', icon: <CategoryIcon />, id: 0 },
  { label: 'Sub-categories', icon: <SubtitlesIcon />, id: 1 },
  { label: 'Service Providers', icon: <PeopleIcon />, id: 2 },
];

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (index: number) => {
    setSelectedSection(index);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo / Brand */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
          }}
        >
          <DashboardIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="700" color="text.primary">
            Dashboard
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Admin Panel
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2, px: 1.5 }}>
        <Typography
          variant="overline"
          sx={{ px: 2, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 600 }}
        >
          Navigation
        </Typography>
        <List disablePadding>
          {navItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={selectedSection === item.id}
                onClick={() => handleNavClick(item.id)}
                sx={{
                  py: 1.5,
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: selectedSection === item.id ? 'white' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          {mobileOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      )}

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          pt: { xs: 8, md: 0 },
        }}
      >
        {selectedSection === 0 && (
          <Categories
            onSelectCategory={(id) => {
              setSelectedCategoryId(id);
              setSelectedSection(1);
              setSelectedSubCategoryId(null);
            }}
          />
        )}
        {selectedSection === 1 && (
          <SubCategories
            mainCategoryId={selectedCategoryId || ''}
            onSelectSubCategory={(id) => {
              setSelectedSubCategoryId(id);
              setSelectedSection(2);
            }}
            onBack={() => setSelectedSection(0)}
          />
        )}
        {selectedSection === 2 && (
          <ServiceProvidersPage
            subCategoryId={selectedSubCategoryId || ''}
            mainCategoryId={selectedCategoryId || undefined}
            onBack={() => setSelectedSection(1)}
          />
        )}
      </Box>
    </Box>
  );
}

export default App;
