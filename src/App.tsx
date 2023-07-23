import React, { useEffect, useState } from "react";
import "./App.css";
import { useColorScheme } from "@mui/joy/styles";
import { Box, Stack, Typography, CssVarsProvider, Sheet, CircularProgress, Switch } from "@mui/joy";
import moment from "moment";

const ChangeMode = () => {
  const { mode, setMode } = useColorScheme();

  return (
    <Switch
      checked={mode === "dark"}
      onChange={(e: any) => setMode(e.target.checked ? "dark" : "light")}
    ></Switch>
  );
};

type GET_USED_PERCENTAGE_PROPS = {
  start_hour: number;
  end_hour: number;
};
type Color = "success" | "danger" | "warning";

type GET_USED_PERCENTAGE_RETURN = {
  used_percent: number;
  color: Color;
  hours_left: number;
  hours_used: number;
};

function App() {
  const [time, setTime] = useState("");
  const [dailyTimeData, setDailyTimeData] = useState<GET_USED_PERCENTAGE_RETURN>(
    {} as GET_USED_PERCENTAGE_RETURN
  );
  const [OfficeTimeData, setOfficeTimeData] = useState<GET_USED_PERCENTAGE_RETURN>(
    {} as GET_USED_PERCENTAGE_RETURN
  );

  function get_user_percentage_data(props: GET_USED_PERCENTAGE_PROPS): GET_USED_PERCENTAGE_RETURN {
    const { start_hour, end_hour } = props;

    const current_hour = moment().hour();
    const current_minute = moment().minute();

    const total_available_hours = end_hour - start_hour;
    const current_minute_percent = Number((current_minute / 60).toFixed(2));
    const current_hour_with_minute = current_hour + current_minute_percent;
    const hours_used = current_hour_with_minute - start_hour;
    if (current_hour <= start_hour || current_hour >= end_hour) {
      return {
        used_percent: 100,
        color: "danger",
        hours_left: 0,
        hours_used: total_available_hours,
      };
    }

    function round(num: number): number {
      return Number((Math.round(num * 100) / 100).toFixed(2));
    }
    const used_time_percentage = (hours_used / total_available_hours) * 100;

    let color: Color = "success";
    if (used_time_percentage <= 100 && used_time_percentage >= 70) {
      color = "danger";
    }
    if (used_time_percentage < 70 && used_time_percentage >= 40) {
      color = "warning";
    }
    if (used_time_percentage < 40 && used_time_percentage >= 0) {
      color = "success";
    }

    return {
      used_percent: round(used_time_percentage),
      color: color,
      hours_left: round(total_available_hours - hours_used),
      hours_used: round(hours_used),
    };
  }

  useEffect(() => {
    setInterval(() => {
      setTime(moment().format("hh:mm:ss"));
      setDailyTimeData(get_user_percentage_data({ end_hour: 23, start_hour: 7 }));
      setOfficeTimeData(get_user_percentage_data({ end_hour: 17.5, start_hour: 9 }));
    }, 1000);
  });
  return (
    <Box>
      <CssVarsProvider>
        <Sheet>
          <Stack spacing={2} height="96.6vh" p={2} alignItems="center" justifyContent="center">
            <ChangeMode />
            <Typography level="h2" color="info">
              {moment().format("DD MMMM YYYY")}
            </Typography>

            <Stack sx={{ position: "relative" }}>
              <CircularProgress
                determinate
                color={dailyTimeData.color}
                value={dailyTimeData.used_percent}
                sx={{
                  "--CircularProgress-size": "300px",
                  "--CircularProgress-trackThickness": "26px",
                  "--CircularProgress-progressThickness": "26px",
                }}
              />
              <Stack
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
                alignItems="center"
                spacing={1}
              >
                <Stack mt={1} alignItems="flex-end">
                  <Typography color={dailyTimeData.color} level="h2">
                    {dailyTimeData.used_percent}%
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography level="h3" color="primary">
                    {time}
                  </Typography>
                  <Typography level="h6" color="neutral">
                    AM
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Typography color="danger" level="body1">
                    {dailyTimeData.hours_used}
                  </Typography>
                  <Typography color="success" level="body1">
                    {dailyTimeData.hours_left}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack mt={2} sx={{ position: "relative" }}>
              <CircularProgress
                determinate
                color={OfficeTimeData.color}
                value={OfficeTimeData.used_percent}
                sx={{
                  "--CircularProgress-size": "150px",
                  "--CircularProgress-trackThickness": "13px",
                  "--CircularProgress-progressThickness": "13px",
                }}
              />
              <Stack
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
                alignItems="center"
                spacing={1}
              >
                <Stack mt={1} alignItems="center">
                  <Typography color={OfficeTimeData.color} level="h4">
                    {OfficeTimeData.used_percent}%
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography color="danger" level="body4">
                      {OfficeTimeData.hours_used}
                    </Typography>
                    <Typography color="success" level="body4">
                      {OfficeTimeData.hours_left}
                    </Typography>
                  </Stack>
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
