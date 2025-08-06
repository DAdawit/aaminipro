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

export const RegisterForm = React.memo(
  ({ className, onSubmit, control, errors, isSubmitting, serverError }) => {
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
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>Join our community today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
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
                    aria-invalid={errors.fullName ? "true" : "false"}
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

            {/* Role Field (Dropdown) */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="role"
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none ${
                      errors.role ? "border-destructive" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Role</option>
                    <option value="guest">Guest</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
              />
              {errors.role && (
                <p className="text-sm text-destructive mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Gender Field (Radio Buttons) */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="radio"
                        value="male"
                        checked={field.value === "male"}
                        className="accent-primary"
                      />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="radio"
                        value="female"
                        checked={field.value === "female"}
                        className="accent-primary"
                      />
                      <span>Female</span>
                    </label>
                  </div>
                )}
              />
              {errors.gender && (
                <p className="text-sm text-destructive mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
            {/* Email Field */}
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
                    placeholder="your@email.com"
                    autoComplete="email"
                    aria-invalid={errors.email ? "true" : "false"}
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

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={errors.password ? "true" : "false"}
                      className={errors.password && "border-destructive"}
                    />
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-sm ${
                            getPasswordStrength(field.value) >= i
                              ? i > 2
                                ? "bg-green-500"
                                : "bg-yellow-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Profile Image Field */}
            <div className="space-y-2">
              <Label htmlFor="profile">Profile Image</Label>
              <Controller
                name="profile"
                control={control}
                render={({ field }) => {
                  const { value, onChange, ...rest } = field;
                  return (
                    <>
                      <Input
                        {...rest}
                        id="profile"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => onChange(e.target.files)}
                        aria-invalid={errors.profile ? "true" : "false"}
                        className={errors.profile && "border-destructive"}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        JPEG, PNG
                      </p>
                    </>
                  );
                }}
              />
              {errors.profile && (
                <p className="text-sm text-destructive mt-1">
                  {errors.profile.message}
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
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary underline underline-offset-4"
            >
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }
);

RegisterForm.displayName = "RegisterForm";
