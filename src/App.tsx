import { useState } from 'react';
import { AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import Categories from './components/Categories';
import SubCategories from './components/SubCategories';
import { ServiceProvidersPage } from './features/service-providers/pages/ServiceProvidersPage';

const drawerWidth = 240;

const sections = [
  { label: 'Categories', icon: <CategoryIcon /> },
  { label: 'Sub-categories', icon: <SubtitlesIcon /> },
  { label: 'Service Providers', icon: <PeopleIcon /> },
];

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {sections.map((section, index) => (
          <ListItem key={section.label} disablePadding>
            <ListItemButton
              selected={selectedSection === index}
              onClick={() => {
                setSelectedSection(index);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{section.icon}</ListItemIcon>
              <ListItemText primary={section.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />

        <Box>
          {selectedSection === 0 && (
            <Categories
              onSelectCategory={id => {
                setSelectedCategoryId(id);
                setSelectedSection(1);
                setSelectedSubCategoryId(null);
              }}
            />
          )}
          {selectedSection === 1 && (
            <SubCategories
              mainCategoryId={selectedCategoryId || ''}
              onSelectSubCategory={id => {
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
    </Box>
  );
}

export default App;