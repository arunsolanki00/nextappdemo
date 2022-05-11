import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));


const Datepicker = () => {
    const classes = useStyles();

    return (
        <div id="myModal-calander" className="modal fade" role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                            <button type="button" className="close" data-dismiss="modal"><img src="/images/close.svg" alt="" /></button>
                        </div>
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                            <div className="app">
                                <div className="app__main">
                                    <div className="calendar">
                                        {/* <div id="calendar"></div> */}
                                        <form className={classes.container} noValidate>
                                            <TextField
                                                id="date"
                                                label=""
                                                type="date"
                                                defaultValue="2017-05-24"
                                                className={classes.textField}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 text-center col-sm-12 col-xs-12">
                            <a className="blue_btn nextbtn" data-toggle="modal" data-target="#myModal-timer" data-dismiss="modal">Next</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Datepicker;