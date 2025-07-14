import { useEffect, useState } from "react";
import "./styles.css";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";


import LoginCom from "./LoginCom";
import Registration from "./Registration";
import { useNavigate } from 'react-router-dom';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      // hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Login = () => {

  const navigate = useNavigate();

   useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
   
    if (userInfo) {
      navigate("/chat");
    }
  }, []);
  
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  
 
  return (
    <div className="login ">
      
        {/* <video autoPlay muted loop playsInline>
          <source src="../../public/sky1.mp4" type="video/mp4" />
        </video> */}
      
      <div className="p-5 max-w-2xl m-auto rounded-xl content">
        <p className="text-3xl bg-white px-10 py-3 font-medium rounded-xl">
          WellCome To the World of Connection
        </p>
        <div className="mt-5">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                centered
              >
                <Tab label="Login" {...a11yProps(0)} />
                <Tab label="Sign Up" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <LoginCom></LoginCom>
              
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Registration></Registration>
            </CustomTabPanel>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Login;
