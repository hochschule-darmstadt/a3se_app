import { Container, Stack, Text, Title } from "@mantine/core";

export function meta() {
  return [{ title: "Christopher Columbus Travel" }];
}

/** Placeholder proving the Customer application and shared UI package compose. */
export default function CustomerHome() {
  return (
    <Container component="main" py="xl" size="md">
      <Stack gap="sm">
        <Title order={1}>Christopher Columbus Travel</Title>
        <Text>Customer Interaction scaffold</Text>
      </Stack>
    </Container>
  );
}
