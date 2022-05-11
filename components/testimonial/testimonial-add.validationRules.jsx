export default function validate(values) {
  let errors = {};
  if (!values.email) {
    errors.email = "Email address is required";
  }
  if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid";
  }
  if (!values.name) {
    errors.name = "Name is required";
  }
  // if (!values.phone) {
  //   errors.phone = "Phone Number is required";
  // }
  if (!values.comment) {
    errors.comment = "Comment is required";
  }
  if (!values.custom_testimonial_phone) {
    errors.custom_testimonial_phone = "Phone Number is required";
  }
  return errors;
}

