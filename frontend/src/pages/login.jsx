import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginForm } from "../components/login-form";
import useUser from "../hooks/use-user";
import { useNavigate } from "react-router-dom";

// Zod validation schema
const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must not exceed 32 characters"),
});

const Login = () => {
    const { login } = useUser()
    const navigate = useNavigate()
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        console.log({ ...data, token: 'eyey' })
        login({ ...data, token: 'yes' })
        navigate('/')
        // try {
        //     const response = await axios.post('/api/auth/login', data, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             // 'X-XSRF-TOKEN': 'jjjj'  //protection
        //         },
        //         withCredentials: true
        //     });
        //     reset();
        // } catch (error) {
        //     console.error("Login error:", error);
        // }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-6 md:p-10">
                <LoginForm
                    onSubmit={handleSubmit(onSubmit)}
                    control={control}
                    errors={errors}
                    isSubmitting={isSubmitting}
                />
        </div>
    );
};

export default Login;