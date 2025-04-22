interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
      {message}
    </div>
  );
}
