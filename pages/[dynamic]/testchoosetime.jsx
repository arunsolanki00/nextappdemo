import React, { useState } from 'react';
import Choosetime from '../../components/Common/choose-time.component';
import Datepicker from '../../components/Common/date-picker.component';

const TestChoosetime = () => {
    const [timestate, settimestate] = useState(false);
    const [datestate, setdatestate] = useState(false);
    const testtimeclick = () => {
        settimestate(true);
    }
    const testdateclick = () => {
        setdatestate(true);
    }
    return (
        <>
            <button
                onClick={() => testtimeclick()}
                data-toggle="modal"
                data-target="#myModal-timer"
            >Click me for Timepicker</button>
            <button
                onClick={() => testdateclick()}
                data-toggle="modal"
                data-target="#myModal-calander"
            >Click me for Datepicker</button>
            {timestate === true && <Choosetime />}
            {datestate === true && <Datepicker />}
        </>
    )
}

export default TestChoosetime;