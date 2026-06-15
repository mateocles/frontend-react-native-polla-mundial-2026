import Typography from "./Typography";

// Mensaje centrado para listas vacías.
export default function EmptyState({ message }) {
  return (
    <Typography variant="body-sm" className="text-center mt-10">
      {message}
    </Typography>
  );
}
