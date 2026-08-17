import { Container, Stack, Text, Title } from "@mantine/core";

export function meta() {
  return [{ title: "CCT Staff" }];
}

/** Placeholder proving the Staff application and shared UI package compose. */
export default function StaffHome() {
  return (
    <Container component="main" fluid py="md">
      <Stack gap="xs">
        <Title order={1}>CCT Staff</Title>
        <Text>Staff Interaction scaffold</Text>
      </Stack>
    </Container>
  );
}
