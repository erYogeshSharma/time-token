import React, { useEffect, useState } from "react";
import "./App.css";
import { useColorScheme } from "@mui/joy/styles";
import {
  Box,
  LinearProgress,
  Stack,
  Typography,
  CssVarsProvider,
  Sheet,
  Grid,
  CircularProgress,
} from "@mui/joy";
import moment from "moment";

const ChangeMode = () => {
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    setMode("dark");
  }, []);
  return <></>;
};
function App() {
  const [time, setTime] = useState("");
  function get_time(): { percentage: number; color: "danger" | "success" | "warning" } {
    const current_time = moment();
    const current_hour = current_time.hour();

    const start_hour = 7;
    const end_hour = 23;
    const total_available_hours = end_hour - start_hour;

    let color: "danger" | "success" | "warning" = "success";
    if (current_hour <= start_hour) {
      return {
        percentage: 100,
        color: "danger",
      };
    }

    const current_minute = current_time.minute();
    const current_minute_percent = (current_minute / 60) * 100;

    const hours_used = current_hour - start_hour;

    const used_time_percentage = (hours_used / total_available_hours) * 100;

    if (used_time_percentage <= 100 && used_time_percentage >= 70) {
      color = "success";
    }
    if (used_time_percentage < 70 && used_time_percentage >= 40) {
      color = "warning";
    }
    if (used_time_percentage < 40 && used_time_percentage >= 0) {
      color = "danger";
    }

    return {
      percentage: used_time_percentage,
      color: color,
    };
  }

  useEffect(() => {
    setInterval(() => setTime(moment().format("hh:mm:ss")), 1000);
  });
  return (
    <Box>
      <CssVarsProvider>
        <Sheet>
          <ChangeMode />
          <Stack height="100vh" alignItems="center" justifyContent="center">
            <Stack mt={1} alignItems="flex-end">
              <Typography level="h6">{get_time().percentage}%</Typography>
            </Stack>
            <Stack sx={{ position: "relative" }}>
              <CircularProgress
                determinate
                color={get_time().color}
                value={get_time().percentage}
                sx={{
                  "--CircularProgress-size": "300px",
                  "--CircularProgress-trackThickness": "16px",
                  "--CircularProgress-progressThickness": "16px",
                }}
              />
              <Stack
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                <Typography level="h6">{moment().format("DD MMMM YYYY")}</Typography>
                <Stack direction="row" spacing={1}>
                  <Typography level="h3" color="primary">
                    {time}
                  </Typography>
                  <Typography level="h6" color="neutral">
                    AM
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Sheet>
      </CssVarsProvider>
    </Box>
  );
}

export default App;
