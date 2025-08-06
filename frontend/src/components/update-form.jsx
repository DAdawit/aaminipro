import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

export const UPdateForm = React.memo(
    ({
        className,
        onSubmit,
        control,
        errors,
        isSubmitting,
        serverError,
        mode = "update",
        value
    }) => {
        const isUpdate = mode === "update";

        const getPasswordStrength = (password = "") => {
            if (!password) return 0;
            let strength = 0;
            if (password.length >= 8) strength += 1;
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            return strength;
        };

        return (
            <Card className={cn("w-full max-w-md", className)}>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {isUpdate ? "Update Your Account" : "Create Your Account"}
                    </CardTitle>
                    <CardDescription>
                        {isUpdate ? "Edit your details below" : "Join our community today"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        autoComplete="name"
                                        defaultValue={value.fullname || ""}
                                        className={errors.fullName && "border-destructive"}
                                    />
                                )}
                            />
                            {errors.fullName && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        {/* Role */}
                        {/* <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        id="role"
                                        defaultValue={value.role}
                                        value={value.role}
                                        className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none ${errors.role ? "border-destructive" : "border-gray-300"}`}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                    </select>
                                )}
                            />
                            {errors.role && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.role.message}
                                </p>
                            )}
                        </div> */}

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Controller
                                name="gender"
                                control={control}
                                defaultValue={'male'}
                                render={({ field }) => (
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                value="male"
                                                checked={field.value === "male"}
                                                onChange={field.onChange}
                                                className="accent-primary"
                                            />
                                            <span>Male</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                value="female"
                                                checked={field.value === "female"}
                                                onChange={field.onChange}
                                                className="accent-primary"
                                            />
                                            <span>Female</span>
                                        </label>
                                    </div>
                                )}
                            />
                            {errors.gender && (
                                <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>
                            )}
                        </div>


                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        defaultValue={value.email || ""}
                                        className={errors.email && "border-destructive"}
                                    />
                                )}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Server Error */}
                        {serverError && (
                            <div className="text-sm text-destructive text-center py-2">
                                {serverError}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isUpdate ? "Updating..." : "Creating account..."}
                                </>
                            ) : (
                                isUpdate ? "Update" : "Register"
                            )}
                        </Button>
                    </form>

                    {!isUpdate && (
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="text-primary underline underline-offset-4">
                                Sign in
                            </a>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }
);

UPdateForm.displayName = "UPdateForm";

