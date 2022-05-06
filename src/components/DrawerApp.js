import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CustomersPage from './CustomersPage';
import TrainingsPage from './TrainingsPage';
import CalendarPage from './CalendarPage';
import StatsPage from './StatsPage';

const darkTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const drawerWidth = 240;

const menuItems = [
    {
        text: "Customers",
        icon: PeopleIcon,
    },
    {
        text: "Trainings",
        icon: SportsGymnasticsIcon,
    },
    {
        text: "Calendar",
        icon: CalendarMonthIcon,
    },
    {
        text: "Stats",
        icon: BarChartIcon,
    },
];

function DrawerApp() {

    const [menuItemSelected, setMenuItemSelected] = useState(menuItems[0].text);

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        zIndex: theme => theme.zIndex.drawer + 1,
                        //backgroundColor: theme => `info.${theme.palette.mode}`
                    }}
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="h1"
                        >
                            Personal Trainer
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            {menuItems.map((menuItem, index) => {
                                return (
                                    <ListItem
                                        disablePadding
                                        key={index}
                                        onClick={() => setMenuItemSelected(menuItem.text)}
                                    >
                                        <ListItemButton selected={menuItem.text === menuItemSelected}>
                                            <ListItemIcon>
                                                <menuItem.icon />
                                            </ListItemIcon>
                                            <ListItemText primary={menuItem.text} />
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>
                </Drawer>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3 }}
                >
                    <Toolbar />
                    {menuItemSelected === "Customers" && <CustomersPage/>}
                    {menuItemSelected === "Trainings" && <TrainingsPage/>}
                    {menuItemSelected === "Calendar" && <CalendarPage/>}
                    {menuItemSelected === "Stats" && <StatsPage/>}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default DrawerApp;
