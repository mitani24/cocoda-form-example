import {
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
} from "@chakra-ui/react"
import { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import Form from "./Form"
import FormValidationState from "./FormValidationState"

const schema = z.object({
  username: z
    .string()
    .regex(/^\S{1,200}$/, { message: "1文字以上200文字以下" }),
  email: z
    .string()
    .regex(/^\S{1,256}$/, { message: "1文字以上256文字以下" })
    .email({ message: "適切なフォーマット" }),
  password: z
    .string()
    .regex(/^\S{6,72}$/, { message: "6文字以上72文字以下" })
    .regex(/[a-zA-Z0-9]/, { message: "半角英字/数字を1つは含む" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "記号は含めない" }),
})

type Inputs = z.infer<typeof schema>

export default function SignUpForm() {
  const onSubmit: SubmitHandler<Inputs> = (data, event) => {
    event?.preventDefault()
    console.log(data)
  }

  return (
    <Box width="md" p={6} boxShadow="2xl" bg="white" rounded={10}>
      <Form
        onSubmit={onSubmit}
        schema={schema}
        options={{ mode: "all", criteriaMode: "all" }}
      >
        {({ register, formState }) => {
          const { isValid, errors } = formState
          return (
            <VStack spacing={4}>
              <Heading>Sign up</Heading>

              <FormControl id="username" isInvalid={!!errors.username}>
                <FormLabel>Username</FormLabel>
                <Input variant="filled" type="text" {...register("username")} />
                <FormValidationState
                  formState={formState}
                  name="username"
                  schema={schema}
                />
              </FormControl>

              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input variant="filled" type="email" {...register("email")} />
                <FormValidationState
                  formState={formState}
                  name="email"
                  schema={schema}
                />
              </FormControl>

              <FormControl id="password" isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  variant="filled"
                  type="password"
                  {...register("password")}
                />
                <FormValidationState
                  formState={formState}
                  name="password"
                  schema={schema}
                />
              </FormControl>

              <Button colorScheme="teal" type="submit" disabled={!isValid}>
                Sign up
              </Button>
            </VStack>
          )
        }}
      </Form>
    </Box>
  )
}
