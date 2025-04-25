import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Accordion, AccordionDetails, AccordionSummary, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";

const drawerWidth = 240;

const Array1 = [
  {
      text: "Users",
      icon: <GroupOutlinedIcon />,
      subItems: [
          { text: "Add User", path: 'users/add' },
          { text: "Get All Users", path: 'users' },
      ],
  },
  {
      text: "Students",
      icon: <SchoolOutlinedIcon />,
      subItems: [
          { text: "Add Student", path: 'students/add' },
          { text: "Get All Students", path: 'students' },
      ],
  },
  {
      text: "Teachers",
      icon: <PersonOutlineIcon />,
      subItems: [
          { text: "Add Teacher", path: 'teachers/add' },
          { text: "Get All Teachers", path: 'teachers' },
      ],
  },
  {
      text: "Parents",
      icon: <FamilyRestroomOutlinedIcon />,
      subItems: [
          { text: "Add Parent", path: 'parents/add' },
          { text: "Get All Parents", path: 'parents' },
      ],
  },
];

const Array2 = [
  {
      text: "Class",
      icon: <ClassOutlinedIcon />,
      subItems: [
          { text: "Add Class", path: 'class/add' },
          { text: "Get All Classes", path: 'class' },
      ],
  },
  {
      text: "Subjects",
      icon: <SubjectOutlinedIcon />,
      subItems: [
          { text: "Add Subject", path: 'subjects/add' },
          { text: "Get All Subjects", path: 'subjects' },
      ],
  },
  {
      text: "Schedules",
      icon: <ScheduleOutlinedIcon />,
      subItems: [
          { text: "Add Schedule", path: 'schedules/add' },
          { text: "Get All Schedules", path: 'schedules' },
      ],
  },
  {
      text: "Reports",
      icon: <AssessmentOutlinedIcon />,
      subItems: [
          { text: "Add Report", path: 'reports/add' },
          { text: "Get All Reports", path: 'reports' },
      ],
  },
];

const Array3 = [
  {
      text: "Attendance",
      icon: <EventAvailableOutlinedIcon />,
      path: 'attendance',
  },
  {
      text: "Logout",
      icon: <LogoutOutlinedIcon />,
      action: async (navigate) => {
        try {
          // Retrieve the token from localStorage
          const userToken = localStorage.getItem("userToken");
          if (!userToken) {
            throw new Error("User is not authenticated.");
          }
  
          // Make the logout API request
          await axios.post(
            API_LOGOUT_URL,
            {},
            {
              headers: { token: userToken },

            }
          );
  
          // Clear the token from localStorage
          localStorage.removeItem("userToken");
  
          // Redirect to login page
          navigate("/login");
        } catch (err) {
          console.error("Logout failed:", err.message);
          navigate("/login"); // Redirect to login even if logout fails
        }
      },
  },
];

const API_PROFILE_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/mana/mana/profiledata";
const API_LOGOUT_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/mana/logout";

function Sidebar(props) {
  const { window, children } = props; // Add children prop to receive Outlet content
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const navigate = useNavigate();

  // State for profile data
  const [profileData, setProfileData] = React.useState({
    name: "",
    role: "",
    avatar: "",
  });

  React.useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Retrieve the token from localStorage
        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
          throw new Error("User is not authenticated. Please log in.");
        }

        // Fetch profile data from the API
        const response = await axios.get(API_PROFILE_URL, {
          headers: { token: userToken },
        });
        console.log(response.data.data.name);
        console.log(response.data);
        
        // Update the profile data state
        setProfileData({
          name: response.data.data.name || "Unknown",
          role: response.data.data.role || "Unknown",
          avatar: response.data.data.profilePic || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile data:", err.message);
      }
    };

    fetchProfileData();
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Avatar sx={{ mx: "auto" }} alt={profileData.name} src={profileData.avatar} />
      <Typography align="center" variant='body1'>{profileData.name}</Typography>
      <Typography align="center" variant='body1'>{profileData.role}</Typography>
      <Divider />
      <List>
        {Array1.map((item) => (
          <Accordion key={item.text} sx={{ boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <List>
                {item.subItems.map((subItem) => (
                  <ListItem key={subItem.text} disablePadding>
                    <Link className='flex w-full' to={subItem.path}>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </List>
      <Divider />
      <List>
        {Array2.map((item) => (
          <Accordion key={item.text} sx={{ boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <List>
                {item.subItems.map((subItem) => (
                  <ListItem key={subItem.text} disablePadding>
                    <Link className='flex w-full' to={subItem.path}>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </List>
      <Divider />
      <List>
        {Array3.map((item) =>
          item.text === "Logout" ? (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => item.action(navigate)} // Trigger logout action
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem key={item.text} disablePadding>
              <Link className='flex w-full' to={item.path}>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            </ListItem>
          )
        )}
      </List>
    </div>
  );


  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
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
            Responsive Drawer
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          slotProps={{
            root: {
              keepMounted: true,
            },
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

      {/* Replace the static Box with children (Outlet) */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children} {/* Render the Outlet content here */}
      </Box>
    </Box>
  );
}

Sidebar.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node, // Add prop type for children
};

export default Sidebar;