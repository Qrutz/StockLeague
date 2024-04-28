import logo from "../../assets/Logo.svg"; // Uncomment and use your logo

const LoadingComponent = () => {
    return (
        <div className="fixed inset-0 dark:bg-slate-950 flex justify-center items-center">
            <div className=" animate-pulse">
                <img src={logo} alt="Logo" className="h-40 w-40 object-contain" />
            </div>
        </div>
    );
};

export default LoadingComponent;
