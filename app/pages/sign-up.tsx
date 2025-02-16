import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  classroomCode: z.string().nonempty('Classroom code is required'),
  userId: z.string().length(6, 'ID must be 6 characters long'),
  role: z.enum(['teacher', 'student']),
  verificationCode: z.string().nonempty('Verification code is required'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function CustomSignUp() {
  const { isLoaded, signUp } = useSignUp();
  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    if (!isLoaded) return;

    try {
      // Step 1: Create Clerk user
      const user = await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // Step 2: Attempt email address verification
      await signUp.attemptEmailAddressVerification({
        code: data.verificationCode,
      });

      // Step 3: Update user metadata using Clerk's REST API
      const apiKey = process.env.CLERK_API_KEY; // Ensure this is set in your .env.local
      const response = await fetch(`https://api.clerk.dev/v1/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_metadata: {
            classroomCode: data.classroomCode,
            userId: data.userId,
            role: data.role,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user metadata');
      }

      // Redirect or show success message
      alert('Sign-up successful!');
      window.location.href = '/dashboard'; // Redirect to the desired route
    } catch (err) {
      console.error(err);
      alert('Failed to sign up: ' + (err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
      <Controller
        name="email"
        control={control}
        render={({ field }) => <input {...field} placeholder="Email Address" />}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => <input {...field} placeholder="Password" type="password" />}
      />
      <Controller
        name="classroomCode"
        control={control}
        render={({ field }) => <input {...field} placeholder="Classroom Code" />}
      />
      <Controller
        name="userId"
        control={control}
        render={({ field }) => <input {...field} placeholder="6-digit ID" />}
      />
      <Controller
        name="verificationCode"
        control={control}
        render={({ field }) => <input {...field} placeholder="Verification Code" />}
      />
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <select {...field}>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        )}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
