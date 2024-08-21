// Show loading spinner upon loading data from API's
const LoadingSpinner = () => {
  return (
    <div className="spinner">
        <img className="hidden lg:block w-40 h-40" src="/images/Spiral_logo_loader.gif" alt="loader"/>
    </div>
  );
};

export default LoadingSpinner;
