const Loader = () => {
  return (
    <div className="row h-screen">
      <div className="lds-spinner text-q">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} />
        ))}
      </div>
    </div>
  );
};

export default Loader;
