import { z } from "zod";
export const nameChangeSchema = z.object({
    currentFirstName: z.string().optional(),
    newFirstName: z.string().optional(),
    currentLastName: z.string().optional(),
    newLastName: z.string().optional(),
})
.refine((data) => 
    (data.newFirstName && data.newFirstName.length >= 3) || 
    (data.newLastName && data.newLastName.length >= 3), 
    {
        message: "At least one new name must be provided and at least 3 characters long.",
    }
)
.refine((data) => !data.newFirstName || data.newFirstName !== data.currentFirstName, {
    path: ["newFirstName"],
    message: "New firstname must not be the same as current firstname"
})
.refine((data) => !data.newLastName || data.newLastName !== data.currentLastName, {
    path: ["newLastName"],
    message: "New lastname must not be the same as current lastname"
})

export type NameChangeInput = z.infer<typeof nameChangeSchema>;