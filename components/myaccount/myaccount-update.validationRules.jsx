export default function validate(values) {
  let errors = {};
  if (!values.emailId) {
    errors.emailId = "Email address is required";
  }
  if (!/\S+@\S+\.\S+/.test(values.emailId)) {
    errors.emailId = "Email address is invalid";
  }
  if (!values.firstname) {
    errors.firstname = "First name is required";
  }
  if (!values.lastname) {
    errors.lastname = "Last name is required";
  }

  if(values.validatePassword){
    if (!values.confirmpassword) {
      errors.confirmpassword = "Confirm password is required";
    }

    if (!values.newpassword) {
      errors.newpassword = "New password is required";
    }
    if(values.newpassword){
      if(!values.confirmpassword){
      errors.confirmpassword = "please enter the confirm password";
      }
      else if (values.confirmpassword !== values.newpassword) {
        errors.confirmpassword = "New Password and confirm password must be same";
      }
    }


    // if (values.confirmpassword !== values.newpassword) {
    //   errors.confirmpassword = "New Password and confirm password must be same";
    // }
  }
  return errors;
}