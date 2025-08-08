import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";
import axios from "axios";
import { UPdateForm } from "../components/update-form";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const registerSchema = z.object({
    fullName: z
        .string()
        .min(1, "Full name is required")
        .max(100, "Full name must be at most 100 characters"),


    gender: z.enum(["male", "female", "other"], {
        required_error: "Gender is required",
    }),

    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address")
        .max(100, "Email must be at most 100 characters"),
});
const UpdateUsers = () => {
    const { userId } = useParams()
    const [user, setUser] = useState([])
    const [successMsg, setSuccessMesg] = useState('')
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:4000/api/users/${userId}`)
            console.log(response, 'response')
            if (response.data) {
                setUser(response.data)
            }
            reset({
                fullName: user.fullName,
                email: user.email,
                gender: user.gender,
            });
        } catch (error) {
            setError('Something go wrong')
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUsers()
    }, [userId])
    let n = 1
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);

    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
        setError,
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
        defaultValues: { ...user }
    });

    const onSubmit = async (data) => {
        console.log(data, 'data')
        try {
            const response = await axios.put(`http://127.0.0.1:4000/api/users/${userId}`, data)
            console.log('response', response)
            setServerError(null);
            console.log(data, 'data')
            navigate('/users');
            reset();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gray-50">
            <div className="w-full max-w-sm space-y-4">

                {serverError && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                        {serverError}
                    </div>
                )}
                <UPdateForm
                    onSubmit={handleSubmit(onSubmit)}
                    control={control}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    serverError={serverError}
                    value={user}
                />
            </div>
        </div>
    );
};

export default UpdateUsers;