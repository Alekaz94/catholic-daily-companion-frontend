import { z } from "zod";

export const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        path: ['confirmNewPassword'],
        message: 'Confirm password must match new password',
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        path: ['newPassword'],
        message: 'New password must not be the same as current password',
});

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
