// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// import "./Input.css";

// const InputSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(2, "Too Short title!")
//     .max(100, "Too Long title!")
//     .required("Please enter a title"),
//   //   lastName: Yup.string()
//   //     .min(2, "Too Short!")
//   //     .max(50, "Too Long!")
//   //     .required("Required"),
//   //email: Yup.string().email("Invalid email").required("Required"),
// });

// function Input(props) {
//   // const element = props.element === "input" ? (
//   //     <input id={props.id} type={props.type} placeholder={props.placeholder} />
//   // ) : (
//   //     <textarea id={props.id} rows={props.rows || 3} />
//   // );

//   const handleSubmit = (values) => {
//     console.log(values);
//   };
//   return (
//     <div className={`form-control`}>
//       <Formik
//         initialValues={{
//           title: "",
//           email: "",
//         }}
//         validationSchema={InputSchema}
//         onSubmit={handleSubmit}
//       >
//         <Form>
//           <div className="form-control">
//             <label htmlFor={props.id}>{props.label}</label>
//             <Field type="text" name="title" className="form-control" />
//             <ErrorMessage
//               className="form-control-invalid"
//               name="title"
//               component="div"
//             />
//           </div>
//           <div className="form-control">
//             <button className="btn btn-primary" type="submit">
//               submit
//             </button>
//           </div>
//         </Form>
//       </Formik>
//     </div>
//     // <div className={`form-control`}>
//     //     <label htmlFor={props.id}>{props.label}</label>
//     //     {element}
//     //     {props.errorText && <p>{props.errorText}</p>}
//     // </div>
//   );
// }

// export default Input;
