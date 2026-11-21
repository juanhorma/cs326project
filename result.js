export const Ok = (value) => ({
  ok: true,
  value,
});

export const Err = (status, message) => ({
  ok: false,
  error: { status, message },
});
