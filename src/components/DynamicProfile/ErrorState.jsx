const ErrorState = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-2">⚠️</div>
        <p className="text-gray-600">Something went wrong while loading the profile.</p>
      </div>
    </div>
  );
};

export default ErrorState;