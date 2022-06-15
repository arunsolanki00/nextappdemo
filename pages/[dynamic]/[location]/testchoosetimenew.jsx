import React, { useState } from 'react';
import ChoosetimeNew from '../../../components/Common/choose-time.componentnew';
import DatepickerNew from '../../../components/Common/date-picker.componentnew';

const TestChoosetimeNew = () => {
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
            {timestate === true && <ChoosetimeNew />}
            {datestate === true && <DatepickerNew />}
        </>
    )
}

export default TestChoosetimeNew;