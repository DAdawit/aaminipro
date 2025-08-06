import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // Build user object without the file itself
    const userPayload = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      sex: data.sex,
      age: Number(data.age),
      profilePicture: data.profilePicture[0]?.name || "",
    };

    const formData = new FormData();
    formData.append("fullname", userPayload.fullname);
    formData.append("email", userPayload.email);
    formData.append("password", userPayload.password);
    formData.append("sex", userPayload.sex);
    formData.append("age", userPayload.age);
    if (data.profilePicture && data.profilePicture[0]) {
      formData.append("profilePicture", data.profilePicture[0]);
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users",
        formData
      );
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 max-w-md mx-auto"
    >
      <div>
        <label>Full Name</label>
        <input
          type="text"
          {...register("fullname", {
            required: "Full name is required",
            maxLength: { value: 50, message: "Max 50 characters" },
          })}
          className="border w-full p-2"
        />
        {errors.fullname && (
          <p className="text-red-500">{errors.fullname.message}</p>
        )}
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          className="border w-full p-2"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label>Sex</label>
        <select
          {...register("sex", { required: "Sex is required" })}
          className="border w-full p-2"
        >
          <option value="">Select sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.sex && <p className="text-red-500">{errors.sex.message}</p>}
      </div>

      <div>
        <label>Age</label>
        <input
          type="number"
          {...register("age", {
            required: "Age is required",
            min: { value: 1, message: "Must be at least 1" },
            max: { value: 120, message: "Unrealistic age" },
          })}
          className="border w-full p-2"
        />
        {errors.age && <p className="text-red-500">{errors.age.message}</p>}
      </div>

      <div>
        <label>Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          {...register("profilePicture", {
            required: "Profile picture is required",
          })}
          className="border w-full p-2"
        />
        {errors.profilePicture && (
          <p className="text-red-500">{errors.profilePicture.message}</p>
        )}
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
          className="border w-full p-2"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Register
      </button>
    </form>
  );
}
