"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Github as GithubIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import type { ChangeEvent, FC } from "react";
import type { FieldValues, SubmitHandler } from "react-hook-form";

import AuthInputFields from "@/app/constants/AuthInputFields";
import { AuthSocialButton, Button, Input, UploadInput } from "@/components";
import { GoogleIcon } from "@/public";

const AuthForm: FC = () => {
  const [variant, setVariant] = useState<AuthVariant>("REGISTER");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const session = useSession();
  const router = useRouter();

  type AuthVariant = "LOGIN" | "REGISTER";

  const toggleVariant = useCallback(() => {
    const v = variant === "LOGIN" ? "REGISTER" : "LOGIN";
    setVariant(v);
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      avatar: null,
    },
  });

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files ? e.target.files[0] : null;
    if (!uploadedFile) {
      return;
    }

    setAvatar(uploadedFile);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    data.avatar = avatar;

    if (variant === "REGISTER") {
      const formData = new FormData();
      for (const [k, v] of Object.entries(data)) {
        formData.append(k, v);
      }

      fetch("/api/register", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() =>
          signIn("credentials", {
            ...data,
            redirect: false,
          })
        )
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials!");
          }

          if (callback?.ok) {
            router.push("/");
          }
        })
        .catch((e) => toast.error(`There was an error signing you in: ${e}`))
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials!");
          } else {
            toast.success("Logged In");
            router.push("/");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: true })
      .then((callback) => {
        callback?.error && toast.error("Invalid Credentials");
        if (!callback?.error) {
          router.push("/");
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  return (
    <div className="col-v min-h-screen bg-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          height="48"
          width="48"
          alt="Logo"
          className="w-15.5 mx-auto h-12"
          src="/logo-small.webp"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {variant === "REGISTER" ? "Sign up" : "Sign in to your account"}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form
            action=""
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {AuthInputFields.map(
              (field) =>
                (!field.showOnRegister || variant === "REGISTER") && (
                  <Input
                    key={field.id}
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                    {...field}
                  />
                )
            )}
            {/* Avatar should only be present on sign up */}
            {variant === "REGISTER" && (
              <UploadInput handleUpload={handleUpload} />
            )}
            <div>
              <Button disabled={isLoading} isFullWidth type="submit">
                {variant === "LOGIN" ? "Sign in" : "Register"}
              </Button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="col-h absolute inset-0">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="row-h relative flex text-sm">
                <span className="-mt-2.5 bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              {[
                { icon: GithubIcon, provider: "github" },
                { icon: GoogleIcon, provider: "google" },
              ].map((action, index) => (
                <AuthSocialButton
                  key={index}
                  icon={action.icon}
                  onClick={() => socialAction(action.provider)}
                />
              ))}
            </div>
          </div>
          <div className="row-h mt-6 gap-2 px-2 text-sm text-gray-500">
            <div>
              {variant === "LOGIN"
                ? "New to this website?"
                : "Already have an account?"}
            </div>
            <div onClick={toggleVariant} className="pointer text-sky-500">
              {variant === "LOGIN" ? "Create an account" : "Login"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
