import React, { useState, useEffect } from 'react';
import axios from './../axios.js';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { Button, TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import Grid from '@mui/material/Grid'; // Grid version 1
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2

function SearchView(onConditions) {
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    // 그거 시작시간 끝시간 역행하지않게 체크해줘야함 끝시간이 스타트 시작보다 긴지. 확인하고 경고창 띄워주기

    setSubmitting(true);

    // 엔드타임을 기본으로 3분뒤 시간으로 정해주자

    const duration = 3;
    let endTimeTemp = new Date(startTime);
    endTimeTemp.setMinutes(startTime.getMinutes() + duration);

    setEndTime(endTimeTemp);
    console.log(date, startTime, endTime);
    // https://devhints.io/moment
    // 포맷 바꿔서 서버에 전달
    let conditions = {
      date: date.format('YYYY-MM-DD'),
      startTime: startTime.format('HH:mm:ss'),
      endTime: endTime.format('HH:mm:ss'),
    };

    onConditions(conditions);
    // const res = await axios.post('/metas', conditions); // 서버로

    event.preventDefault();
  };

  useEffect(() => {
    if (submitting) {
      setSubmitting(false);
    }
  }, [submitting]);
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Container maxWidth='sm'>
          <Box sx={{ my: 10 }}>
            <Typography variant='h4' component='h1' gutterBottom>
              IPFS Viewer
            </Typography>

            <DatePicker
              label='Select Date'
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              label='Start Time'
              value={startTime}
              onChange={(newValue) => {
                setStartTime(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            {/* <TimePicker
              label='end Time'
              value={endTime}
              onChange={(newValue) => {
                setEndTime(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            /> */}

            <Button
              type='submit'
              size='large'
              variant='contained'
              onClick={handleSubmit}
            >
              Search
            </Button>
          </Box>
        </Container>
      </LocalizationProvider>
    </>
  );
}

export default SearchView;
