// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";
// import RegistrationForm, { RegisterForm } from "../components/register-form";
// import z from "zod";
// import useUser from "../hooks/use-user";
// // import api from "../lib/axios-instance";

import RegistrationForm from "../components/register-form";

// import axios from "axios";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
// export const registerSchema = z.object({
//   fullName: z
//     .string()
//     .min(1, "Full name is required")
//     .max(100, "Full name must be at most 100 characters"),

//   role: z.enum(["guest", "admin"], {
//     required_error: "Role is required",
//   }),

//   gender: z.enum(["male", "female"], {
//     required_error: "Gender is required",
//   }),

//   email: z
//     .string()
//     .min(1, "Email is required")
//     .email("Invalid email address")
//     .max(100, "Email must be at most 100 characters"),

//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .max(32, "Password must be at most 32 characters")
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
//       "Password must contain at least one uppercase, one lowercase, one number and one special character"
//     ),

//   profile: z
//     .instanceof(FileList)
//     .refine((files) => files.length === 1, "Only one file is allowed")
//     .refine((files) => files[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
//     .refine(
//       (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
//       "Only .jpg, .jpeg, .png formats are supported"
//     ),
// });
const Registration = () => {
  // const { login } = useUser();
  // const navigate = useNavigate();
  // const [serverError, setServerError] = useState(null);

  // const {
  //   handleSubmit,
  //   control,
  //   formState: { errors, isSubmitting },
  //   reset,
  //   setError,
  // } = useForm({
  //   resolver: zodResolver(registerSchema),
  //   mode: "onBlur",
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //     profile: "",
  //   },
  // });

  // const onSubmit = async (data) => {
  //   console.log({ data });
  //   const formData = new FormData();

  //   formData.append("fullname", data.fullName);
  //   formData.append("email", data.email);
  //   formData.append("sex", data.sex);
  //   formData.append("age", data.age);
  //   formData.append("password", data.password);

  //   // Object.keys(data).forEach((key) => {
  //   //   console.log({ key });
  //   //   formData.append(key, data[key]);
  //   // });
  //   console.log(formData, "form-data");
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:4000/api/users",
  //       formData,
  //       {
  //         "Content-Type": "multipart/form-data",
  //       }
  //     );
  //     console.log("response", response);
  //     setServerError(null);
  //     console.log(data, "data");
  //     // navigate('/');
  //     // Reset form
  //     reset();
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gray-50">
      {/* <div className="w-full max-w-sm space-y-4">
        {serverError && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {serverError}
          </div>
        )} */}
      <RegistrationForm
      // onSubmit={handleSubmit(onSubmit)}
      // control={control}
      // errors={errors}
      // isSubmitting={isSubmitting}
      // serverError={serverError}
      />
    </div>
    // </div>
  );
};

export default Registration;
